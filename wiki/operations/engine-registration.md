---
name: engine-registration
description: 신규 W-엔진 등록, 전용 에이전트 매핑, 1~5돌파 코스트(5개 행) 산정 및 운영 표준 SQL 명세입니다.
---

# W-엔진 등록 및 코스트 설정 규칙 (Engine Registration)

이 문서는 젠레스 존 제로(ZZZ)의 신규 W-엔진(무기)이 추가되거나 픽업이 시작될 때, Supabase 데이터베이스의 `engine` 및 `engineCost` 테이블에 안전하게 등록하기 위한 **운영 표준 규격서**입니다.

엔진 정보는 사용자가 제공한 [Fandom W-Engine 문서](https://zenless-zone-zero.fandom.com/wiki/Bloodmarrow_Coffer)와 해당 문서의 언어·스탯·입수 정보에서 취합합니다. Fandom은 커뮤니티 편집 위키이므로 모호하거나 충돌하는 정보는 공식 출처로 확인합니다. DB 이미지에는 사용자가 별도로 제공한 일러스트와 아이콘의 로컬 경로나 URL을 사용하며, 사용자가 직접 준 URL이라면 위키 갤러리 파일도 사용할 수 있습니다.

---

## 1. 데이터베이스 스키마 명세

### 1) `engine` 마스터 테이블
W-엔진의 이름, 등급, 전용 캐릭터 매핑, 특성/속성 및 이미지 정보를 관리합니다.

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 및 예시 |
| :--- | :--- | :--- | :--- |
| **`id`** | `uuid` | PK | 엔진 고유 UUID (`gen_random_uuid()`) |
| **`nameKo`** | `text` | NOT NULL | 엔진 한글명 (e.g. `'태양의 유체'`, `'시간의 매듭'`) |
| **`nameEn`** | `text` | NOT NULL | 엔진 영문명 (e.g. `'Sol Exuvia'`, `'Timeweaver'`) |
| **`rank`** | `USER-DEFINED` | NOT NULL | 엔진 등급 (`'S'`, `'A'`, `'B'`) |
| **`exclusiveAgentId`**| `bigint` | FK (`agent.id`) | 전용 에이전트 ID (전용 무기가 아닌 경우 `null`) |
| **`isPickup`** | `boolean` | DEFAULT false | 한정 픽업 엔진 여부 |
| **`isTeaser`** | `boolean` | DEFAULT false | 사전 티저 공개 여부 |
| **`specialtyId`** | `uuid` | FK (`specialty.id`) | 대응 전투 특성 UUID |
| **`attributeId`** | `uuid` | FK (`attribute.id`) | 대응 속성 UUID (해당 없을 시 `null`) |
| **`imageId`** | `uuid` | FK (`image.id`) | 무기 원본 일러스트 이미지 UUID |
| **`iconImageId`** | `uuid` | FK (`image.id`) | 무기 아이콘 이미지 UUID |

---

### 2) `engineCost` 코스트 테이블
클라이언트 `useCost` 훅에서 W-엔진의 돌파 단계에 따른 코스트를 산출할 때 참조합니다.

> [!IMPORTANT]
> **5개 레코드 무결성 필수 원칙**:  
> 모든 W-엔진은 반드시 **1돌부터 5돌까지 총 5개 행**(`rate = 1, 2, 3, 4, 5`)의 레코드가 누락 없이 등록되어야 합니다.

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| **`id`** | `uuid` | PK | `gen_random_uuid()` |
| **`engineId`** | `uuid` | FK (`engine.id`) | 대상 W-엔진 UUID |
| **`rate`** | `bigint` | NOT NULL | 돌파 단계 (**1 ~ 5**) |
| **`cost`** | `numeric` | NOT NULL | 책정 코스트 (소수점 0.5단위 가능) |

---

## 2. W-엔진 코스트 체계 및 표준 프리셋

W-엔진 역시 개별 코스트 책정이 가능하며, 별도 지정이 없을 경우 아래 표준 프리셋을 따릅니다:

| 프리셋 명칭 | 1돌 ~ 5돌 코스트 배열 | 적용 기준 및 대표 엔진 예시 |
| :--- | :--- | :--- |
| **S급 전용 무기 프리셋** | `[1.0, 1.5, 2.0, 2.5, 3.0]` | 기본 1.0코스트, 돌파당 +0.5코스트<br>*(맑은 옥주전자, 우아한 베니티백, 기사 예찬 등)* |
| **S급 상시 무기 프리셋** | `[0.0, 0.0, 0.0, 1.0, 1.0]` | 1~3돌 무료, 4~5돌 1.0코스트<br>*(스틸 쿠션, 유황석 등)* |
| **A급 / B급 무기 프리셋** | `[0.0, 0.0, 0.0, 0.0, 0.0]` | 전 돌파 무료 (0 코스트)<br>*(오리지널 변신 아이템 등 A/B급 전원)* |

---

## 3. 표준 등록 SQL 템플릿

```sql
BEGIN;

-- 1. 신규 W-엔진 등록 (예: S급 전용 '기사 예찬')
INSERT INTO public.engine (
  id,
  "nameKo",
  "nameEn",
  rank,
  "exclusiveAgentId",
  "isPickup",
  "isTeaser",
  "specialtyId",
  "attributeId",
  "imageId",
  "iconImageId"
) VALUES (
  '6f1828e6-047d-4b55-8bdf-0eaf9042249e', -- 신규 엔진 UUID
  '기사 예찬',
  'Knight''s Extolment',
  'S',
  164897,                                 -- 시그리드 전용
  true,
  false,
  '26366ea7-2daa-4f5e-9e62-785165174c55', -- 강공 (Attack)
  null,                                   -- 해당 엔진에 연결할 속성 UUID가 없을 때
  'c1111111-1111-1111-1111-111111111111',
  'c2222222-2222-2222-2222-222222222222'
) ON CONFLICT (id) DO UPDATE SET
  "nameKo" = EXCLUDED."nameKo",
  "nameEn" = EXCLUDED."nameEn",
  rank = EXCLUDED.rank,
  "exclusiveAgentId" = EXCLUDED."exclusiveAgentId",
  "isPickup" = EXCLUDED."isPickup",
  "isTeaser" = EXCLUDED."isTeaser",
  "specialtyId" = EXCLUDED."specialtyId",
  "attributeId" = EXCLUDED."attributeId",
  "imageId" = EXCLUDED."imageId",
  "iconImageId" = EXCLUDED."iconImageId";

-- 2. engineCost 1~5돌파 5개 레코드 일괄 생성 ([1.0, 1.5, 2.0, 2.5, 3.0])
INSERT INTO public."engineCost" ("engineId", rate, cost) VALUES
  ('6f1828e6-047d-4b55-8bdf-0eaf9042249e', 1, 1.0),
  ('6f1828e6-047d-4b55-8bdf-0eaf9042249e', 2, 1.5),
  ('6f1828e6-047d-4b55-8bdf-0eaf9042249e', 3, 2.0),
  ('6f1828e6-047d-4b55-8bdf-0eaf9042249e', 4, 2.5),
  ('6f1828e6-047d-4b55-8bdf-0eaf9042249e', 5, 3.0)
ON CONFLICT ("engineId", rate) DO UPDATE SET cost = EXCLUDED.cost;

COMMIT;
```

---

## 4. 사후 검증 쿼리

```sql
SELECT 
  e.id,
  e."nameKo",
  e.rank,
  e."isPickup",
  e."exclusiveAgentId",
  COUNT(ec.id) as cost_record_count,
  json_agg(ec.cost ORDER BY ec.rate) as cost_array
FROM public.engine e
JOIN public."engineCost" ec ON ec."engineId" = e.id
WHERE e.id = '6f1828e6-047d-4b55-8bdf-0eaf9042249e'
GROUP BY e.id, e."nameKo", e.rank, e."isPickup", e."exclusiveAgentId";
```
- **기대 결과**: `cost_record_count: 5`, `cost_array: [1, 1.5, 2, 2.5, 3]`

등록 자동화 절차와 사용자가 제공하는 일러스트·아이콘 경로의 적용은 [register-engine skill](../../.agent/skills/register-engine/SKILL.md)을 따른다.
