---
name: database-schema
description: zzz-picker의 Supabase PostgreSQL 데이터베이스 실제 스키마 및 테이블 구조 상세 명세서 (SSOT)
trigger: model_decision
---

# 데이터베이스 스키마 (Database Schema)

`zzz-picker`는 Supabase를 백엔드로 사용하며, 주요 게임 데이터 및 실시간 경기 상태는 PostgreSQL 테이블에 저장됩니다.

- **Project ID**: `binfwietgookzeldgluj`
- **Region**: `ap-northeast-2` (Seoul)

---

## 1. 경기 및 실시간 세션 테이블 (Match & Play)

### 1) `match` (경기 방 마스터)
실시간 경기의 기본 설정 및 현재 진행 페이즈를 관리합니다.

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| **`id`** | `uuid` | PK | 경기 고유 ID (기본키, URL의 `roomId`) |
| **`hostId`** | `uuid` | NOT NULL | 호스트 고유 ID (매 경기 독립 생성) |
| **`matchType`** | `USER-DEFINED` | NOT NULL | 경기 모드 (`original`, `legend`, `unlimited`) |
| **`phase`** | `USER-DEFINED` | NOT NULL | 현재 진행 페이즈 (`commonBossSelect`, `ban`, `banFix`, `pick`, `done`) |
| **`isTest`** | `boolean` | DEFAULT false | 테스트 모드 여부 |
| **`isHide`** | `boolean` | DEFAULT false | **소프트 딜리트 플래그** (비정상/방치 세션 은닉) |
| **`createdAt`** | `timestamptz` | DEFAULT now() | 생성 일시 |

---

### 2) `play` (참가자 세션 및 경기 데이터)
각 매치에 참가하는 선수(A/B)의 파티, 보스, 밴, 점수 정보를 저장합니다.

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| **`id`** | `uuid` | PK | 참가자 고유 ID |
| **`matchId`** | `uuid` | FK (`match.id`) | 소속 경기 ID |
| **`role`** | `USER-DEFINED` | NOT NULL | 선수 역할 (`'A'`, `'B'`) |
| **`name`** | `text` | NOT NULL | 선수 닉네임 |
| **`boss`** | `uuid[]` | NOT NULL | 선택한 보스 UUID 배열 `[1R 보스, 2R 보스]` |
| **`agentSlot`** | `jsonb` | NOT NULL | 1R/2R 에이전트 슬롯 2차원 배열 `Array<Array<{ id, rate }>>` |
| **`engineSlot`** | `jsonb` | NOT NULL | 1R/2R W-엔진 슬롯 2차원 배열 `Array<Array<{ id, rate }>>` |
| **`proposeBan`** | `text[]` | NULL | 밴 제안 캐릭터 ID 배열 (미사용 시 `[null, null]`) |
| **`selectBan`** | `text[]` | NULL | 확정 밴된 캐릭터 ID 배열 (미사용 시 `[null]`) |
| **`score`** | `bigint[]` | NOT NULL | 1R/2R 클리어 기본 점수 배열 `[1R, 2R]` |
| **`time`** | `bigint[]` | NOT NULL | 1R/2R 소요 시간(초) 배열 `[1R, 2R]` |

---

## 2. 게임 마스터 데이터 테이블 (Entities)

### 1) `agent` (캐릭터)
게임 내 플레이 가능한 에이전트 마스터 정보입니다.

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| **`id`** | `bigint` | PK | 에이전트 고유 ID (호요버스 공식 ID와 100% 동일) |
| **`nameKo`** | `text` | NOT NULL | 캐릭터 한글 단축명 (e.g. `'미야비'`, `'야나기'`) |
| **`nameEn`** | `text` | NOT NULL | 캐릭터 영문 단축명 (e.g. `'Miyabi'`, `'Yanagi'`) |
| **`fullNameKo`** | `text` | NULL | 캐릭터 한글 풀네임 (e.g. `'호시미 미야비'`) |
| **`fullNameEn`** | `text` | NULL | 캐릭터 영문 풀네임 (e.g. `'Hoshimi Miyabi'`) |
| **`rarity`** | `text` | NOT NULL | 등급 (`'S'`, `'A'`) |
| **`specialtyId`** | `uuid` | FK (`specialty.id`) | 전투 특성 UUID |
| **`attributeId`** | `uuid` | FK (`attribute.id`) | 속성 UUID |
| **`factionId`** | `bigint` | FK (`faction.id`) | 소속 진영 ID |
| **`color`** | `text` | NULL | 캐릭터 고유 테마 헥스컬러 (e.g. `'#30ae9e'`) |
| **`profileImageId`**| `uuid` | FK (`image.id`) | 프로필 아이콘 이미지 UUID |
| **`bannerImageId`** | `uuid` | FK (`image.id`) | 전신 일러스트 배너 이미지 UUID |
| **`version`** | `numeric` | NULL | 출시 버전 (e.g. `3.2`, `1.4`) |
| **`isPickup`** | `boolean` | DEFAULT false | 한정 픽업 여부 |
| **`isAllow`** | `boolean` | DEFAULT true | 밴픽 사용 허용 여부 |
| **`isTeaser`** | `boolean` | DEFAULT false | 티저 캐릭터 여부 |
| **`createdAt`** | `timestamptz` | DEFAULT now() | 등록 일시 |

---

### 2) `faction` (진영 / 소속)
에이전트가 소속된 진영 정보입니다.

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| **`id`** | `bigint` | PK | 진영 고유 ID (호요버스 Camp ID와 100% 동일, e.g. `165576`) |
| **`nameKo`** | `text` | NOT NULL | 진영 공식 한글명 (e.g. `'플린트 공방'`, `'공역순찰국'`) |
| **`nameEn`** | `text` | NOT NULL | 진영 공식 영문명 (e.g. `'Flint Workshop'`, `'Airspace Patrol Department'`) |
| **`hoyowikiId`** | `bigint` | NULL | 호요위키 고유 번호 |
| **`imageId`** | `uuid` | FK (`image.id`) | 진영 로고 엠블럼 이미지 UUID |
| **`createdAt`** | `timestamptz` | DEFAULT now() | 등록 일시 |

---

### 3) `specialty` (전투 특성)
강공, 격파, 이상, 지원, 방어, 명파 6대 특성 마스터입니다.

| 컬럼명 | 데이터 타입 | 설명 |
| :--- | :--- | :--- |
| **`id`** | `uuid` (PK) | 특성 고유 UUID |
| **`nameKo`** | `text` | 특성 한글명 (`강공`, `격파`, `이상`, `지원`, `방어`, `명파`) |
| **`nameEn`** | `text` | 특성 영문명 (`Attack`, `Stun`, `Anomaly`, `Support`, `Defense`, `Rupture`) |
| **`imageId`** | `uuid` | 특성 아이콘 이미지 UUID |

---

### 4) `attribute` (전투 속성)
물리, 불, 얼음, 전기, 에테르, 바람, 루멘 등 속성 마스터입니다.

| 컬럼명 | 데이터 타입 | 설명 |
| :--- | :--- | :--- |
| **`id`** | `uuid` (PK) | 속성 고유 UUID |
| **`nameKo`** | `text` | 속성 한글명 (`물리`, `불`, `얼음`, `전기`, `에테르`, `바람`, `루멘` 등) |
| **`nameEn`** | `text` | 속성 영문명 (`Physical`, `Fire`, `Ice`, `Electric`, `Ether`, `Wind`, `Lumiflux` 등) |
| **`imageId`** | `uuid` | 속성 아이콘 이미지 UUID |

---

### 5) `engine` (W-엔진)
에이전트가 장착하는 무기 마스터 정보입니다.

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| **`id`** | `uuid` | PK | W-엔진 고유 UUID |
| **`nameKo`** | `text` | NOT NULL | 엔진 한글명 (e.g. `'기사 예찬'`) |
| **`nameEn`** | `text` | NOT NULL | 엔진 영문명 (e.g. `'Knight''s Extolment'`) |
| **`rank`** | `USER-DEFINED` | NOT NULL | 엔진 등급 (`'S'`, `'A'`, `'B'`) |
| **`exclusiveAgentId`**| `bigint` | FK (`agent.id`) | 전용 에이전트 ID (공용은 `null`) |
| **`specialtyId`** | `uuid` | FK (`specialty.id`) | 대응 특성 UUID |
| **`attributeId`** | `uuid` | FK (`attribute.id`) | 대응 속성 UUID |
| **`isPickup`** | `boolean` | DEFAULT false | 픽업 엔진 여부 |
| **`isTeaser`** | `boolean` | DEFAULT false | 티저 엔진 여부 |
| **`imageId`** | `uuid` | FK (`image.id`) | 엔진 일러스트 이미지 UUID |
| **`iconImageId`** | `uuid` | FK (`image.id`) | 엔진 아이콘 이미지 UUID |

---

### 6) `boss` (보스 마스터)
강습전 상대 보스 몬스터 정보입니다.

| 컬럼명 | 데이터 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| **`id`** | `uuid` | PK | 보스 고유 UUID |
| **`nameKo`** | `text` | NOT NULL | 보스 한글명 (e.g. `'죽음의 도살자'`) |
| **`nameEn`** | `text` | NOT NULL | 보스 영문명 (e.g. `'Dead End Butcher'`) |
| **`hp`** | `bigint[]` | NULL | 페이즈별 HP 배열 (e.g. `[545249, 907019]`) |
| **`imageId`** | `uuid` | FK (`image.id`) | 보스 초상화 이미지 UUID |
| **`legacy_id`** | `bigint` | NULL | 레거시 시즌 보스 번호 |

---

### 7) `deadlyAssault` & `deadlyBoss` (강습전 시즌 및 보스 라인업)
시즌별 강습전 오픈 일시 및 보스 4종 매핑 정보입니다.

| 테이블명 | 주요 컬럼 | 설명 |
| :--- | :--- | :--- |
| **`deadlyAssault`** | `id` (uuid PK), `version` (double), `createdAt` (timestamptz) | 강습전 시즌 오픈 정보 |
| **`deadlyBoss`** | `id` (uuid PK), `deadlyAssaultId` (uuid FK), `bossId` (uuid FK), `type` | 시즌 보스 4종 라인업 매핑 (`trial`, `adversity`) |

---

## 3. 코스트 및 리소스 테이블 (Cost & Resources)

### 1) `agentCost` & `engineCost`
모든 캐릭터(0~6돌 7개 행)와 W-엔진(1~5돌 5개 행)의 돌파 단계별 개별 코스트 테이블입니다. (SSOT)

| 테이블명 | 주요 컬럼 | 필수 행 규격 | 설명 |
| :--- | :--- | :---: | :--- |
| **`agentCost`** | `id` (uuid), `agentId` (bigint FK), `rate` (bigint), `cost` (numeric) | **0~6돌 7개 행** | 런타임 `useCost` 훅 실시간 참조 |
| **`engineCost`** | `id` (uuid), `engineId` (uuid FK), `rate` (bigint), `cost` (numeric) | **1~5돌 5개 행** | 런타임 `useCost` 훅 실시간 참조 |

---

### 2) `image`
Cloudflare R2에 업로드된 정적 자산(프로필, 배너, 로고, 초상화)의 메타데이터 테이블입니다.

| 컬럼명 | 데이터 타입 | 설명 |
| :--- | :--- | :--- |
| **`id`** | `uuid` (PK) | 이미지 고유 UUID |
| **`src`** | `text` | Cloudflare R2 CDN 공개 URL (`https://images.zzz.freevue.dev/...`) |
| **`type`** | `USER-DEFINED` | 이미지 분류 유형 (`agent_profile`, `agent_banner`, `faction_logo` 등) |
| **`description`** | `text` | 이미지 설명 |

