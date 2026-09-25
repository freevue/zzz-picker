---
name: faction-registration
description: 신규 진영(Faction) 등록, 호요버스 Camp API 연계 및 이미지 매핑을 위한 운영 표준 SQL 명세입니다.
---

# 진영 등록 규칙 (Faction Registration)

이 문서는 젠레스 존 제로(ZZZ)의 신규 진영(Faction/소속)이 추가되거나 신규 캐릭터 출시로 인해 새로운 진영을 선행 등록해야 할 때, Supabase 데이터베이스의 `faction` 테이블에 안전하고 일관되게 등록하기 위한 **운영 표준 규격서**입니다.

---

## 1. 개요 및 선행 등록 원칙

> [!IMPORTANT]
> **에이전트 등록 전 선행 필수 원칙**:  
> `agent` 테이블은 `factionId`를 외래키(`agent_factionId_fkey`)로 참조하고 있습니다.  
> 따라서 신규 캐릭터(예: 록시, 클라렛)를 등록하기 전에, 해당 캐릭터가 속한 신규 진영(예: `165576` 플린트 공방)이 `faction` 테이블에 반드시 먼저 존재해야 외래키 위반 에러가 발생하지 않습니다.

---

## 2. 데이터베이스 스키마 명세

### `faction` 마스터 테이블
에이전트들의 소속 진영 정보와 다국어 명칭, 호요버스 공식 ID를 관리합니다.

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 및 예시 |
| :--- | :--- | :--- | :--- |
| **`id`** | `bigint` | PK | 진영 고유 ID (**호요버스 Camp ID와 100% 동일**, e.g. `165576`, `164854`) |
| **`nameKo`** | `text` | NOT NULL | 진영 공식 한글명 (e.g. `'플린트 공방'`, `'공역순찰국'`, `'교활한 토끼굴'`) |
| **`nameEn`** | `text` | NOT NULL | 진영 공식 영문명 (e.g. `'Flint Workshop'`, `'Airspace Patrol Department'`) |
| **`hoyowikiId`** | `bigint` | NULL | 호요위키(HoYoWiki) 엔트리 번호 (미상 시 `null`) |
| **`imageId`** | `uuid` | FK (`image.id`) | 진영 공식 로고/엠블럼 이미지 UUID (선택) |
| **`createdAt`** | `timestamptz` | DEFAULT now() | 등록 일시 |

---

## 3. 호요버스 공식 Camp API 연동 규격

호요버스 공식 콘텐츠 API를 통해 진영 명칭과 고해상도 로고 이미지를 실시간으로 획득할 수 있습니다.

- **채널 ID (`iChanId`)**: `286` (진영 전용 채널)
- **API Base URL**: `https://sg-public-api-static.hoyoverse.com/content_v2_user/app/3e9196a4b9274bd7`

### 1) 진영 단건 상세 조회 (`getContent`)
```http
GET https://sg-public-api-static.hoyoverse.com/content_v2_user/app/3e9196a4b9274bd7/getContent?iInfoId={campId}&iChanId=286&sLangKey=ko-kr
```

### 2) 전체 진영 목록 조회 (`getContentList`)
```http
GET https://sg-public-api-static.hoyoverse.com/content_v2_user/app/3e9196a4b9274bd7/getContentList?iChanId=286&iPageSize=50&iPage=1&sLangKey=ko-kr
```

### 3) 응답 JSON 구조 (`data.sExt` 파싱)
```json
{
  "iInfoId": 165576,
  "sTitle": "플린트 공방",
  "sExt": {
    "camp-name": "플린트 공방",
    "camp-name-en": "Flint Workshop",
    "new-camp-icon": [
      {
        "name": "PC진영页通用logo(338x338).png",
        "url": "https://fastcdn.hoyoverse.com/content-v2/nap/165576/28083626397514f8f6fd34a915cd7496_1404688376893355209.png"
      }
    ],
    "camp-icon": [
      {
        "name": "官网内页PC-阵营图徽-弗林特工坊.png",
        "url": "https://fastcdn.hoyoverse.com/content-v2/nap/165576/0e91cd8c845187cf981ea06018d3a568_7386400107785337868.png"
      }
    ]
  }
}
```

---

## 4. 표준 등록 SQL 템플릿

### 1) 기본 텍스트 우선 등록 (권장 빠른 등록)
로고 이미지 업로드를 나중에 하거나 즉시 캐릭터 외래키 제약을 해소해야 할 때 사용하는 템플릿입니다.

```sql
-- 신규 진영 '플린트 공방' 등록
INSERT INTO public.faction (
  id,
  "nameKo",
  "nameEn",
  "hoyowikiId",
  "imageId"
) VALUES (
  165576,
  '플린트 공방',
  'Flint Workshop',
  null,
  null
) ON CONFLICT (id) DO UPDATE SET
  "nameKo" = EXCLUDED."nameKo",
  "nameEn" = EXCLUDED."nameEn";
```

### 2) 로고 이미지 R2 연계 포함 등록
로고 이미지를 R2에 업로드하고 `image` 테이블에 등록한 후 연결하는 완전형 템플릿입니다.

```sql
BEGIN;

-- 1. 진영 로고 이미지 등록 (R2 업로드 완료 후)
INSERT INTO public.image (
  id,
  src,
  type,
  description
) VALUES (
  'e1111111-1111-1111-1111-111111111111',
  'https://images.zzz.freevue.dev/factions/flint_workshop_logo.webp',
  'faction_logo',
  '플린트 공방 진영 로고'
) ON CONFLICT (id) DO NOTHING;

-- 2. 진영 마스터 등록
INSERT INTO public.faction (
  id,
  "nameKo",
  "nameEn",
  "imageId"
) VALUES (
  165576,
  '플린트 공방',
  'Flint Workshop',
  'e1111111-1111-1111-1111-111111111111'
) ON CONFLICT (id) DO UPDATE SET
  "nameKo" = EXCLUDED."nameKo",
  "nameEn" = EXCLUDED."nameEn",
  "imageId" = EXCLUDED."imageId";

COMMIT;
```

---

## 5. 사후 검증 쿼리

```sql
SELECT 
  f.id,
  f."nameKo",
  f."nameEn",
  f."hoyowikiId",
  i.src as logo_url,
  COUNT(a.id) as registered_agents_count
FROM public.faction f
LEFT JOIN public.image i ON i.id = f."imageId"
LEFT JOIN public.agent a ON a."factionId" = f.id
WHERE f.id = 165576
GROUP BY f.id, f."nameKo", f."nameEn", f."hoyowikiId", i.src;
```

---

## 6. AI 자동화 Skill (`register-faction`) 워크플로우 설계

`register-faction`은 먼저 전체 원천 목록과 DB를 읽어 변경안을 보고합니다. 사용자가 명시적으로 승인하기 전에는 R2 업로드나 DB 쓰기를 하지 않습니다. 승인 후에는 이미지와 진영 행을 한 트랜잭션으로 저장하고, 상세 단계는 [공통 등록 안전 수칙](./roster-auto-registration.md)을 따릅니다.

1. **입력**: 호요버스 진영 ID (e.g. `165576`) 또는 진영명 (e.g. `'플린트 공방'`)
2. **호요버스 API 크롤링**:
   - `iChanId=286`, `iInfoId={campId}`, `sLangKey=ko-kr` 호출
   - `sExt` 파싱을 통해 `camp-name` (한글), `camp-name-en` (영문), `new-camp-icon` URL 추출
3. **이미지 처리 (선택)**:
   - `new-camp-icon` 이미지를 R2에 업로드하고 `image` 테이블에 등록하여 UUID 발급
4. **DB 적재**:
   - `INSERT INTO public.faction ... ON CONFLICT (id) DO UPDATE` 실행
5. **검증 및 브리핑**:
   - 진영 ID, 한글명, 영문명 및 매핑 상태를 사용자에게 보고
