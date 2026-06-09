---
name: app-www-overview
description: 어플리케이션의 엔트리 포인트이며 전체 페이지에 공통으로 적용되는 레이아웃을 정의합니다.
trigger: model_decision
---


# App Source GUIDE

## Purpose

- 어플리케이션의 엔트리 포인트이며 전체 페이지에 공통으로 적용되는 레이아웃(HTML 구조, 메타 태그, 글로벌 스타일, 전역 상태)을 정의합니다.

## Files (Original)

- `root.tsx`
- `routes/`

## Exports

- **Router (Default)**: HTML 기초 구조(`html`, `head`, `body`)와 전역 `Store` 프로바이더를 포함하는 메인 레이아웃 컴포넌트.
- **meta**: SEO 및 소셜 공유를 위한 메타 데이터 정의.
- **links**: 글로벌 CSS 및 파비콘 링크 정의.

## Remix: 엔트리 구조

- **Top-level Provider**: `Store` 컨텍스트가 `Outlet`을 감싸고 있어 하위 모든 라우트에서 캐릭터 및 엔진 데이터에 접근할 수 있습니다.
- **Global Scripts**: Google Analytics(GTAG)와 Remix 스크립트가 포함되어 클라이언트 사이드 동작을 지원합니다.
