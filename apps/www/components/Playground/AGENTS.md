---
triger: model_decision
tags: [component, simulation, game-board]
aliases: [playground-components, game-main]
---

# Playground GUIDE

## Purpose

- 실제 밴픽 시뮬레이션이 이루어지는 메인 경기 판(Board)을 구성하며, 점수 계산 및 라운드 정보를 표시합니다.

## Files

- [Nickname.tsx](./Nickname.tsx)
- [Round/index.tsx](./Round/index.tsx)
- [TotalScore.tsx](./TotalScore.tsx)
- [Floating/index.tsx](./Floating/index.tsx)
- [index.tsx](./index.tsx)

## Exports

- **Side (Default)**: 양 진영의 닉네임, 각 라운드별 선택 현황, 최종 점수 합계를 보여주는 메인 경기장 컴포넌트.

## Dependencies

### Internal

- [v2](../../../../packages/components/src/v2/GUIDE.md)
- [constant](../../../../packages/constant/src/GUIDE.md)

### External

- [motion/react](https://motion.dev/docs/react-quick-start)
- [@remix-run/react](https://remix.run/docs/en/main/file-conventions/entry.client)

## Example

```tsx
import Playground from '~/components/Playground'

;<Playground />
```
