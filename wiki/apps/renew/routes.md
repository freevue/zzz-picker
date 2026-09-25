---
name: renew-routes
description: @zzz-picker/renew 애플리케이션의 라우트 목록과 각 페이지의 역할 및 동작 방식을 설명합니다.
---

# renew 라우트

`apps/renew/app/routes/` 디렉토리에 정의된 Remix 기반의 라우트 명세입니다.

## 라우트 목록

| 라우트 경로 | 파일 경로 | 설명 |
| :--- | :--- | :--- |
| `/` | `app/routes/_index.tsx` | **메인 홈**. 게임 모드 선택 및 방 생성 모달(`CreateRoom`), 명예의 전당, 규칙 안내 |
| `/$roomId` | `app/routes/$roomId.tsx` | **실시간 밴픽 경기장**. URL 쿼리(`role=A|B|H`)에 따라 플레이어 화면 또는 호스트 대시보드 렌더링 |
| `/room/$id` | `app/routes/room.$id.tsx` | **경기 방 세부 정보 조회**. 공유 및 경기 진입 리다이렉션 라우트 |
| `/bracket` | `app/routes/bracket.tsx` | **토너먼트 대진표**. 8강부터 결승까지 관리하고 선택한 경기의 방을 생성 |
| `/wallpaper` | `app/routes/wallpaper.tsx` | **월페이퍼 갤러리**. 가로 스크롤 스냅 갤러리 및 확대 모션 |
| `/calc` | `app/routes/calc.tsx` | **점수 계산기 단독 뷰**. 1R/2R 점수, 시간 보너스, 코스트 보너스/페널티 계산 시뮬레이터 |
| `/cost` | `app/routes/cost.tsx` | **코스트 대시보드 뷰**. 에이전트 및 엔진 코스트 기준표 조회 |
| `/loading` | `app/routes/loading.tsx` | **로딩 인디케이터 테스트 뷰** |

### 토너먼트 대진표 (`/bracket`)

- 8강 4경기, 4강 2경기, 결승 1경기를 한 화면에 배치합니다.
- 참가자 이름과 승자 선택은 브라우저 `localStorage`에 저장됩니다. 서버 간 동기화는 하지 않습니다.
- 화면은 드래그로 이동하고 휠로 확대·축소합니다.
- `경기 진행`은 양쪽 참가자 이름이 있을 때 사용할 수 있습니다. 설정 후 `match`와 두 `play` 행을 생성하고 `/:roomId` 로비를 새 탭에 엽니다.

## 핵심 라우트 상세

### 1. 메인 홈 (`/_index.tsx`)
- 젠레스 존 제로 특유의 사선 롤링 텍스트 배경(`Background`)과 플로팅 네비게이션을 제공합니다.
- `CreateRoom` 모달을 통해 `정식 로프꾼(original)`, `레전드 로프꾼(legend)`, `공허사냥꾼(unlimited)` 중 리그를 선택하고, A선수와 B선수의 닉네임을 기입하여 Supabase `match` 및 `play` 레코드를 생성합니다.
- 생성이 완료되면 고유 `roomId`와 함께 각 역할별 접속 링크(호스트 `role=H`, A선수 `role=A`, B선수 `role=B`)를 발급합니다.

### 2. 실시간 밴픽 경기장 (`/$roomId.tsx`)
- 방의 `roomId`와 사용자 URL 쿼리 파라미터(`role`)를 분석하여 참가자 역할을 결정합니다:
  - `role === 'A' || role === 'B'`: 모바일 우선 규격의 [`PlayGround`](./components.md#playground) 컴포넌트를 마운트하여 밴픽 및 보스 선택 인터페이스를 제공합니다.
  - `role === 'H'`: 데스크톱 3단 분할 규격의 [`HostDashboard`](./components.md#hostdashboard)를 마운트하여 실시간 브로드캐스트를 수신하고 양측의 선택을 관전 및 결산합니다.
- `MatchProvider`를 통해 방의 실시간 상태를 구독하고 브로드캐스트합니다.
