---
triger: model_decision
tags: [app, remix, entry-point, root]
aliases: [app-source, main-entry]
---

# App Source GUIDE

## Purpose

- 어플리케이션의 엔트리 포인트이며 전체 페이지에 공통으로 적용되는 레이아웃(HTML 구조, 메타 태그, 글로벌 스타일, 전역 상태)을 정의합니다.

## Files

- [root.tsx](./root.tsx)
- [routes/GUIDE.md](./routes/GUIDE.md)

## Exports

- **Router (Default)**: HTML 기초 구조(`html`, `head`, `body`)와 전역 `Store` 프로바이더를 포함하는 메인 레이아웃 컴포넌트.
- **meta**: SEO 및 소셜 공유를 위한 메타 데이터 정의.
- **links**: 글로벌 CSS 및 파비콘 링크 정의.

## Dependencies

### Internal

- [routes/GUIDE.md](./routes/GUIDE.md)
- [provider](../../../packages/provider/src/GUIDE.md)

### External

- [@remix-run/react](https://remix.run/docs/en/main/file-conventions/entry.client)

## Remix: 엔트리 구조

- **Top-level Provider**: `Store` 컨텍스트가 `Outlet`을 감싸고 있어 하위 모든 라우트에서 캐릭터 및 엔진 데이터에 접근할 수 있습니다.
- **Global Scripts**: Google Analytics(GTAG)와 Remix 스크립트가 포함되어 클라이언트 사이드 동작을 지원합니다.

## Example

```tsx
// root.tsx는 Remix의 엔트리 파일로 시스템에 의해 자동으로 로드됩니다.
```
