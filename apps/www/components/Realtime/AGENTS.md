---
triger: model_decision
tags: [component, realtime, multiplayer]
aliases: [realtime-components]
---

# Realtime GUIDE

## Purpose

- 실시간 밴픽 경기를 위한 방(Room) 생성 및 참여 정보 관리를 담당하는 컴포넌트 모음입니다.

## Files

- [CreateRoomForm.tsx](./CreateRoomForm.tsx)
- [RoomInfo.tsx](./RoomInfo.tsx)
- [index.ts](./index.ts)

## Exports

- **CreateRoomForm**: 정식/레전드/언리미티드 리그를 선택하고 참여할 플레이어들의 닉네임을 입력받아 방을 생성하는 폼 컴포넌트.
- **RoomInfo**: 생성된 방의 접속 링크를 표시하고 클립보드 복사 기능을 제공하며, 초기화 상태로 돌릴 수 있는 컴포넌트.

## Dependencies

### Internal

- [v2](../../../../packages/components/src/v2/GUIDE.md)
- [constant](../../../../packages/constant/src/GUIDE.md)

### External

- [motion/react](https://motion.dev/docs/react-quick-start)
- [@fxts/core](https://fxts.dev/)
- [react](https://react.dev)

## React: 상태 및 애니메이션

- **상태 관리**: `useState`를 사용하여 리그 선택 및 사용자 닉네임 상태를 로컬에서 관리합니다.
- **애니메이션**: `motion/react`의 `AnimatePresence`와 `motion.div`를 사용하여 폼과 정보 사이의 탭 전환 및 초기 진입 시 부드러운 페이드 효과를 적용합니다.

## Example

```tsx
import { CreateRoomForm, RoomInfo } from './components/Realtime';

// 방 생성 폼 사용 시
<CreateRoomForm onSubmit={handleCreateRoom} />

// 생성된 방 정보 표시 시
<RoomInfo list={tokenList} onReset={handleReset} />
```
