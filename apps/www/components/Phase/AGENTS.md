---
triger: model_decision
tags: [component, game-logic, realtime, phased]
aliases: [phase-components, ban-pick-flow]
---

# Phase GUIDE

## Purpose

- 실시간 멀티플레이어 환경에서의 게임 진행 단계(대기, 보스 선택, 밴, 픽, 완료)를 관리하고 각 단계에 맞는 UI를 렌더링합니다.

## Files

- [Ban.tsx](./Ban.tsx)
- [BossSelect.tsx](./BossSelect.tsx)
- [Pick.tsx](./Pick.tsx)
- [Status.tsx](./Status.tsx)
- [index.tsx](./index.tsx)

## Exports

- **Phase**: 전체 단계를 총괄하는 메인 컴포넌트 (`Socket` 레이어 하위에서 동작).
- **ROOM_PHASE**: 게임의 각 단계 (WAITING, BOSS_SELECT, BAN, PICK, DONE)를 정의하는 Enum.
- **RoomData**: 실시간 경기 방의 상태(State) 구조를 정의하는 타입.

## Dependencies

### Internal

- [v2](../../../../packages/components/src/v2/GUIDE.md)
- [constant](../../../../packages/constant/src/GUIDE.md)
- [provider](../../../../packages/provider/src/GUIDE.md)

### External

- [react](https://react.dev)
- [supabase](https://supabase.com/docs/reference/javascript/introduction)

## React: 실시간 동기화 전략

- **Optimistic Sync**: `Socket.SYNC` 이벤트를 통해 상태 변화를 모든 참여자에게 즉시 전파합니다.
- **DB Persistence**: 브로드캐스트와 동시에 Supabase DB에 상태를 저장하여 중도 참여자도 최신 상태를 유지할 수 있게 합니다.
- **Role-based UI**: `Host`, `A`, `B` 진영에 따라 서로 다른 조작 권한과 UI를 노출합니다.

## Example

```tsx
import { Phase } from '~/components/Phase'

;<Phase role={role} initialRoom={roomData} />
```
