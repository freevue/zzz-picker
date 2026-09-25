---
name: boss-registration
description: 신규 보스 마스터 등록, 체력(hp) 배열 설정 및 이미지 연계를 위한 운영 표준 SQL 명세입니다.
trigger: model_decision
---

# 보스 마스터 등록 규칙 (Boss Registration)

이 문서는 젠레스 존 제로(ZZZ)의 신규 보스가 추가되거나 강습전용 보스 데이터가 갱신될 때, Supabase 데이터베이스의 `boss` 테이블에 안전하게 등록하기 위한 **운영 표준 규격서**입니다.

---

## 1. 데이터베이스 스키마 명세

### `boss` 마스터 테이블
경기 밴픽 및 강습전 라운드에서 선택되는 보스의 마스터 데이터입니다.

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 및 예시 |
| :--- | :--- | :--- | :--- |
| **`id`** | `uuid` | PK | 보스 고유 UUID (`gen_random_uuid()`) |
| **`nameKo`** | `text` | NOT NULL | 보스 한글명 (e.g. `'죽음의 도살자'`, `'노토리우스・폼페이'`) |
| **`nameEn`** | `text` | NOT NULL | 보스 영문명 (e.g. `'Dead End Butcher'`, `'Notorious - Pompey'`) |
| **`hp`** | `bigint[]` | NULL | 보스 페이즈별 HP 배열 (e.g. `[545249, 907019]`, 미상 시 `null`) |
| **`imageId`** | `uuid` | FK (`image.id`) | 보스 썸네일/초상화 이미지 UUID |
| **`legacy_id`** | `bigint` | NULL | 레거시 시즌 보스 ID 번호 (e.g. 6, 12, 16) |
| **`createdAt`** | `timestamptz` | DEFAULT now() | 등록 일시 |

---

## 2. 표준 등록 SQL 템플릿

```sql
BEGIN;

-- 1. 신규 보스 마스터 등록 (예: '피의 청소부')
INSERT INTO public.boss (
  id,
  "nameKo",
  "nameEn",
  hp,
  "imageId",
  legacy_id
) VALUES (
  '6abb1676-2804-4167-a0b3-190001f01615', -- 신규 보스 UUID
  '피의 청소부',
  'Sanguine Sweeper',
  ARRAY[1250000]::bigint[],               -- HP 배열
  'd1111111-1111-1111-1111-111111111111', -- imageId
  16                                      -- legacy_id
) ON CONFLICT (id) DO UPDATE SET
  "nameKo" = EXCLUDED."nameKo",
  "nameEn" = EXCLUDED."nameEn",
  hp = EXCLUDED.hp,
  "imageId" = EXCLUDED."imageId";

COMMIT;
```

---

## 3. 사후 검증 쿼리

```sql
SELECT 
  b.id,
  b."nameKo",
  b."nameEn",
  b.hp,
  i.src as image_url
FROM public.boss b
LEFT JOIN public.image i ON i.id = b."imageId"
WHERE b.id = '6abb1676-2804-4167-a0b3-190001f01615';
```
