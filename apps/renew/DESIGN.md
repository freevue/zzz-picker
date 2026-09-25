---
name: zzz-picker-design
version: "2.0.0"
description: zzz-picker(엔강대 밴픽 플랫폼) renew 앱 전용 퓨어 다크 테크니컬 디자인 시스템 명세서 (Google Labs DESIGN.md 오픈 표준 준수)
colors:
  base: "#0c0f12"
  content: "#141920"
  netural: "#1c2331"
  elevated: "#252f42"
  primary: "#ffd215"
  secondary: "#00f0ff"
  tertiary: "#ff4500"
  chip: "#a855f7"
  ink: "#ffffff"
  disabled: "#374151"
  dark-surface: "#16181f"
typography:
  headline:
    fontFamily: "Ria, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Wanted Sans Variable, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Wanted Sans Variable, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "normal"
  mono:
    fontFamily: "monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  "2xl": "20px"
  "3xl": "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  "2xl": "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.dark-surface}"
    rounded: "{rounded.full}"
    padding: "14px 24px"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.dark-surface}"
    rounded: "{rounded.full}"
    padding: "10px 20px"
  card-base:
    backgroundColor: "{colors.content}"
    textColor: "{colors.ink}"
    rounded: "{rounded.3xl}"
    padding: "16px"
  card-glass:
    backgroundColor: "rgba(255, 255, 255, 0.03)"
    textColor: "{colors.ink}"
    rounded: "{rounded.3xl}"
    padding: "16px"
  card-active:
    backgroundColor: "{colors.content}"
    textColor: "{colors.ink}"
    rounded: "{rounded.2xl}"
    border: "2px solid {colors.primary}"
  chip-status:
    backgroundColor: "rgba(168, 85, 247, 0.3)"
    textColor: "{colors.ink}"
    rounded: "{rounded.2xl}"
    border: "1px solid {colors.chip}"
    padding: "8px 16px"
---

# renew (v2) 디자인 시스템 및 UI/UX 명세서 (DESIGN.md)

이 문서는 `@zzz-picker/renew` 애플리케이션의 공식 디자인 시스템 명세서로, Google Labs의 코딩 에이전트 전용 디자인 시스템 명세 표준(`@google/design.md`)을 준수합니다.

---

## 1. Overview

- **브랜드 비전 & 톤앤매너**: 젠레스 존 제로(Zenless Zone Zero) 특유의 카본 다크와 네온 시그니처 톤을 계승하여 눈의 피로를 최소화하고 절제된 하이테크 e스포츠 감성을 제공합니다.
- **퓨어 다크 모드 지향 (Pure Dark Technical)**:
  - 라이트 모드를 전면 배제하고 깊은 다크 카본 블랙(`--color-base: #0c0f12`)과 시그니처 네온 옐로우(`--color-primary: #ffd215`)를 주조색으로 설정합니다.
  - `<html lang="ko" className="dark">` 고정 및 뷰포트 `100vw x 100vh` 스크롤 차단(`overflow: hidden`, `overscroll-y-none`)으로 웹 브라우저가 아닌 네이티브 경기용 앱과 같은 안정적 몰입감을 제공합니다.
- **키네틱 사선 롤링 텍스트 배경 (Kinetic Rolling Background)**:
  - `Background.tsx`에서 초대형 타이포그래피(`text-9xl text-primary/5 ft-ria`)를 -40도 사선으로 배치합니다.
  - 짝수 라인(`animate-rollingBg-reverse`)과 홀수 라인(`animate-rollingBg`)이 120초 주기로 역방향 교차 롤링하여 정적인 다크 화면에 테크니컬한 역동성을 주입합니다.
  - 롤링 텍스트에는 프로젝트의 아이덴티티 키워드인 '엔강대', '엔코르', '앨리스', '타임필드'가 교차 표기됩니다.

---

## 2. Colors

### 2.1 핵심 컬러 팔레트 (CSS 변수)

| 디자인 토큰 (CSS 변수) | HEX / Value | 설명 및 주요 적용처 |
| :--- | :--- | :--- |
| `--color-base` | `#0c0f12` | **메인 배경색**. 최하단 다크 카본 블랙 |
| `--color-content` | `#141920` | **콘텐츠 카드 배경색**. 차콜 블루 톤 (`.card`) |
| `--color-netural` | `#1c2331` | **비활성 서브 면**. 단차 분리를 위한 보조 머티리얼 |
| `--color-elevated` | `#252f42` | **강조 표면 / 인풋 배경**. 인풋 필드, 비활성 슬롯, 모달 다이얼로그 |
| `--color-primary` | `#ffd215` | **시그니처 옐로우/골드**. 헤드라인 타이틀, 메인 CTA 버튼, 액티브 픽 보더 |
| `--color-secondary` | `#00f0ff` | **네온 시안**. 서브 액션(복사 버튼), 활성 헤더, 실시간 접속 펄스 인디케이터 |
| `--color-tertiary` | `#ff4500` | **시그널 오렌지 레드**. 경고, 에러, 코스트 한도 초과 알림 |
| `--color-chip` | `#a855f7` | **네온 바이올렛/퍼플**. 상태 칩(`Chip`), 경기 메타데이터 뱃지 |
| `--color-ink` | `#ffffff` | **메인 텍스트**. 순백색 초고대비 폰트 |
| `--color-disabled` | `#374151` | **비활성화 요소**. 다크 배경 위 차콜 그레이 |
| `--dark-surface` | `#16181f` | **버튼 텍스트용 다크 잉크**. 고휘도 버튼(Primary, Secondary) 위 텍스트 컬러 |

### 2.2 그라디언트 시스템

- `--grad-page`: `radial-gradient(1200px 600px at 15% 0%, #172030 0%, #0c0f12 55%)` (페이지 전체 루트 배경)
- `--grad-primary`: `linear-gradient(135deg, #ffd215 0%, #ff9f00 100%)` (강조 버튼 및 승리 배지)
- `--grad-secondary`: `linear-gradient(135deg, #00f0ff 0%, #00a2ff 100%)` (시안 포인트 하이라이트)
- `--grad-surface`: `linear-gradient(160deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0) 60%)` (유리 질감 면)

### 2.3 shadcn UI 시맨틱 토큰 매핑 (Tailwind v4 `@theme inline`)

```css
--background: var(--color-base);
--foreground: var(--color-ink);
--card: var(--color-content);
--card-foreground: var(--color-ink);
--popover: var(--color-elevated);
--popover-foreground: var(--color-ink);
--primary: var(--color-primary);
--primary-foreground: #16181f;
--secondary: var(--color-secondary);
--secondary-foreground: #16181f;
--muted: var(--color-netural);
--muted-foreground: color-mix(in oklab, var(--color-ink) 55%, transparent);
--accent: var(--color-elevated);
--accent-foreground: var(--color-ink);
--destructive: var(--color-tertiary);
--border: color-mix(in oklab, var(--color-ink) 8%, transparent);
--input: color-mix(in oklab, var(--color-ink) 12%, transparent);
--ring: var(--color-primary);
```

---

## 3. Typography

| 폰트 패밀리 | 클래스 | 웨이트 / 용도 | 디자인 의도 및 특징 |
| :--- | :--- | :--- | :--- |
| **Ria Sans ExtraBold** | `.ft-ria` | ExtraBold (800)<br>헤드라인, 스코어, 코스트, 타이머 | ZZZ 특유의 묵직하고 강렬한 볼드 타이포그래피. 게임 경기 숫자의 시인성을 극대화 |
| **Wanted Sans Variable** | `.ft-pre` | Variable (500~900)<br>선수 닉네임, 컨트롤러, 본문, 라벨, 테이블 | 정돈된 기하학적 산세리프. 한글과 영문의 완벽한 조화와 작은 폰트에서도 우수한 가독성 |

---

## 4. Layout

### 4.1 뷰포트 및 반응형 원칙
- 기본 규격: `100vw x 100vh` 풀스크린 고정.
- 오버스크롤 차단(`overscroll-y-none`)과 스크롤바 숨김(`scrollbar-hidden`) 적용.

### 4.2 플레이어 밴픽 화면 (`PlayGround`) - 모바일 우선 (`max-w-lg`)
- 너비: 모바일 최적화 규격 `max-w-lg` (가로 중앙 정렬).
- 상단: 내 닉네임 및 역할 고정 헤더 (`text-4xl text-primary ft-ria`).
- 단계별 진행:
  1. **보스 선택 (`Boss`)**: 공용 무대 보스 카드 그리드 및 하단 플로팅 선택 버튼.
  2. **밴 단계 (`Ban` / `BanFix`)**: 제안 밴 3열 그리드(`grid-cols-3 gap-4`) 및 풀스크린 블러(`backdrop-blur-xl`) 오버레이 기반 2선택 1확정 인터페이스.
  3. **픽 단계 (`Pick`)**: 1R/2R 라운드 탭, 3인 에이전트 슬롯 + W-엔진 슬롯, 하단 고정 잔여 코스트 플로팅 알약 바 (`Cost`).

### 4.3 호스트 경기 대시보드 (`HostDashboard`) - 데스크톱 3단 분할 그리드
- 화면 분할 구조:
  ```text
  ┌─────────────────┬─────────────────┬─────────────────────────────────────┐
  │ [좌측: 규칙/제어] │ [중앙: 밴/보스]  │ [우측: 메인 경기판 & 결산]          │
  │                 │                 │                                     │
  │  ← 홈 이동      │  경기 타입 배지  │  선수 닉네임 (A vs B) & 접속 칩    │
  │  특수 룰 텍스트  │  공용 보스 슬롯  │  ─────────────────────────────────  │
  │                 │  허용 캐릭터     │  1 Round: A파티 ── VS ── B파티     │
  │                 │  밴 결과 현황    │  2 Round: A파티 ── VS ── B파티     │
  │                 │  (A 밴 → B 밴)  │  (타이머, 점수, 에이전트/엔진 슬롯) │
  │                 │  캐릭터 일러스트 │  ─────────────────────────────────  │
  │                 │                 │  [파티보기 ↔ 결산하기 슬라이딩 토글] │
  └─────────────────┴─────────────────┴─────────────────────────────────────┘
  ```
- **좌우 대칭 구조**: A선수는 왼쪽 정렬, B선수는 `flex-row-reverse` 오른쪽 대칭 정렬로 경기 대진 구도를 시각화.
- **결산 모드 전환**: CSS 슬라이딩 트랜지션을 통해 원클릭으로 1R/2R 파티 슬롯에서 최종 스코어 및 코스트 보너스 결산판(`Result`)으로 부드럽게 교체.

---

## 5. Elevation & Depth

- **면(Surface) 중심 레이어링**:
  - 인위적인 1px Border 남발을 배제하고, 배경과 패널 간의 **미세한 명도 단차(Depth Elevation)**로 면을 명확히 구분합니다.
  - 고도 계층: `Base (#0c0f12)` ➡️ `Content (#141920)` ➡️ `Neutral (#1c2331)` ➡️ `Elevated (#252f42)`.
- **글래스모피즘 (`.card.glas`)**:
  - `backdrop-blur-md` 및 `backdrop-saturate-100` 적용.
  - 은은한 내부 조명 효과: `box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)`.

---

## 6. Shapes

- **모서리 라운딩 토큰**:
  - 카드 및 패널: `rounded-3xl` (`24px`) / `rounded-2xl` (`20px`).
  - 버튼 및 플로팅 배지: `rounded-full` (`9999px`) 알약형 디자인.
  - 인풋 필드 및 칩: `rounded-2xl` (`20px`).
- **마이크로 인터랙션 & 보더 효과**:
  - **선택된 캐릭터 카드 (`.card.active`)**:
    - `::before` 가상 요소에 3초 주기의 무한 회전 코닉 그라디언트(`conic-gradient`)를 배치하여 네온 옐로우 빛이 테두리를 감싸며 회전하는 효과 연출.
  - **액티브 섀도우 (`.shadow-active`)**:
    - `box-shadow: 0px 0px 0px 4px var(--color-primary)`로 캐릭터 선택 시 강렬한 포커스 링 생성.
  - **실시간 접속 펄스 (`Pulse`)**:
    - 접속 중: `size-4 rounded-full bg-secondary animate-pulse`.
    - 오프라인: `size-4 rounded-full bg-red-400`.

---

## 7. Components

### 7.1 버튼 및 액션 컴포넌트
- **알약형 메인 CTA**:
  - 생성/확인 버튼: `bg-primary text-[#16181f] font-black ft-pre text-2xl h-14 rounded-full`.
  - 복사 버튼: `bg-secondary text-[#16181f] font-bold rounded-full`.
- **돌파 조절기 (`RateController`)**:
  - 화면 하단 고정 플로팅 바 (`sticky bottom-4`).
  - 원형 증감 버튼(`size-18 bg-primary rounded-full`)과 대형 돌파 수치(`text-5xl ft-ria text-primary`).

### 7.2 카드 및 슬롯 컴포넌트
- **에이전트/엔진 버튼 (`AgentButton`, `EngineButton`)**:
  - 1:1 정사각형 비율(`aspect-square`), `rounded-2xl`, 비활성 시 그레이스케일(`disabled:grayscale-100`).
  - 선택 시 `shadow-active` 및 활성 상태 오버레이 적용.
- **칩 (`Chip`)**:
  - `border border-chip bg-chip/30 h-12 py-2 px-4 rounded-2xl ft-pre text-ink text-xl font-bold`.

### 7.3 월페이퍼 갤러리 (`/wallpaper`)
- 수평 스크롤 스냅 레이아웃 (`snap-mandatory snap-x`) + 마우스 휠 가로 변환 지원.
- Chrome View Transition API(`::view-transition-group(.wallpaper-top)`) 연동으로 카드 클릭 시 풀스크린 확대/축소 모션 제공.

---

## 8. Do's and Don'ts

### Do's (반드시 지켜야 할 사항)
1. **순수 다크 테마 일관성 유지**: 모든 화면은 `#0c0f12` 기반의 퓨어 다크를 유지하며, 라이트 모드는 절대 구현하지 않습니다.
2. **면 기반 단차 레이아웃 준수**: 컨테이너 구분 시 1px 실선 대신 `bg-content`, `bg-neutral`, `bg-elevated`의 명도 차이를 사용합니다.
3. **타이포그래피 역할 분담**: `ft-ria`는 스코어, 코스트, 카운트다운 타이머, 메인 영문 헤드라인에만 사용하고, 선수 닉네임과 일반 본문에는 반드시 가독성이 검증된 `ft-pre`(Wanted Sans)를 사용합니다.
4. **터치 친화적 타깃 확보**: 모든 버튼 및 선택 슬롯은 최소 48px 이상의 터치/클릭 타깃 영역을 보장합니다.

### Don'ts (금지해야 할 안티패턴)
1. **불필요한 흰색/회색 외곽선 남발 금지**: 다크 테마의 깊이감을 해치는 고대비 회색 외곽선(`border-gray-500`)을 사용하지 않습니다.
2. **긴 설명 문장에 Ria 폰트 사용 금지**: `ft-ria`는 볼드 헤드라인 전용이므로 긴 텍스트 문단에 사용하면 시각적 피로를 유발합니다.
3. **루트 뷰포트 스크롤 발생 금지**: 루트 컨테이너에 `overflow-y-auto`가 누출되어 이중 스크롤바가 생기지 않도록 차단합니다.
4. **임의의 원색 하드코딩 금지**: 팔레트에 정의되지 않은 임의의 컬러 코드를 인라인 스타일로 주입하지 않고 반드시 정의된 디자인 토큰을 참조합니다.

---

## 관련 룰 및 문서

| Rule / Doc | Description |
| :--- | :--- |
| [최상위 룰 인덱스 (GEMINI.md)](../../.agent/rules/GEMINI.md) | zzz-picker 전체 룰 및 지식 아키텍처 SSOT |
| [루트 LLM 위키 (wiki/index.md)](../../wiki/index.md) | 컴파일된 전체 도메인 지식 베이스 |
