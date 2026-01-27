---
triger: model_decision
tags: [component, statistics, history, chart]
aliases: [history-components, dashboard]
---

# History GUIDE

## Purpose

- 플레이어의 과거 경기 데이터(픽률, 밴율, 승률, 점수 등)를 시각화하고 통계를 제공하는 대시보드 성격의 컴포넌트 모음입니다.

## Files

- [BestMatch.tsx](./BestMatch.tsx)
- [BestPick.tsx](./BestPick.tsx)
- [BestScore.tsx](./BestScore.tsx)
- [TotalScore.tsx](./TotalScore.tsx)
- [AppleSection.tsx](./AppleSection.tsx)
- [index.ts](./index.ts)
- (기타 다수의 통계용 컴포넌트 포함)

## Exports

- **Count / Title / Date**: 기본적인 카드 정보 표시 컴포넌트.
- **BestPick / BestBan / BestBoss**: 가장 많이 선택/금지된 요소들을 보여주는 랭킹 컴포넌트.
- **BestMatch**: 가장 성능이 좋았던 조합 정보를 시각화.
- **AppleSection / AppleTitle**: 특정 디자인 테마(Apple-style)를 적용한 섹션 구성요소.

## Dependencies

### Internal

- [v2](../../../../packages/components/src/v2/GUIDE.md)
- [constant](../../../../packages/constant/src/GUIDE.md)

## React: 통계 시각화

- **Data Driven**: 외부에서 주입된 데이터 히스토리를 기반으로 맵핑 및 집계를 수행하여 동적으로 차트와 리스트를 생성합니다.
- **Modular Components**: 각 통계 항목(점수, 시간, 코스트 등)이 독립된 파일로 분격되어 있어 필요한 페이지만 골라 조합할 수 있습니다.

## Example

```tsx
import { BestMatch, TotalScore } from '~/components/History';

<BestMatch data={historyData} />
<TotalScore value={score} />
```
