# Host/참가자 픽 연동 및 실시간 상태 동기화 버그 해결 (작업 요약)

## 1. 개요

- **사용자 제보 문제점**:
  1. (완료됨) Host 화면에서 참가자가 선택한 캐릭터 정보가 실시간으로 연동되지 않는 문제.
  2. (완료됨) END 페이즈에 도달했을 때 빈 화면만 보이며 경고/축하 메시지가 없는 현상.
  3. (완료됨) 참가자들이 캐릭터나 Cost를 변경하는 중간 과정이 DB(`realtime_room`)에 즉시 반영되지 않아, 중간 새로고침 시 데이터가 초기화되는 버그 (잦은 DB I/O 부하 우려).
  4. (완료됨) Pick 페이즈 단계에서의 보스 임시 선택(`confirm: false`) 시 실시간으로 데이터가 DB에 연동되지 않아 새로고침 시 선택이 날아가는 현상.

## 2. 작업 내용 및 원인 해결

### A. Host 픽 연동 및 Cost Map 동기화 (`Socket.tsx`)

- **원인**: `Play.tsx`와 달리 `Socket.tsx`의 내부 상태 관리(Context)에서, 브로드캐스트로 전달받은 `PICK` 이벤트의 배열 데이터(`allPickList`)를 `cost` (Map 구조)에 자동으로 파싱해주는 Effect 체인이 없었기 때문에 Host 화면에서 렌더링에 필요한 객체를 찾지 못해 빈 슬롯으로 나타남.
- **해결**: `allPickList`를 순회하며 `agentId` 단위로 `cost` Map에 삽입해주는 렌더링 동기화 `useEffect`를 추가하여 UI 연동 불일치 버그 픽스.

### B. 500ms 디바운싱(Debouncing) 기반 DB 저장 적용 (`Socket.tsx`)

- **원인**: 실시간 캐릭터 선택 및 Cost 증감을 로컬 state에만 반영하고, DB Update 액션은 `confirm` 단계에서만 이루어져 중간 단계 누락 발생. 하지만 모든 키 입력마다 DB를 Update를 때리면 병목과 버벅임(UI 렉) 유발.
- **해결**: 외부 JS 라이브러리(`lodash`) 배제.
  - `React.useRef`와 `setTimeout`을 결합한 인라인 500ms 딜레이 디바운서(`dbUpdateTimerRef`) 구현.
  - `SOCKET_EVENT.PICK`과 `COST` 이벤트 데이터가 브로드캐스트될 때마다 메모리 상태(setState)는 즉각 적용하여 잔상을 없애고, 실제 Supabase DB Update 쿼리만 0.5초(500ms) 뒤 한 번에 실행도록 분리 최적화 완료.
  - UI 컴포넌트 Unmount 시(`useEffect` return) `clearTimeout` 기반 메모리 릭(가비지 타임) 안전 처리.

### C. Pick 페이즈 보스 선택 즉시 동기화 확립

- **해석**: 캐릭터 픽과 달리 보스 선택 이벤트(`SOCKET_EVENT.BOSS`)는 주로 다이얼로그 확인창 단위로 명확하게 클릭 동작이 발생하므로 디바운싱의 오버엔지니어링 필요성이 없음.
- **해결**: `SOCKET_EVENT.BOSS`의 `!confirm(임시 선택)` 분기문에 Supabase DB Update 쿼리를 추가 입력하여 참가자가 챔피언 확인을 누르기 전이라도 클릭하는 즉시 DB와 실시간 동기화.

### D. END 페이즈 렌더링 컴포넌트 추가 (`Phase/End.tsx` 신설)

- **작업**:
  - 기존 `Phase/index.tsx`에서 다루지 않던 `ROOM_PHASE.DONE` 분기를 추가.
  - "그로기 상태에 진입합니다."라는 유머 텍스트 멘트와, `window.close()`로 탭을 끄는 "나가기" 버튼을 포함한 `End.tsx` 컴포넌트 작성 밑 마운트 연동.

---

- **작업 완료 일자**: 2026-02-21
- **담당 대행자**: Antigravity
