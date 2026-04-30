---
triger: model_decision
tags: [package, utility, crypto, game-logic]
aliases: [utils-package]
---

# Utils GUIDE

## Purpose

- 어플리케이션 전반에서 사용되는 범용 유틸리티 함수(UUID 생성)와 게임 핵심 로직(코스트 계산, 진영 암복호화)을 담당합니다.

## Files (Original)

- `createUUID.ts`
- `encryptRole.ts`
- `decryptRole.ts`
- `getAgentCost.ts`
- `getEngineCost.ts`
- `getTotalCost.ts`
- `index.ts`

## Exports

- **createUUID**: 무작위 UUID 생성 함수.
- **encryptRole / decryptRole**: 유저의 진영(A, B, Host) 정보를 토큰화하여 보안을 유지하는 암복호화 함수.
- **getAgentCost / getEngineCost**: 캐릭터와 엔진의 개별 코스트 산출 로직.
- **getTotalCost**: 캐릭터, 엔진, 상태 등을 조합하여 파티의 최종 코스트를 계산하는 핵심 로직.

## Example

```typescript
import { getTotalCost } from '@zzz-picker/utils'

const cost = getTotalCost(costTable)([setting, agent, engine])
```
