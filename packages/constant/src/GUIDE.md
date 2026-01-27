---
triger: model_decision
tags: [package, constant, type]
aliases: [constants]
---

# Constant GUIDE

## Purpose

- 프로젝트 전반에서 사용되는 공통 상수, 열거형(Enum), 타입을 정의합니다.

## Files

- [history.d.ts](./history.d.ts)
- [index.ts](./index.ts)
- [types.d.ts](./types.d.ts)

## Exports

- **Side**: 경기 진영 (A 또는 B)을 나타내는 타입.
- **Leagues**: 정식, 레전드, 언리미티드 등의 리그 정보를 정의.

## Example

```typescript
import { Leagues } from '@zzz-picker/constant'

console.log(Leagues.LEGEND)
```
