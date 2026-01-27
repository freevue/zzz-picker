---
triger: model_decision
tags: [route, remix, page]
aliases: [routes, pages]
---

# Routes GUIDE

## Purpose

- 어플리케이션의 각 페이지(라우트) 정의 및 데이터 로딩/액션을 담당합니다.

## Files

- [chat.tsx](./chat.tsx)
- [realtime.tsx](./realtime.tsx)
- [realtime.$roomId.tsx](./realtime.$roomId.tsx)
- [realtime.\_index.tsx](./realtime._index.tsx)
- [realtime.join.tsx](./realtime.join.tsx)

## Exports

### Chat

- **action**: Gemini AI와 통신하여 채팅 응답을 처리하는 서버 액션.
- **Chat**: 채팅 인터페이스를 제공하는 React 컴포넌트.

### Realtime

- **Realtime**: 실시간 레이아웃 라우트.
- **RealtimeRoot**: 방 생성 및 토큰 정보를 관리하는 루트 페이지 (`/realtime/_index`).
- **RealtimeRoom**: 실제 실시간 소켓 통신을 통해 밴픽을 진행하는 페이지 (`/realtime/$roomId`).
- **JoinRoom**: 유저 ID 기반 리다이렉션 처리 라우트 (`/realtime/join`).

## Dependencies

### Internal

- [supabase](../../../../packages/supabase/src/GUIDE.md)
- [v2](../../../../packages/components/src/v2/GUIDE.md)
- [Chat](../../components/Chat/GUIDE.md)
- [Realtime](../../components/Realtime/GUIDE.md)

### External

- [motion/react](https://motion.dev/docs/react-quick-start)
- [@remix-run/node](https://remix.run/docs/en/main/file-conventions/entry.server)
- [@remix-run/react](https://remix.run/docs/en/main/file-conventions/entry.client)

### Docs

- [REALTIME](./REALTIME.md)

## Remix: 라우팅 및 데이터 액션

- **Data Action**: `/chat` 라우트는 Remix `action`을 통해 사용자의 메시지를 서버로 전송하고, `chatWithGemini` 서비스를 호출하여 응답을 받아옵니다.
- **Optimistic UI**: `useState`와 `useEffect`를 조합하여 서버 응답 전 유저 메시지를 미리 화면에 표시하고 로딩 상태를 보여주는 Optimistic UI 패턴을 구현합니다.

## Example

```tsx
// chat.tsx 라우트는 직접적인 호출보다는 브라우저에서 /chat 경로로 접근하여 사용합니다.
```
