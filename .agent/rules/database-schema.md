---
description: zzz-picker의 Supabase 데이터베이스 스키마 및 테이블 구조 설명
---

# Database Schema

`zzz-picker` 프로젝트는 Supabase를 백엔드로 사용하며, 주요 데이터는 PostgreSQL 테이블에 저장됩니다.

## Project Info

- **Project ID**: `binfwietgookzeldgluj`
- **Region**: `ap-northeast-2` (Seoul)

## 1. Core Entities (게임 핵심 데이터)

게임의 밴픽 대상 및 기반 정보입니다.

### `agents` (에이전트)

게임 내 플레이 가능한 캐릭터 정보입니다.

| Column          | Type     | Description                       |
| :-------------- | :------- | :-------------------------------- |
| `id`            | `bigint` | 고유 ID                           |
| `name_ko`       | `text`   | 캐릭터 이름 (한글)                |
| `name_en`       | `text`   | 캐릭터 이름 (영문)                |
| `rarity`        | `text`   | 등급 (`S`, `A`)                   |
| `faction_id`    | `bigint` | 소속 진영 ID                      |
| `specialty_id`  | `bigint` | 특성 ID                           |
| `attributes_id` | `bigint` | 속성 ID                           |
| `param`         | `jsonb`  | 캐릭터 스탯 정보 (추가 기입 요망) |

### `engines` (W-엔진)

캐릭터가 착용하는 무기 정보입니다.

| Column               | Type     | Description              |
| :------------------- | :------- | :----------------------- |
| `id`                 | `bigint` | 고유 ID                  |
| `name_ko`            | `text`   | 무기 이름 (한글)         |
| `name_en`            | `text`   | 무기 이름 (영문)         |
| `rank`               | `text`   | 등급                     |
| `image_url`          | `text`   | 이미지 URL               |
| `exclusive_agent_id` | `bigint` | 전용 장비 대상 캐릭터 ID |

### `boss` (보스)

밴픽 게임에서 상대할 보스 몬스터 정보입니다.

| Column    | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id`      | `bigint` | 고유 ID                    |
| `name_ko` | `text`   | 보스 이름 (한글)           |
| `hp`      | `ARRAY`  | 체력 정보 (추가 기입 요망) |

### `faction` (진영)

캐릭터가 소속된 진영 정보입니다.

| Column    | Type     | Description      |
| :-------- | :------- | :--------------- |
| `id`      | `bigint` | 고유 ID          |
| `name_ko` | `text`   | 진영 이름 (한글) |
| `name_en` | `text`   | 진영 이름 (영문) |

### `specialty` (특성)

캐릭터/무기의 특성(역할군) 정보입니다. (강공, 격파, 이상, 지원, 방어)

| Column    | Type     | Description      |
| :-------- | :------- | :--------------- |
| `id`      | `bigint` | 고유 ID          |
| `name_ko` | `text`   | 특성 이름 (한글) |
| `name_en` | `text`   | 특성 이름 (영문) |

### `attributes` (속성)

캐릭터/무기의 속성 정보입니다. (불, 얼음, 전기, 물리, 에테르)

| Column    | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id`      | `bigint` | 고유 ID                    |
| `name_ko` | `text`   | 속성 이름 (한글)           |
| `name_en` | `text`   | 속성 이름 (추가 기입 요망) |

---

## 2. Game Content (게임 콘텐츠)

### `deadly_assault`

시유 방어전 등 특정 주간 콘텐츠 정보를 저장하는 것으로 추정됩니다.

| Column    | Type     | Description                  |
| :-------- | :------- | :--------------------------- |
| `id`      | `bigint` | 고유 ID                      |
| `week_at` | `date`   | 해당 주차                    |
| `boss_1`  | `bigint` | 1번 보스 ID (추가 기입 요망) |
| `boss_2`  | `bigint` | 2번 보스 ID (추가 기입 요망) |
| `boss_3`  | `bigint` | 3번 보스 ID (추가 기입 요망) |

### `boss_weakness_attribute`

보스의 약점 속성을 정의하는 테이블입니다.

| Column         | Type     | Description  |
| :------------- | :------- | :----------- |
| `id`           | `bigint` | 고유 ID      |
| `boss_id`      | `bigint` | 대상 보스 ID |
| `attribute_id` | `bigint` | 약점 속성 ID |

### `boss_resistance_attribute`

보스의 내성 속성을 정의하는 테이블입니다.

| Column         | Type     | Description  |
| :------------- | :------- | :----------- |
| `id`           | `bigint` | 고유 ID      |
| `boss_id`      | `bigint` | 대상 보스 ID |
| `attribute_id` | `bigint` | 내성 속성 ID |

---

## 3. Realtime System (실시간)

### `realtime_room`

실시간 밴픽 방 상태를 관리합니다.

| Column      | Type        | Description                         |
| :---------- | :---------- | :---------------------------------- |
| `id`        | `uuid`      | 방 고유 ID                          |
| `game_type` | `MatchType` | 경기 모드                           |
| `state`     | `jsonb`     | 현재 밴픽 진행 상태 (Full Snapshot) |

### `realtime_user`

방 참여자 세션 정보입니다.

| Column     | Type       | Description        |
| :--------- | :--------- | :----------------- |
| `id`       | `uuid`     | 유저 ID            |
| `room_id`  | `uuid`     | 방 ID              |
| `role`     | `UserRole` | 역할 (Host/Player) |
| `nickname` | `text`     | 닉네임             |

### `auth_key`

인증 키 관리를 위한 테이블입니다. (추가 기입 요망)

| Column | Type     | Description |
| :----- | :------- | :---------- |
| `id`   | `bigint` | 고유 ID     |
| `key`  | `text`   | 인증 키 값  |
| `type` | `text`   | 키 타입     |

---

## 4. History & Logs (기록)

경기 결과 및 통계를 위한 로그 테이블입니다.

### `match_log`

경기(매치) 전체에 대한 기록입니다.

| Column       | Type           | Description |
| :----------- | :------------- | :---------- |
| `id`         | `bigint`       | 고유 ID     |
| `a_name`     | `text`         | A팀 이름    |
| `b_name`     | `text`         | B팀 이름    |
| `match_type` | `USER-DEFINED` | 경기 타입   |
| `mach_at`    | `timestamptz`  | 경기 시간   |

### `play_log`

매치 내의 플레이 단위를 연결하는 로그로 보입니다.

| Column     | Type     | Description    |
| :--------- | :------- | :------------- |
| `id`       | `bigint` | 고유 ID        |
| `match_id` | `bigint` | 소속 매치 ID   |
| `round_id` | `bigint` | 소속 라운드 ID |

### `round_log`

라운드별 승패 및 정보를 기록합니다.

| Column       | Type           | Description      |
| :----------- | :------------- | :--------------- |
| `id`         | `bigint`       | 고유 ID          |
| `a_party_id` | `bigint`       | A팀 파티 정보 ID |
| `b_party_id` | `bigint`       | B팀 파티 정보 ID |
| `round_type` | `USER-DEFINED` | 라운드 타입      |

### `party_log`

해당 라운드에서 사용한 파티 구성 및 점수(시간) 기록입니다.

| Column         | Type     | Description              |
| :------------- | :------- | :----------------------- |
| `id`           | `bigint` | 고유 ID                  |
| `select_1`     | `bigint` | 1번 캐릭터 ID            |
| `select_2`     | `bigint` | 2번 캐릭터 ID            |
| `select_3`     | `bigint` | 3번 캐릭터 ID (Nullable) |
| `boss_id`      | `bigint` | 상대한 보스 ID           |
| `score`        | `bigint` | 점수 (추가 기입 요망)    |
| `elapsed_time` | `bigint` | 소요 시간                |

### `agent_select_log`

선택된 에이전트의 세부 세팅(장비, 돌파) 로그입니다.

| Column        | Type      | Description      |
| :------------ | :-------- | :--------------- |
| `id`          | `bigint`  | 고유 ID          |
| `agent_id`    | `bigint`  | 캐릭터 ID        |
| `agent_rate`  | `integer` | 캐릭터 돌파 수치 |
| `engine_id`   | `bigint`  | 착용 무기 ID     |
| `engine_rate` | `integer` | 무기 돌파 수치   |

### `ban_log`

밴픽 과정에서 밴(Ban)된 에이전트 기록입니다.

| Column         | Type     | Description     |
| :------------- | :------- | :-------------- |
| `id`           | `bigint` | 고유 ID         |
| `ban_agent_id` | `bigint` | 밴 된 캐릭터 ID |

---

## 5. Resources (리소스)

### `sources`

데이터 출처 관리 테이블입니다.

| Column | Type     | Description |
| :----- | :------- | :---------- |
| `id`   | `bigint` | 고유 ID     |
| `name` | `text`   | 출처 이름   |
| `url`  | `text`   | URL         |

### `agent_images`

에이전트 관련 추가 이미지 리소스입니다.

| Column        | Type     | Description    |
| :------------ | :------- | :------------- |
| `id`          | `bigint` | 고유 ID        |
| `agent_id`    | `bigint` | 대상 캐릭터 ID |
| `url`         | `text`   | 이미지 URL     |
| `description` | `text`   | 이미지 설명    |
