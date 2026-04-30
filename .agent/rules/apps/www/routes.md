---
triger: model_decision
tags: [route, remix, page]
aliases: [routes, pages]
---

# Routes GUIDE

## Purpose

- 어플리케이션의 각 페이지(라우트) 정의 및 데이터 로딩/액션을 담당합니다.

## 라우트 목록

- **Chat (`/chat`)**: Gemini AI와 통신하여 채팅 인터페이스 제공.
- **Realtime (`/realtime`)**: 실시간 레이아웃.
  - `_index`: 방 생성 및 입장.
  - `$roomId`: 실제 실시간 밴픽 진행 방.
  - `join`: 리다이렉션 처리.

## Remix: 라우팅 및 데이터 액션

- **Data Action**: `/chat` 라우트는 Remix `action`을 통해 사용자의 메시지를 서버로 전송하고, `chatWithGemini` 서비스를 호출하여 응답을 받아옵니다.
- **Optimistic UI**: 서버 응답 전 유저 메시지를 미리 화면에 표시하고 로딩 상태를 보여주는 Optimistic UI 패턴을 구현합니다.
