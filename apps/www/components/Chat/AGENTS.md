---
triger: model_decision
tags: [component, chat, gemini]
aliases: [chat-components]
---

# Chat GUIDE

## Purpose

- 어플리케이션의 실시간 채팅(Gemini) 인터페이스를 구성하는 컴포넌트 모음입니다.

## Files

- [ChatHeader.tsx](./ChatHeader.tsx)
- [EmptyState.tsx](./EmptyState.tsx)
- [MessageItem.tsx](./MessageItem.tsx)
- [ChatInput.tsx](./ChatInput.tsx)
- [index.ts](./index.ts)

## Exports

- **ChatHeader**: 채팅창의 헤더 정보를 표시합니다.
- **EmptyState**: 첫 진입 시 환영 메시지와 이미지를 표시합니다.
- **MessageItem**: 유저와 모델의 개별 메시지 아바타, 말풍선을 렌더링합니다.
- **ChatInput**: 메시지 입력을 위한 폼과 전송 버튼을 포함합니다.

## Dependencies

### Internal

- [v2](../../../../packages/components/src/v2/GUIDE.md)

### External

- [motion/react](https://motion.dev/docs/react-quick-start)
- [@fxts/core](https://fxts.dev/)

## React: 컴포넌트 및 애니메이션

- **SRP (Single Responsibility Principle)**: UI 요소들을 독립된 컴포넌트로 분리하여 가독성과 재사용성을 높였습니다.
- **애니메이션**: `motion/react`를 사용하여 각 메시지 등장 시 슬라이딩 및 페이드인 효과를 적용합니다.

## Example

```tsx
import { ChatHeader, MessageItem, ChatInput } from '~/components/Chat';

const ChatPage = () => {
    return (
        <div>
            <ChatHeader />
            <MessageItem role="user" text="안녕" idx={0} />
            <ChatInput ... />
        </div>
    )
}
```
