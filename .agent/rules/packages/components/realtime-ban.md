# Ban Component

## Information

- **Role**: 밴 페이즈(Ban Phase)의 UI를 담당합니다.
- **Internal State**:
  - `selectedBanId`: 밴 선택 페이즈(`B_BAN`, `A_BAN`)에서 선택한 에이전트 ID.
- **Props**:
  - `role`: 현재 사용자의 역할 (`A`, `B`, `H`).
  - `banPhase`: 현재 밴 페이즈 상태 (`A_SELECT`, `B_BAN`, `B_SELECT`, `A_BAN`).
  - `banCandidates`: 밴 후보로 선택된 에이전트 목록.
  - `currentBan`: 현재 밴된 에이전트 목록.
  - `onSelectAgent`: 에이전트를 클릭했을 때 호출되는 콜백.
  - `onSubmit`: 선택 완료 버튼을 클릭했을 때 호출되는 콜백.

## Usage

```tsx
import BanPhase from './Ban'

;<BanPhase
  role="A"
  banPhase={BAN_PHASE.A_SELECT}
  banCandidates={[]}
  currentBan={[]}
  onSelectAgent={(id) => console.log(id)}
  onSubmit={(id) => console.log(id)}
/>
```
