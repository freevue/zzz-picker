# 실시간 밴픽 로직 연동 - Boss 선택 & Ban 페이즈

## 개요

실시간 밴픽 기능의 Boss 선택과 Ban 페이즈에 Socket 이벤트 기반 로직을 연동했습니다. UI 컴포넌트와 Socket Provider 간의 실시간 데이터 흐름을 구축하여, 참가자 간 상태가 자동으로 동기화되도록 구현했습니다.

## 주요 작업 내용

### 1. Boss 선택 로직 연동

- `Phase/Boss/index.tsx`: `useSocket().send`로 Boss 선택(`confirm: false` 미리보기) 및 확정(`confirm: true`) 이벤트 전송
- Boss 확정 시 `nextPhase: ROOM_PHASE.BAN`을 포함하여 자동 페이즈 전환
- Socket.tsx BOSS 핸들러에 `nextPhase` 파라미터 지원 추가

### 2. Ban 페이즈 로직 연동

- `Phase/Ban.tsx`: `SOCKET_EVENT.BAN` 이벤트 전송 로직 구현
  - `handleSelectAgent`: banCandidates 토글 (후보 선택/해제)
  - `handleSubmit`: banPhase에 따라 후보 제시 확정 또는 밴 확정 분기 처리
- `BanPhase` UI 컴포넌트에 `onSelectAgent`, `onSubmit(selectedBanId)` 콜백 Props 추가
- role/banPhase 기반 활성화 로직 구현: A_SELECT→A, B_BAN→B, B_SELECT→B, A_BAN→A

### 3. 실시간 상태 동기화

- `Phase/index.tsx`: `useSocket().state`를 구독하여 Socket 이벤트 변경 사항이 하위 컴포넌트에 자동 반영
- `initialRoom`은 fallback으로 유지, 실시간 상태(`socketState`)를 우선 사용

### 4. realtime.$roomId.tsx 연동

- `channelId`, `role` state를 DB 데이터에서 추출하여 `<Socket>`, `<Phase>`에 전달
- 기존 `room.id`(미존재 속성), `me.role`(미정의 변수) 참조 오류 해결

### 5. Ban 페이즈 UI 이슈 수정

- **banCandidates 초기화 조건**: 실제 밴 확정(`agentId` 있을 때)에만 초기화 → 후보 제시 확정 시 Host/상대방에게 후보가 유지됨
- **그리드 비활성화**: B_BAN/A_BAN 페이즈에서 에이전트 목록 클릭 불가, CandiBanList에서만 선택 가능
- **CandiBanList 표시**: 밴 선택 페이즈에서 모든 참가자(Host 포함)에게 표시
- **버튼 라벨**: 모든 페이즈에서 "확인"으로 통일

## 수정된 파일 목록

| 파일                                             | 변경 내용                                                |
| ------------------------------------------------ | -------------------------------------------------------- |
| `apps/www/components/Phase/Boss/index.tsx`       | Boss Socket 이벤트 전송, ROOM_PHASE import, 함수명 변경  |
| `apps/www/components/Phase/Ban.tsx`              | Ban Socket 이벤트 전송, banPhase 전환 로직               |
| `apps/www/components/Phase/index.tsx`            | useSocket 실시간 state 구독                              |
| `apps/www/app/routes/realtime.$roomId.tsx`       | channelId/role state 추가, Phase props 연결              |
| `packages/components/src/Realtime/Ban/index.tsx` | 콜백 Props, 활성화/비활성화 조건, CandiBanList 표시 조건 |
| `packages/provider/src/Socket.tsx`               | BOSS nextPhase 지원, banCandidates 초기화 조건 수정      |

## 데이터 흐름

```
사용자 액션 → useSocket().send(EVENT, payload)
  → Socket Provider broadcast → 모든 클라이언트 수신
  → setState 업데이트 → Phase useSocket().state 구독
  → roomState 갱신 → 하위 컴포넌트 re-render
```
