---
triger: model_decision
tags: [hub, components, collection]
aliases: [app-components, ui-hub]
---

# Components Hub GUIDE

## Purpose

- 어플리케이션 전용 비즈니스 로직이 포함된 UI 컴포넌트들을 모아둔 허브 폴더입니다.

## Directories (Components)

- **[Chat](./Chat/GUIDE.md)**: 실시간 AI 채팅 관련 컴포넌트.
- **[Realtime](./Realtime/GUIDE.md)**: 실시간 방 생성 및 관리 컴포넌트.
- **[Phase](./Phase/GUIDE.md)**: 게임 진행 단계별(Ban, Pick 등) UI.
- **[History](./History/GUIDE.md)**: 게임 통계 및 히스토리 컴포넌트.
- **[Playground](./Playground/GUIDE.md)**: 메인 경기 시뮬레이션 판.
- **[Header](./Header/GUIDE.md)**: 글로벌 레이아웃 헤더.
- **[Rule](./Rule)**: 게임 규칙 안내 컴포넌트.

## Files

- [CostTable.tsx](./CostTable.tsx)
- [DevLog.tsx](./DevLog.tsx)
- [BossDialog.tsx](./BossDialog.tsx)
- [index.ts](./index.ts)

## Exports

- **index.ts**: 모든 주요 컴포넌트들을 배럴링하여 외부(라우트 등)에서 쉽게 참조하도록 합니다.

## Dependencies

### Internal

- [v2](../../packages/components/src/v2/GUIDE.md) (기초 UI Kit)
- [constant](../../packages/constant/src/GUIDE.md)
- [provider](../../packages/provider/src/GUIDE.md)

## Example

```tsx
import { Phase, Header, Playground } from '~/components';

const GamePage = () => (
    <>
        <Header />
        <Playground />
        <Phase ... />
    </>
);
```
