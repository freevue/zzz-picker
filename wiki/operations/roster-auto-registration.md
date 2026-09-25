---
name: roster-auto-registration
description: 에이전트, W-엔진, 보스, 강습전 시즌 등록 가이드 허브 및 공통 운영 안전 수칙 문서입니다.
---

# 게임 데이터 등록 가이드 허브 (Roster Registration Hub)

젠레스 존 제로(ZZZ)의 신규 버전 픽업이나 강습전 시즌 갱신 시, 신규 데이터를 등록하는 작업은 도메인별로 분리된 전문 운영 문서에서 관리됩니다.

---

## 1. 핵심 도메인 등록 규칙 인덱스

| 대상 도메인 | 규칙 문서 경로 | 핵심 등록 내용 및 스키마 |
| :--- | :--- | :--- |
| **진영 (소속)** | [faction-registration.md](./faction-registration.md) | `faction` 마스터, 호요버스 Camp API 연동, 로고 이미지 매핑 |
| **에이전트 (캐릭터)** | [agent-registration.md](./agent-registration.md) | `agent` 프로필, **개별 코스트 7개 행(`agentCost`, 5대 프리셋)**, 이미지 매핑 |
| **W-엔진 (무기)** | [engine-registration.md](./engine-registration.md) | Fandom W-Engine 정보, 사용자 제공 일러스트·아이콘 경로/URL, `engine` 스펙 및 **돌파 코스트 5개 행(`engineCost`)** |
| **보스 마스터** | [boss-registration.md](./boss-registration.md) | `boss` 마스터, 페이즈별 HP 배열, 초상화 이미지 매핑 |
| **강습전 시즌** | [assault-registration.md](./assault-registration.md) | `deadlyAssault` 시즌 오픈 일시, **4종 보스(`deadlyBoss`, trial/adversity) 라인업** |
| **호요버스 공식 API**| [hoyoverse-character-api.md](./hoyoverse-character-api.md) | 호요버스 공식 사이트 API 구조도, 속성/특성 한자 변환 사전 |

---

## 2. 공통 운영 안전 수칙

모든 등록 skill은 다음 순서를 따릅니다. 외부 API 응답이 실패·불완전하거나 필수 값이 모호하면 추정하지 말고 중단해 원인을 보고합니다.

W-엔진 등록 실행 절차는 [register-engine skill](../../.agent/skills/register-engine/SKILL.md)을 따릅니다. 이미지 입력은 사용자가 제공하는 일러스트와 아이콘 로컬 경로를 각각 사용합니다.

보스 등록 실행 절차는 [register-boss skill](../../.agent/skills/register-boss/SKILL.md)을 따릅니다. 사용자가 제공한 보스 대표 이미지를 `images/boss`에 업로드하고 `image.type = 'Boss'`로 연결합니다.

1. **읽기 전용 사전 확인**: API 성공 응답과 필수 필드·목록 완전성(페이지형 API는 전체 페이지)을 확인하고, DB에서 기존 ID·이름·외래키·이미지 URL을 조회합니다. 중복 이름이나 연결이 모호한 항목은 자동 등록하지 않습니다.
2. **변경 내용 검토 및 승인**: 등록·갱신할 필드, 외래키 매핑, 이미지 원본, 코스트 배열, 유지할 기존 값을 사용자에게 먼저 보여줍니다. 명시적 승인을 받기 전에는 R2 업로드와 DB 쓰기를 하지 않습니다. 재시도는 승인안의 데이터·이미지 URL이 그대로일 때만 기존 승인 범위에 포함하며, 값이 바뀌면 다시 검토받습니다.
3. **R2 업로드와 재시도**: 승인 후 필요한 이미지만 업로드하고 반환된 CDN URL과 R2 key를 보관합니다. DB 재시도에서는 해당 URL을 재사용하고 같은 이미지를 다시 올리지 않습니다. 업로드 도중 실패하면 DB 쓰기를 시작하지 않고 성공한 key를 보고합니다.
4. **DB 원자성**: 이미지 행과 연결 마스터 행, 관련 코스트 행을 하나의 DB 트랜잭션으로 적재합니다. 클라이언트가 명시적 트랜잭션을 지원하면 `BEGIN ... COMMIT`을 사용하고, Supabase SQL Editor처럼 지원하지 않는 편집기에서는 전체 DB 변경을 단일 `DO $$ ... $$` 문으로 묶습니다. 실패하면 전체 DB 변경을 롤백하고, 재시도는 같은 R2 URL을 사용합니다. R2 객체 자체는 DB 트랜잭션으로 롤백되지 않으므로 미연결 key를 결과에 기록합니다.
5. **멱등성 및 단일 작성자**: 공식 ID와 코스트 복합키를 기준으로 upsert합니다. 이미 등록된 이미지 URL은 기존 `image.id`를 재사용합니다. URL이 중복되거나 이름으로 기존 행을 하나로 특정할 수 없으면 중단합니다. `nameKo` 고유 제약을 가정하지 않으며, 같은 도메인 동기화는 동시에 실행하지 않습니다.
6. **입력 및 타입 검증**: 외부 문자열은 바인드 변수로 전달합니다. SQL 편집기에서 리터럴을 써야 하면 작은따옴표를 두 번으로 이스케이프하고, ID·버전·불리언은 기대 타입과 범위에 맞는지 검사합니다. `USER-DEFINED` 컬럼 값은 DB enum 목록을 조회해 실제 허용값을 확인합니다.
7. **사후 검증**: 기본 행, 외래키, 이미지 URL, 관련 하위 행의 개수와 키 범위를 조회합니다. 기대값과 다르면 완료로 보고하지 않습니다.

```sql
-- USER-DEFINED 컬럼의 실제 enum 허용값 확인 예시 (`image.type`)
SELECT e.enumlabel
FROM pg_attribute a
JOIN pg_class c ON c.oid = a.attrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
JOIN pg_type t ON t.oid = a.atttypid
JOIN pg_enum e ON e.enumtypid = t.oid
WHERE n.nspname = 'public'
  AND c.relname = 'image'
  AND a.attname = 'type'
ORDER BY e.enumsortorder;
```
