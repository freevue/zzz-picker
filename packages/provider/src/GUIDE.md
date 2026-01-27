---
triger: model_decision
tags: [package, state, react-context, socket]
aliases: [provider-package, store-context]
---

# Provider GUIDE

## Purpose

- 어플리케이션의 전역 상태 관리(Store, Setting, Play) 및 실시간 소켓 통신(Socket)을 위한 React Context Provider와 커스텀 훅을 제공합니다.

## Files

- [Store.tsx](./Store.tsx)
- [Setting.tsx](./Setting.tsx)
- [Play.tsx](./Play.tsx)
- [Socket.tsx](./Socket.tsx)
- [hooks/index.ts](./hooks/index.ts)
- [index.ts](./index.ts)

## Exports

- **Store**: 캐릭터(Agents), 무기(Engines) 데이터 등 서버에서 받아온 기초 데이터를 제공하는 Context.
- **Setting**: 리그 설정, 코스트 비율, 상태 정보 등을 관리하는 Context.
- **Play**: 현재 진행 중인 게임의 픽 데이터, 코스트 데이터 등을 관리하는 Context.
- **Socket**: 실시간 밴픽 통신을 위한 채널 관리 Context.
- **useStore / useSetting / usePlay / useSocket**: 각 Context에 접근하기 위한 커스텀 훅.

## Dependencies

### Internal

- [constant](../../constant/src/GUIDE.md)
- [utils](../../utils/src/GUIDE.md)

### External

- [@fxts/core](https://fxts.dev/)
- [react](https://react.dev)
- [supabase](https://supabase.com/docs/reference/javascript/introduction)

## React: 컨텍스트 및 훅 전략

- **Context Split**: 불필요한 리렌더링을 방지하기 위해 도메인별로 Context를 분리하여 관리합니다.
- **Custom Hooks**: Context에 직접 접근하는 대신 전용 훅을 사용하여 데이터 가공 로직(코스트 계산, 히스토리 가공 등)을 캡슐화합니다.

## Example

```tsx
import { Store, Setting, Play } from '@zzz-picker/provider'

const App = ({ children }) => (
  <Store>
    <Setting>
      <Play>{children}</Play>
    </Setting>
  </Store>
)
```
