---
name: app-www-components-header
description: 어플리케이션의 상단 네비게이션과 유틸리티 메뉴를 제공하는 Header 컴포넌트에 대한 정의입니다.
trigger: model_decision
---


# Header GUIDE

## Purpose

- 어플리케이션의 상단 네비게이션과 유틸리티 메뉴(정보, 설정, 외부 링크)를 제공합니다.

## 주요 구성 요소

- **Header (Main)**: 뒤로가기, 커뮤니티 링크(유튜브, 치지직) 포함.
- **Information**: 게임 정보 안내 팝업.
- **Setting**: 환경 설정 팝업.

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
