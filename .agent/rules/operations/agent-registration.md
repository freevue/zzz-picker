---
name: agent-registration
description: 신규 에이전트 등록, 개별 돌파 코스트(0~6돌 7개 행) 산정 및 R2 이미지 연계를 위한 운영 표준 SQL 명세입니다.
trigger: model_decision
---

# 에이전트 등록 및 코스트 설정 규칙 (Agent Registration)

이 문서는 젠레스 존 제로(ZZZ)의 신규 에이전트(캐릭터)가 출시되거나 픽업 로스터가 갱신될 때, Supabase 데이터베이스의 `agent` 및 `agentCost` 테이블에 안전하고 일관되게 등록하기 위한 **운영 표준 규격서**입니다.

---

## 1. 데이터베이스 스키마 명세

### 1) `agent` 마스터 테이블
에이전트의 기본 프로필, 메타데이터, 속성/특성/진영 외래키 및 이미지 매핑 정보를 보관합니다.

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 및 예시 |
| :--- | :--- | :--- | :--- |
| **`id`** | `bigint` | PK | 캐릭터 고유 ID (호요랩 ID 체계, e.g. `103379`, `164897`) |
| **`nameKo`** | `text` | NOT NULL | 한글 단축명 (e.g. `'미야비'`, `'야나기'`, `'엘렌'`) |
| **`nameEn`** | `text` | NOT NULL | 영문 단축명 (e.g. `'Miyabi'`, `'Yanagi'`, `'Ellen'`) |
| **`fullNameKo`** | `text` | NULL | 한글 풀네임 (e.g. `'호시미 미야비'`, `'츠키시로 야나기'`) |
| **`fullNameEn`** | `text` | NULL | 영문 풀네임 (e.g. `'Hoshimi Miyabi'`) |
| **`rarity`** | `text` | NOT NULL | 에이전트 등급 (`'S'` 또는 `'A'`) |
| **`specialtyId`** | `uuid` | FK (`specialty.id`) | 전투 특성 UUID (강공, 격파, 이상, 지원, 방어, 명파) |
| **`attributeId`** | `uuid` | FK (`attribute.id`) | 속성 UUID (물리, 불, 얼음, 전기, 에테르 등 10종) |
| **`factionId`** | `bigint` | FK (`faction.id`) | 소속 진영 ID (e.g. 5, 164854) |
| **`color`** | `text` | NULL | 캐릭터 고유 테마 헥스컬러 (e.g. `'#30ae9e'`) |
| **`version`** | `numeric` | NULL | 캐릭터 출시 버전 (e.g. `3.2`, `1.4`) |
| **`isPickup`** | `boolean` | DEFAULT false | 한정 픽업 여부 (`true` / `false`) |
| **`isAllow`** | `boolean` | DEFAULT true | 밴픽 경기 사용 허용 여부 (기본값 `true`) |
| **`isTeaser`** | `boolean` | DEFAULT false | 사전 티저 공개 여부 (정식 참전 시 `false`) |
| **`profileImageId`**| `uuid` | FK (`image.id`) | 프로필 아이콘 이미지 UUID |
| **`bannerImageId`** | `uuid` | FK (`image.id`) | 전신 배너/일러스트 이미지 UUID |
| **`createdAt`** | `timestamptz` | DEFAULT now() | 등록 일시 |

---

### 2) `agentCost` 코스트 테이블
클라이언트(`apps/renew`)의 [`useCost`](file:///Users/freevue/Desktop/Project/zzz-picker/apps/renew/app/hooks/index.ts#L41) 훅에서 실시간으로 참조하는 돌파 단계별 코스트 테이블입니다.

> [!IMPORTANT]
> **7개 레코드 무결성 필수 원칙**:  
> 모든 에이전트는 반드시 **0돌부터 6돌까지 총 7개 행**(`rate = 0, 1, 2, 3, 4, 5, 6`)의 레코드가 누락 없이 존재해야 합니다. 단 하나의 rate라도 누락되면 런타임 밴픽 도중 코스트 계산 에러가 발생합니다.

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| **`id`** | `uuid` | PK | `gen_random_uuid()` 기본 생성 |
| **`agentId`** | `bigint` | FK (`agent.id`) | 대상 에이전트 ID |
| **`rate`** | `bigint` | NOT NULL | 돌파 단계 (**0 ~ 6**) |
| **`cost`** | `numeric` | NOT NULL | 해당 돌파 시 책정 코스트 (소수점 0.5단위 가능) |

---

## 2. 개별 코스트 책정 체계 및 5대 표준 프리셋

현재 zzz-picker 시스템은 등급별 일괄 공식 대신, **캐릭터별 밸런스에 맞춘 개별 코스트 배열(0~6돌 7개 수치)**을 사용합니다.

### 1) 입력 우선순위
1. **사용자 직접 지정 (최우선)**: 운영자가 7개 원소의 배열(e.g. `[0, 1, 2, 3, 4, 5, 6]`)을 직접 전달하면 해당 값을 그대로 저장합니다.
2. **표준 프리셋 선택 (기본값)**: 별도의 코스트 지정이 없을 경우, 캐릭터의 성격과 밸런스에 따라 아래 5대 프리셋 중 하나를 선택하여 적용합니다.

### 2) 5대 표준 프리셋 (Standard Presets)

| 프리셋 명칭 | 0돌 ~ 6돌 코스트 배열 | 적용 기준 및 대표 캐릭터 예시 |
| :--- | :--- | :--- |
| **Preset 1 (0.5 단위 픽업)** | `[0, 0.5, 1, 1.5, 2, 2.5, 3]` | 0돌 무료, 돌파당 +0.5코스트<br>*(주연, 청의, 카이사르, 야나기, 라이터)* |
| **Preset 2 (1.0 단위 픽업)** | `[0, 1, 2, 3, 4, 5, 6]` | 0돌 무료, 돌파당 +1.0코스트<br>*(엘렌, 제인, 버니스, 하루마사)* |
| **Preset 3 (1코 시작 강력형)**| `[1, 2, 3, 4, 5, 6, 7]` | 0돌부터 1코스트, 돌파당 +1.0코스트<br>*(호시미 미야비 - 압도적 성능 캐릭터)* |
| **Preset 4 (4돌 1코 상시형)** | `[0, 0, 0, 0, 1, 1, 1]` | 0~3돌 무료, 4돌부터 1코스트<br>*(11호, 리카온, 네코마타 등 S급 상시)* |
| **Preset 5 (0코스트 무료형)** | `[0, 0, 0, 0, 0, 0, 0]` | 전 돌파 무료 (0 코스트)<br>*(콜레다 및 A급 캐릭터 전원)* |

---

## 3. 표준 등록 SQL 템플릿 (원자적 트랜잭션)

반드시 `BEGIN ... COMMIT` 트랜잭션을 통해 `agent` 마스터와 `agentCost` 7개 행이 동시에 적재되도록 해야 합니다.

```sql
BEGIN;

-- 1. 에이전트 마스터 등록 (예시: S급 픽업 '시그리드')
INSERT INTO public.agent (
  id,
  "nameKo",
  "nameEn",
  "fullNameKo",
  "fullNameEn",
  rarity,
  "specialtyId",
  "attributeId",
  "factionId",
  color,
  version,
  "isPickup",
  "isAllow",
  "isTeaser",
  "profileImageId",
  "bannerImageId"
) VALUES (
  164897,
  '시그리드',
  'Sigrid',
  '시그리드',
  'Sigrid',
  'S',
  '26366ea7-2daa-4f5e-9e62-785165174c55', -- 강공 (Attack)
  'e711fc26-2064-4af6-97b4-6e4751f9f4ec', -- 얼음 (Ice)
  164854,                                 -- 진영 ID
  '#4a90e2',                              -- 테마 헥스컬러
  3.2,                                    -- 버전
  true,                                   -- isPickup
  true,                                   -- isAllow
  false,                                  -- isTeaser
  'b1111111-1111-1111-1111-111111111111', -- profileImageId
  'b2222222-2222-2222-2222-222222222222'  -- bannerImageId
) ON CONFLICT (id) DO UPDATE SET
  "nameKo" = EXCLUDED."nameKo",
  "nameEn" = EXCLUDED."nameEn",
  "fullNameKo" = EXCLUDED."fullNameKo",
  "fullNameEn" = EXCLUDED."fullNameEn",
  rarity = EXCLUDED.rarity,
  "specialtyId" = EXCLUDED."specialtyId",
  "attributeId" = EXCLUDED."attributeId",
  "factionId" = EXCLUDED."factionId",
  color = EXCLUDED.color,
  "profileImageId" = COALESCE(EXCLUDED."profileImageId", agent."profileImageId"),
  "bannerImageId" = COALESCE(EXCLUDED."bannerImageId", agent."bannerImageId"),
  "isPickup" = EXCLUDED."isPickup",
  "isAllow" = EXCLUDED."isAllow",
  "isTeaser" = EXCLUDED."isTeaser",
  version = EXCLUDED.version;

-- 2. agentCost 0~6돌파 7개 레코드 일괄 생성 (Preset 2 예시: [0, 1, 2, 3, 4, 5, 6])
INSERT INTO public."agentCost" ("agentId", rate, cost) VALUES
  (164897, 0, 0),
  (164897, 1, 1),
  (164897, 2, 2),
  (164897, 3, 3),
  (164897, 4, 4),
  (164897, 5, 5),
  (164897, 6, 6)
ON CONFLICT ("agentId", rate) DO UPDATE SET cost = EXCLUDED.cost;

COMMIT;
```

---

## 4. 사후 검증 쿼리

에이전트가 등록된 후 아래 쿼리를 통해 7개 돌파 단계가 온전히 채워졌는지 검증합니다:

```sql
SELECT 
  a.id,
  a."nameKo",
  a.rarity,
  a."isPickup",
  COUNT(ac.id) as cost_record_count,
  json_agg(ac.cost ORDER BY ac.rate) as cost_array
FROM public.agent a
JOIN public."agentCost" ac ON ac."agentId" = a.id
WHERE a.id = 164897
GROUP BY a.id, a."nameKo", a.rarity, a."isPickup";
```
- **기대 결과**: `cost_record_count: 7`, `cost_array: [0, 1, 2, 3, 4, 5, 6]`

---

## 5. 이미지 연계 워크플로우

1. 변경안 승인 후 이미지 파일(웹 URL 또는 로컬 파일)을 `upload-r2-image` 스킬로 Cloudflare R2에 업로드합니다. 반환된 CDN URL과 R2 key를 기록하고 DB 재시도 때 URL을 재사용합니다.
2. Supabase `image` 행, `agent` 행, `agentCost` 7개 행은 하나의 DB 트랜잭션으로 저장합니다. 같은 CDN URL이 이미 `image`에 있으면 기존 UUID를 재사용합니다.
3. 공통 승인·입력 검증·롤백 절차는 [roster-auto-registration.md](./roster-auto-registration.md)를 따릅니다.

---

## 6. 공식 데이터 크롤링 및 API 연계

호요버스 공식 캐릭터 페이지(`https://zenless.hoyoverse.com/ko-kr/character?id={id}`)의 데이터를 자동으로 수집하여 등록할 때는 [호요버스 캐릭터 API 규격서](./hoyoverse-character-api.md)를 참조합니다:
- **캐릭터 상세**: `https://sg-public-api-static.hoyoverse.com/content_v2_user/app/3e9196a4b9274bd7/getContent?iInfoId={id}&iChanId=287&sLangKey=ko-kr`
- **속성/특성 변환**: 한자 아이콘(`风`, `击破` 등) ➡️ 우리 DB UUID 자동 변환 사전 적용.
- **신규 진영(`faction`)**: 소속 Camp ID가 우리 DB에 없을 시 `faction` 테이블에 선행 등록.
