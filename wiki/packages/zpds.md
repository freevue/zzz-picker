---
name: zpds-package
description: ZPDS 공유 컴포넌트와 Storybook 작업 규칙, 테마 경계를 설명합니다.
---

# ZPDS 컴포넌트 개발 가이드

이 문서는 `packages/zpds`와 `apps/storybook`의 개발 기준입니다. renew 앱의 V2 다크 테마는 [`apps/renew/DESIGN.md`](../../apps/renew/DESIGN.md), V3 테마 토큰은 `packages/tailwind-config/src/theme-v3.css`를 확인합니다.

## 원칙

1. `packages/components`(V2), `packages/design-system`(V1)은 ZPDS 작업에서 수정하지 않습니다.
2. ZPDS는 서비스 로직을 담지 않는 UI 계층입니다. 에이전트 데이터는 `useAgent` 또는 props로 전달합니다.
3. 색상은 하드코딩하지 않고 CSS 변수를 사용합니다.
4. V3 테마에서는 형광 글로우를 사용하지 않습니다.

## V3 컬러 토큰

| 토큰 | 용도 |
| :--- | :--- |
| `--color-base` | 페이지 배경 |
| `--color-content` | 카드 surface 1 |
| `--color-netural` | surface 2 및 비활성 면 |
| `--color-elevated` | surface 3 및 강조 면 |
| `--color-primary` | A선수 및 주요 액센트(페리윙클) |
| `--color-secondary` | B선수 및 보조 액센트(민트) |
| `--color-tertiary` | 밴·경고(로즈) |
| `--color-ink` | 본문 텍스트 |

## 컴포넌트 인벤토리

| 컴포넌트 | 소스 경로 | Storybook 제목 |
| :--- | :--- | :--- |
| AgentCard, AgentGrid, AgentProfile | `packages/zpds/src/<이름>/` | `ZPDS/<이름>` |
| BanIndicator, BossCard, EngineCard | `packages/zpds/src/<이름>/` | `ZPDS/<이름>` |
| Button, Card, Dialog, Divider | `packages/zpds/src/<이름>/` | `ZPDS/<이름>` |
| CostIndicator, Increase, Input, NicknameInput | `packages/zpds/src/<이름>/` | `ZPDS/<이름>` |
| NumberInput, ScoreInput, Table, Tabs, TimeInput, Tooltip | `packages/zpds/src/<이름>/` | `ZPDS/<이름>` |
| Typo.Number, Typo.AgentName | `packages/zpds/src/Typo/` | `ZPDS/Typo` |

## 구현과 Storybook

```text
packages/zpds/src/<ComponentName>/index.tsx
apps/storybook/src/stories/Zpds.<Name>.stories.tsx
```

- 기본 Storybook 테마는 `v3`이며, 뷰포트는 방송 화면 기준 1280×720 `streaming`입니다.
- 에이전트 데이터가 필요한 스토리는 `MockStoreProvider` 데코레이터를 사용합니다.
- 신규 컴포넌트는 `packages/zpds/src/index.ts`에 export하고, 기본·변형·비활성·상호작용 상태를 스토리로 보여줍니다.
- 컴포넌트 파일은 150줄 이하, 내부 상태는 3개 이하로 유지합니다.
- CSS 변수만 사용하고 V3 테마에서 글로우 효과를 추가하지 않습니다.
