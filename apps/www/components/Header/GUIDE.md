---
triger: model_decision
tags: [component, layout, navigation]
aliases: [header-component, global-menu]
---

# Header GUIDE

## Purpose

- 어플리케이션의 상단 네비게이션과 유틸리티 메뉴(정보, 설정, 외부 링크)를 제공합니다.

## Files

- [Information.tsx](./Information.tsx)
- [Setting/index.tsx](./Setting/index.tsx)
- [index.tsx](./index.tsx)

## Exports

- **Header (Default)**: 뒤로가기, 커뮤니티 링크(유튜브, 치지직), 정보/설정 팝업 버튼을 포함하는 레이아웃 헤더 컴포넌트.

## Dependencies

### Internal

- [v2](../../../../packages/components/src/v2/GUIDE.md)

### External

- [react](https://react.dev)

## Example

```tsx
import Header from '~/components/Header'

const Layout = ({ children }) => (
  <>
    <Header />
    <main>{children}</main>
  </>
)
```
