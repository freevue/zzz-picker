# Pick Component

## Information

- **Role**: 픽 페이즈(Pick Phase)의 UI를 담당합니다. 라운드별 에이전트 선택, 코스트 설정, 보스 선택 기능을 제공합니다.
- **Internal State**:
  - `round`: 현재 선택 중인 라운드 (`personal` | `common`).
  - `rarity`: 에이전트 리스트 필터링용 등급 (`S` | `A`).
  - `selectedSlotIndex`: 코스트 설정을 위해 선택된 슬롯 인덱스.
  - `isBossDialogOpen`: 보스 선택 다이얼로그 표시 여부.
- **Props**:
  - `role`: 현재 사용자의 역할 (`A`, `B`, `H`).
  - `pickList`: 각 라운드별 선택된 에이전트 목록.
  - `pickCost`: 각 라운드별 선택된 에이전트의 코스트 설정.
  - `boss`: 각 라운드별 선택된 보스.
  - `banList`: 밴된 에이전트 목록.
  - `onSelectAgent`, `onRemoveAgent`, `onSelectBoss`, `onCostChange`: 각 액션에 대한 콜백.
  - `slotCosts`: 각 슬롯의 계산된 코스트.

## Usage

```tsx
import PickPhase from './Pick'

;<PickPhase
  role="A"
  pickList={{ personal: [null, null, null], common: [null, null, null] }}
  boss={{ personal: null, common: null }}
  banList={[]}
  // ... callbacks
/>
```
