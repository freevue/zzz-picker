---
triger: model_decision
tags: [component, chat, gemini]
aliases: [chat-components]
---

# Chat GUIDE

## Purpose

- 어플리케이션의 실시간 채팅(Gemini) 인터페이스를 구성하는 컴포넌트 모음입니다.

## 주요 컴포넌트

- **ChatHeader**: 채팅창의 헤더 정보 표시.
- **EmptyState**: 첫 진입 시 환영 메시지 및 이미지 표시.
- **MessageItem**: 유저와 모델의 개별 메시지, 아바타, 말풍선 렌더링.
- **ChatInput**: 메시지 입력 폼 및 전송 버튼.

## React: 컴포넌트 및 애니메이션

- **SRP (Single Responsibility Principle)**: UI 요소들을 독립된 컴포넌트로 분리하여 가독성과 재사용성을 높였습니다.
- **애니메이션**: `motion/react`를 사용하여 각 메시지 등장 시 슬라이딩 및 페이드인 효과를 적용합니다.
