# ParticipantBossSelect

## Information

`ParticipantBossSelect` 컴포넌트는 실시간 밴픽 단계 중 **보스 선택(Boss Select)** 단계를 담당하는 UI입니다.
Player B가 보스를 선택하고 확정하는 역할을 수행하며, Player A는 대기 화면을 봅니다.
단, `realtime.view`와 같은 테스트 환경이나 특정 설정에 따라 Player A도 선택이 가능하도록 `isActivePlayer` 로직을 포함합니다.

### State

- `localSelectedBossId`: 현재 로컬에서 선택(클릭)한 보스의 ID.
- `lastInteractionTime`: 마지막 상호작용 시간 (서버 상태와 동기화 시 딜레이 처리를 위해 사용).

### Props

| Name     | Type                       | Description                        |
| -------- | -------------------------- | ---------------------------------- |
| role     | `Rols` ('A' \| 'B' \| 'H') | 현재 사용자의 역할.                |
| room     | `RoomData`                 | 현재 방의 전체 데이터 (상태 포함). |
| onUpdate | `(room: RoomData) => void` | 방 상태 업데이트 콜백.             |

## Usage

```tsx
import ParticipantBossSelect from './index'

;<ParticipantBossSelect role="B" room={roomData} onUpdate={handleUpdate} />
```

## Dependencies

- [Typo](@zzz-picker/components/v2)
- [useSocket](@zzz-picker/provider/hooks)
- [useStore](@zzz-picker/provider/hooks)
