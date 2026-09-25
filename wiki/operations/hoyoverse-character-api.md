---
name: hoyoverse-character-api
description: 호요버스 공식 캐릭터 사이트 구조도, 콘텐츠 API 엔드포인트 규격 및 Supabase DB 1:1 매핑 명세서입니다.
---

# 호요버스 캐릭터 데이터 API 구조도 및 매핑 규격서

이 문서는 호요버스(HoYoverse) 젠레스 존 제로 공식 사이트(`zenless.hoyoverse.com`)에서 캐릭터 데이터를 자동으로 수집/파싱하여 우리 Supabase 데이터베이스에 등록하기 위한 **API 구조도, 엔드포인트 명세 및 1:1 데이터 변환 사전**입니다.

---

## 1. 공식 사이트 및 API 개요

- **공식 웹 페이지**: `https://zenless.hoyoverse.com/ko-kr/character?id={id}`
- **정적 콘텐츠 API Base URL**:  
  `https://sg-public-api-static.hoyoverse.com/content_v2_user/app/3e9196a4b9274bd7`
- **핵심 채널 ID (`iChanId`)**:
  - **캐릭터 (CHARACTER)**: `287`
  - **진영 (CAMP)**: `286`
- **공통 필수 파라미터**:
  - `sLangKey=ko-kr` (**누락 시 `retcode: 1001 (提交参数有误)` 에러 발생**)

---

## 2. API 엔드포인트 명세

### 1) 단건 캐릭터 상세 정보 (`getContent`)
특정 캐릭터 1명의 전체 메타데이터, 이미지, 속성, 특성, 성우 및 대사를 조회합니다.

```http
GET https://sg-public-api-static.hoyoverse.com/content_v2_user/app/3e9196a4b9274bd7/getContent?iInfoId={id}&iChanId=287&sLangKey=ko-kr
```

#### 요청 파라미터
| 파라미터 | 타입 | 필수 | 설명 및 예시 |
| :--- | :--- | :---: | :--- |
| **`iInfoId`** | `number` | O | 호요버스 캐릭터 고유 ID (e.g. `165591`) |
| **`iChanId`** | `number` | O | `287` (캐릭터 채널 고정) |
| **`sLangKey`** | `string` | O | `'ko-kr'` (한국어 고정) |

---

### 2) 전체 캐릭터 목록 조회 (`getContentList`)
공식 사이트에 등록된 전체 캐릭터 목록을 페이징하여 조회합니다.

```http
GET https://sg-public-api-static.hoyoverse.com/content_v2_user/app/3e9196a4b9274bd7/getContentList?iChanId=287&iPageSize=100&iPage=1&sLangKey=ko-kr
```

---

### 3) 진영(Camp) 목록 및 상세 조회
각 캐릭터가 소속된 진영 정보를 조회합니다.

```http
# 전체 진영 목록
GET https://sg-public-api-static.hoyoverse.com/content_v2_user/app/3e9196a4b9274bd7/getContentList?iChanId=286&iPageSize=50&iPage=1&sLangKey=ko-kr

# 특정 진영 단건 상세
GET https://sg-public-api-static.hoyoverse.com/content_v2_user/app/3e9196a4b9274bd7/getContent?iInfoId={campId}&iChanId=286&sLangKey=ko-kr
```

---

## 3. 원본 응답 JSON 구조도 (`data.sExt` 파싱)

호요버스 API는 응답 객체의 `data.sExt` 필드 내부에 JSON 문자열 형태로 핵심 스펙을 보관하므로, 반드시 `JSON.parse(data.sExt)`를 수행해야 합니다.

```text
Response
└── data
    ├── iInfoId: 165591 (캐릭터 ID)
    ├── sTitle: "록시·이프리타·프라이스"
    └── sExt (JSON 문자열)
        ├── "chara-name": "록시·이프리타·프라이스" (한글 풀네임)
        ├── "chara-name-en": "Roxy Ifrita Pryce" (영문 풀네임)
        ├── "chara-color": "#30ae9e" (테마 헥스컬러)
        ├── "prop-icon-1": [ { "name": "风.png", "url": "..." } ] (속성 아이콘)
        ├── "prop-icon-2": [ { "name": "击破.png", "url": "..." } ] (특성 아이콘)
        ├── "chara-nav": [ { "name": "...", "url": "..." } ] (프로필 아이콘 CDN URL)
        ├── "new-chara-cover-inner": [ { "name": "...", "url": "..." } ] (전신 일러스트 PC CDN URL)
        ├── "new-chara-cover-inner-m": [ { "name": "...", "url": "..." } ] (모바일 전신 일러스트)
        ├── "chara-line": "대표 대사 대사 문자열"
        └── "chara-cv1-name": "이보용" (한국어 성우명)
```

---

## 4. 우리 Supabase DB 1:1 매핑 사전

### 1) 기본 메타데이터 매핑
| 우리 DB (`agent` 테이블) | 호요버스 원본 JSON 필드 | 변환 및 추출 규칙 |
| :--- | :--- | :--- |
| **`id`** | `data.iInfoId` | **동일한 고유 번호(bigint) 100% 일치 사용** |
| **`nameKo`** | `sExt["chara-name"]` | 첫 번째 마침표/가운뎃점 기준 단축명 추출 (e.g. `'록시'`) |
| **`fullNameKo`** | `sExt["chara-name"]` | 원본 풀네임 그대로 저장 (e.g. `'록시·이프리타·프라이스'`) |
| **`nameEn`** | `sExt["chara-name-en"]` | 첫 단어 추출 (e.g. `'Roxy'`) |
| **`fullNameEn`** | `sExt["chara-name-en"]` | 영문 풀네임 그대로 저장 (e.g. `'Roxy Ifrita Pryce'`) |
| **`color`** | `sExt["chara-color"]` | 테마 색상 헥스코드 (e.g. `'#30ae9e'`) |
| **`profileImageId`** | `sExt["chara-nav"][0].url` | `upload-r2-image`로 R2 업로드 ➡️ `image` 테이블 등록 후 UUID 발급 |
| **`bannerImageId`** | `sExt["new-chara-cover-inner"][0].url`| `upload-r2-image`로 R2 업로드 ➡️ `image` 테이블 등록 후 UUID 발급 |

---

### 2) 속성 (`prop-icon-1` ➡️ `attributeId`) 변환 사전

| 호요버스 아이콘 파일명 | 속성 한글명 | 속성 영문명 | Supabase DB `attribute.id` (UUID) |
| :--- | :---: | :---: | :--- |
| **`物理.png`** | 물리 | Physical | `50f1f0a2-9a93-4ce2-b945-f7a48caf036b` |
| **`火.png`** | 불 | Fire | `44ec6eb1-648c-43fe-b6e0-780d26b96e94` |
| **`冰.png`** | 얼음 | Ice | `e711fc26-2064-4af6-97b4-6e4751f9f4ec` |
| **`电.png`** | 전기 | Electric | `1d24d995-079c-4bd5-ab5f-d30b32fc04ad` |
| **`以太.png`** | 에테르 | Ether | `3fa8f4d4-2cbb-4fb2-9147-057aeb6bce36` |
| **`风.png`** | 바람 | Wind | `c159a34d-7136-488a-a693-7f2bd32f4899` |
| **`光...` / `光属性`** | 루멘 | Lumiflux | `6a447fc6-1f7b-43b3-9e94-18424675d38f` |
| **`서리`** | 서리 | Frost | `429add97-b3b3-4a7b-a9fe-bf05cfa6cdc1` |
| **`현묵`** | 현묵 | Auric_Ink | `3999a7a1-c216-4e72-9503-751ba8c45de2` |
| **`서슬`** | 서슬 | Honed Edge | `626a6860-9cc4-440b-92cf-b258b7c3639b` |

---

### 3) 특성 (`prop-icon-2` ➡️ `specialtyId`) 변환 사전

| 호요버스 아이콘 파일명 | 특성 한글명 | 특성 영문명 | Supabase DB `specialty.id` (UUID) |
| :--- | :---: | :---: | :--- |
| **`强攻.png`** | 강공 | Attack | `26366ea7-2daa-4f5e-9e62-785165174c55` |
| **`击破.png`** | 격파 | Stun | `5cebe3f7-b832-4152-b216-afb14c12bcb2` |
| **`异常.png`** | 이상 | Anomaly | `6d847e28-a7de-403d-b998-352ebb31d22a` |
| **`支援.png`** | 지원 | Support | `03173e98-03df-4e4b-98f7-0f890f7c78ac` |
| **`防护.png` / `防御.png`**| 방어 | Defense | `9741ee5b-49dc-4a73-b5b4-09c0cb43732b` |
| **`命破.png` / `锋域.png`**| 명파 | Rupture | `489432b2-abd2-4f3e-9a10-f4ba1663cee8` |
| **`armero` (단조 아이콘)**| 단조 | Armorer | `e8e7eade-9a04-438f-badb-b90412fde9dc` |

---

### 4) 진영 (`Camp ID` ➡️ `factionId`) 매핑 현황

호요버스 Camp ID와 우리 DB `faction.id`는 100% 동일합니다:

| 호요버스 Camp ID | 진영 한글명 | 진영 영문명 | 우리 DB 등록 상태 |
| :---: | :--- | :--- | :---: |
| `165576` | 플린트 공방 | Flint Workshop | ✅ 기등록 완료 |
| `164854` | 공역순찰국 | Airspace Patrol Department | ✅ 기등록 완료 |
| `164840` | 다야트 결사단 | Covenant of Dayat | ✅ 기등록 완료 |
| `163780` | 외무전략국 | External Strategy Department | ✅ 기등록 완료 |
| `163772` | 파에톤 | Phaethon | ✅ 기등록 완료 |
| `162680` | 도시 관리부 | Metropolitan Order Division | ✅ 기등록 완료 |
| `161790` | AOD | AOD | ✅ 기등록 완료 |
| `160116` | 크람푸스의 검은 가지 | Krampus Compliance Authority | ✅ 기등록 완료 |
| `156710` | 괴담방 | Spook Shack | ✅ 기등록 완료 |
| `155656` | 운규산 | Yunkui Summit | ✅ 기등록 완료 |
| `154604` | 모킹버드 | Mockingbird | ✅ 기등록 완료 |
| `154526` | 방위군·실버 소대 | Defense Force - Silver Squad | ✅ 기등록 완료 |
| `127385` | 스타즈 오브 리라 | Stars of Lyra | ✅ 기등록 완료 |
| `124305` | 칼리돈의 자손 | Sons of Calydon | ✅ 기등록 완료 |
| `122783` | 형사특수팀 | Criminal Investigation Special Response Team | ✅ 기등록 완료 |
| `103294` | 대공동 6과 | Section 6 | ✅ 기등록 완료 |
| `102707` | 벨로보그 중공업 | Belobog Heavy Industries | ✅ 기등록 완료 |
| `102476` | 빅토리아 하우스키핑 | Victoria Housekeeping Co. | ✅ 기등록 완료 |
| `102291` | 오볼로스 소대 | Obol Squad | ✅ 기등록 완료 |
| `102027` | 교활한 토끼굴 | Cunning Hares AKA Gentle House | ✅ 기등록 완료 |

> [!CAUTION]
> **신규 진영 등록 누락 방지**:  
> 신규 캐릭터 등록 시 소속 Camp ID가 우리 DB에 없으면 외래키(`agent_factionId_fkey`) 위반 에러가 발생하므로, 반드시 호요버스 Camp API(`iChanId=286`)로 진영 한글/영문명을 확인하여 `faction` 테이블에 선행 `INSERT`해야 합니다.
