---
name: assault-registration
description: 신규 강습전 시즌 오픈, 버전 등록 및 4종 보스 라인업(trial/adversity) 매핑을 위한 운영 표준 SQL 명세입니다.
trigger: model_decision
---

# 강습전 시즌 및 보스 라인업 등록 규칙 (Deadly Assault Registration)

이 문서는 젠레스 존 제로(ZZZ)의 신규 강습전(Deadly Assault) 시즌이 갱신될 때, Supabase 데이터베이스의 `deadlyAssault` 및 `deadlyBoss` 테이블에 시즌 메타데이터와 대상 보스 라인업을 안전하게 등록하기 위한 **운영 표준 규격서**입니다.

---

## 1. 데이터베이스 스키마 명세

### 1) `deadlyAssault` 시즌 테이블
강습전 시즌의 고유 식별자와 오픈 일시, 게임 버전 정보를 관리합니다.

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 및 예시 |
| :--- | :--- | :--- | :--- |
| **`id`** | `uuid` | PK | 강습전 시즌 고유 UUID (`gen_random_uuid()`) |
| **`version`** | `double precision` | NOT NULL | 해당 시즌 게임 버전 (e.g. `3.1`, `3.2`) |
| **`createdAt`** | `timestamptz` | DEFAULT now() | 시즌 시작/오픈 일시 |

---

### 2) `deadlyBoss` 시즌 보스 매핑 테이블
해당 강습전 시즌에 출현하는 보스들과 난이도 유형을 연결합니다.

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 및 예시 |
| :--- | :--- | :--- | :--- |
| **`id`** | `uuid` | PK | 매핑 고유 UUID (`gen_random_uuid()`) |
| **`deadlyAssaultId`**| `uuid` | FK (`deadlyAssault.id`) | 소속 강습전 시즌 UUID |
| **`bossId`** | `uuid` | FK (`boss.id`) | 대상 보스 마스터 UUID |
| **`type`** | `USER-DEFINED` | NOT NULL | 보스 유형 (`'trial'` 또는 `'adversity'`) |

> [!NOTE]
> **시즌 보스 구성**:  
> 통상 한 시즌당 **4종의 보스**(시험의 장 `trial` 3종 + 역경의 장 `adversity` 1종 등)가 라인업으로 지정됩니다.

---

## 2. 표준 등록 SQL 템플릿

```sql
BEGIN;

-- 1. 강습전 시즌 마스터 등록 (예: 버전 3.2 시즌)
INSERT INTO public."deadlyAssault" (
  id,
  version,
  "createdAt"
) VALUES (
  '08ec525e-f5b0-42c2-9ae6-d6323e7a54da', -- 시즌 UUID
  3.2,
  '2026-09-08 04:00:00+09'                -- 시즌 오픈 시각
) ON CONFLICT (id) DO UPDATE SET
  version = EXCLUDED.version,
  "createdAt" = EXCLUDED."createdAt";

-- 2. 해당 시즌 4종 보스 라인업 매핑
INSERT INTO public."deadlyBoss" (id, "deadlyAssaultId", "bossId", type) VALUES
  (gen_random_uuid(), '08ec525e-f5b0-42c2-9ae6-d6323e7a54da', '607062aa-1467-4a30-a8de-d91e8ff90fb7', 'trial'),
  (gen_random_uuid(), '08ec525e-f5b0-42c2-9ae6-d6323e7a54da', '2ac9d3ac-f945-4d9d-a0fd-32eff2a44ece', 'trial'),
  (gen_random_uuid(), '08ec525e-f5b0-42c2-9ae6-d6323e7a54da', 'f7102ee9-0b5e-4140-808d-0614cb8d4103', 'trial'),
  (gen_random_uuid(), '08ec525e-f5b0-42c2-9ae6-d6323e7a54da', '9c8a4b37-b837-4a12-89a9-5b47e23ec69a', 'adversity');

COMMIT;
```

---

## 3. 사후 검증 쿼리

```sql
SELECT 
  da.id as season_id,
  da.version,
  da."createdAt",
  json_agg(
    json_build_object(
      'bossId', db."bossId",
      'nameKo', b."nameKo",
      'type', db.type
    ) ORDER BY db.type DESC
  ) as bosses
FROM public."deadlyAssault" da
JOIN public."deadlyBoss" db ON db."deadlyAssaultId" = da.id
JOIN public.boss b ON b.id = db."bossId"
WHERE da.id = '08ec525e-f5b0-42c2-9ae6-d6323e7a54da'
GROUP BY da.id, da.version, da."createdAt";
```
- **기대 결과**: 시즌 1건에 4종의 보스가 한글명 및 `trial`/`adversity` 타입과 함께 온전히 결합되어 조회됨.
