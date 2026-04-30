---
triger: model_decision
tags: [component, simulation, game-board]
aliases: [playground-components, game-main]
---

# Playground GUIDE

## Purpose

- 실제 밴픽 시뮬레이션이 이루어지는 메인 경기 판(Board)을 구성하며, 점수 계산 및 라운드 정보를 표시합니다.

## 주요 구성 요소

- **Nickname**: 양 진영의 플레이어 이름 표시.
- **Round**: 각 라운드별 선택 현황 시각화.
- **TotalScore**: 최종 점수 합계 계산 및 표시.
- **Floating**: 플로팅 유틸리티 메뉴.

## Example

```tsx
import Playground from '~/components/Playground'

;<Playground />
```
