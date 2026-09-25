---
name: sync-match-integrity
description: 실시간 경기 데이터(match, play)의 무결성을 5대 항목별로 정밀 검사하여, 입력이 완결된 정상 경기는 phase='done'으로 자동 승격하고 비정상/방치 세션은 isHide=true로 소프트 딜리트(은닉) 처리합니다. 경기 데이터 무결성 검사, 방치 세션 정리, 경기 상태 보정을 수행할 때 실행합니다.
---

# 경기 데이터 무결성 검사 및 소프트 딜리트 스킬 (sync-match-integrity)

이 스킬은 `zzz-picker`의 실시간 경기 데이터(`match`, `play`)를 5대 정밀 체크리스트로 평가하여, **물리적 데이터 삭제(DELETE) 없이** 아래 2가지 작업을 안전하게 수행하는 운영 자동화 스킬입니다:

1. **정상 경기 승격**: 모든 데이터(선수, 보스, 슬롯, 점수)가 완결되었으나 호스트가 완료를 누르지 않은 경기를 **`phase = 'done'`**으로 자동 보정.
2. **소프트 딜리트**: 24시간 이상 방치된 결손/미완료 세션을 **`isHide = true`**로 마킹하여 서비스 조회에서 안전하게 가림 처리.

---

## 1. 5대 무결성 검사 체크리스트

하나의 매치를 평가할 때 아래 5개 항목을 순차 검증합니다:

| 검사 항목 | 검사 대상 필드 | 통과 기준 (PASS) | 이상치 기준 (FAIL) |
| :--- | :--- | :--- | :--- |
| **1. 참가자 완결성** | `COUNT(play.id)`, `role` | A선수 1명, B선수 1명 **정확히 2명** 존재 | 선수가 0명이거나 1명뿐인 방 |
| **2. 보스 선택 완결성** | `play.boss` (`uuid[]`) | 1R/2R 보스 2개 UUID가 유효하게 채워짐 | 보스가 `[null, null]`이거나 결손된 상태 |
| **3. 파티 슬롯 완결성** | `play.agentSlot` (`jsonb`) | 1R(3명) + 2R(3명) **총 6개 슬롯 모두 캐릭터 ID 존재** | 픽 도중 나가서 슬롯에 `null`이 남아있는 상태 |
| **4. 점수/시간 완결성** | `play.score`, `time` | 실제 클리어 점수가 1건이라도 유효하게 기록됨 (`score > 0`) | 양 선수 모두 1R/2R 점수가 `0`점이고 시간도 `0`초 |
| **5. 유예 기간 (Grace)** | `match."createdAt"` | 생성된 지 **24시간 이내**인 방은 진행 중으로 인정 | 생성 후 **24시간 이상** 경과한 방에만 최종 판정 적용 |

---

## 2. 실행 워크플로우

### [1단계] 사전 진단 (Dry-Run)
데이터를 변경하기 전, Supabase MCP `execute_sql` 도구로 현재 상태를 시뮬레이션 진단합니다.

```sql
WITH match_checklist AS (
  SELECT 
    m.id,
    m.phase,
    (COUNT(p.id) = 2 AND COUNT(DISTINCT p.role) = 2) as pass_players,
    bool_and(array_length(p.boss, 1) = 2 AND p.boss[1] IS NOT NULL AND p.boss[2] IS NOT NULL) as pass_bosses,
    bool_and(
      jsonb_array_length(p."agentSlot") = 2 AND
      (p."agentSlot"->0->0->>'id') IS NOT NULL AND
      (p."agentSlot"->0->1->>'id') IS NOT NULL AND
      (p."agentSlot"->0->2->>'id') IS NOT NULL AND
      (p."agentSlot"->1->0->>'id') IS NOT NULL AND
      (p."agentSlot"->1->1->>'id') IS NOT NULL AND
      (p."agentSlot"->1->2->>'id') IS NOT NULL
    ) as pass_agent_slots,
    bool_or(p.score[1] > 0 OR p.score[2] > 0) as pass_scores,
    (m."createdAt" < NOW() - INTERVAL '24 hours') as is_expired
  FROM public.match m
  LEFT JOIN public.play p ON p."matchId" = m.id
  WHERE m."isHide" = false
  GROUP BY m.id, m.phase, m."createdAt"
)
SELECT 
  CASE 
    WHEN phase = 'done' THEN '1. 정상 완료 유지'
    WHEN pass_players = true AND pass_bosses = true AND pass_agent_slots = true AND pass_scores = true 
      THEN '2. [승격 예정] phase=done'
    WHEN is_expired = true AND (pass_players = false OR pass_bosses = false OR pass_agent_slots = false OR pass_scores = false)
      THEN '3. [은닉 예정] isHide=true'
    ELSE '4. 24시간 이내 진행 중 (보호)'
  END as action,
  COUNT(*) as match_count
FROM match_checklist
GROUP BY 1
ORDER BY 1;
```

---

### [2단계] 동기화 실행 (2-Pass Sync)
Supabase MCP `execute_sql` 도구를 통해 아래 단일 트랜잭션 쿼리를 실행하여 안전하게 동기화합니다.

```sql
BEGIN;

-- 1. 무결성 평가 임시 테이블 생성
CREATE TEMP TABLE tmp_integrity_sync AS
SELECT 
  m.id,
  m.phase,
  (COUNT(p.id) = 2 AND COUNT(DISTINCT p.role) = 2) as pass_players,
  bool_and(array_length(p.boss, 1) = 2 AND p.boss[1] IS NOT NULL AND p.boss[2] IS NOT NULL) as pass_bosses,
  bool_and(
    jsonb_array_length(p."agentSlot") = 2 AND
    (p."agentSlot"->0->0->>'id') IS NOT NULL AND
    (p."agentSlot"->0->1->>'id') IS NOT NULL AND
    (p."agentSlot"->0->2->>'id') IS NOT NULL AND
    (p."agentSlot"->1->0->>'id') IS NOT NULL AND
    (p."agentSlot"->1->1->>'id') IS NOT NULL AND
    (p."agentSlot"->1->2->>'id') IS NOT NULL
  ) as pass_agent_slots,
  bool_or(p.score[1] > 0 OR p.score[2] > 0) as pass_scores,
  (m."createdAt" < NOW() - INTERVAL '24 hours') as is_expired
FROM public.match m
LEFT JOIN public.play p ON p."matchId" = m.id
WHERE m."isHide" = false
GROUP BY m.id, m.phase, m."createdAt";

-- 2. [Pass 1] 정상 완결 경기 phase = 'done' 자동 승격
UPDATE public.match
SET phase = 'done'
WHERE id IN (
  SELECT id FROM tmp_integrity_sync
  WHERE phase != 'done'
    AND pass_players = true 
    AND pass_bosses = true 
    AND pass_agent_slots = true 
    AND pass_scores = true
);

-- 3. [Pass 2] 24시간 이상 경과된 결손/방치 룸 isHide = true 소프트 딜리트
UPDATE public.match
SET "isHide" = true
WHERE id IN (
  SELECT id FROM tmp_integrity_sync
  WHERE is_expired = true
    AND (pass_players = false OR pass_bosses = false OR pass_agent_slots = false OR pass_scores = false)
);

COMMIT;
```

---

### [3단계] 사후 검증 및 통계 리포트
동기화 완료 후 아래 쿼리를 실행하여 결과를 최종 검증하고 사용자에게 브리핑합니다:

```sql
SELECT 
  COUNT(CASE WHEN phase = 'done' AND "isHide" = false THEN 1 END) as official_completed_matches,
  COUNT(CASE WHEN "isHide" = true THEN 1 END) as hidden_stale_matches,
  COUNT(CASE WHEN "isHide" = false AND phase != 'done' THEN 1 END) as active_in_progress_matches,
  COUNT(*) as total_matches
FROM public.match;
```

---

### [4단계] 디스코드 브리핑 발송 (`send-discord-webhook`)
사후 검증 쿼리 결과를 바탕으로 [`send-discord-webhook`](../send-discord-webhook/SKILL.md) 스킬을 실행하여 디스코드 채널에 결과를 브리핑합니다:

```bash
node --experimental-strip-types .agent/skills/send-discord-webhook/scripts/send.ts \
  --type match-integrity \
  --data '{
    "promotedCount": [승격 건수],
    "hiddenCount": [은닉 건수],
    "officialCount": [공식 완료 경기 수],
    "activeCount": [진행 중 경기 수],
    "totalCount": [총 경기 수],
    "executionMode": "auto"
  }'
```

> **오류 발생 시**: 동기화 과정 중 에러가 발생한 경우 `type: system-failure`로 즉시 장애 알림을 발송합니다.

---

## 3. 관련 룰 및 문서

| 문서명 | 경로 | 설명 |
| :--- | :--- | :--- |
| **디스코드 웹훅 알림 규격** | [discord-webhook-notification.md](../../rules/operations/discord-webhook-notification.md) | 3대 블록 규격 및 페어리 알림 운영 규칙 |
| **디스코드 웹훅 발송 스킬** | [send-discord-webhook](../send-discord-webhook/SKILL.md) | 규격화된 블록 기반 디스코드 알림 및 무결성 브리핑 전송 |
| **데이터 무결성 관리 규칙** | [data-integrity-cleanup.md](../../rules/operations/data-integrity-cleanup.md) | 수명주기 및 5대 체크리스트 상세 규격 |
| **데이터베이스 스키마** | [database-schema.md](../../rules/database-schema.md) | `match.isHide` 컬럼 스펙 |
