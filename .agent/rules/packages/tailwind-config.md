---
name: tailwind-config
description: 프로젝트 전체에서 공통으로 사용되는 디자인 토큰과 글로벌 CSS 스타일을 정의합니다.
trigger: model_decision
---


# Tailwind Config GUIDE

## Purpose

- 프로젝트 전체에서 공통으로 사용되는 디자인 토큰(컬러, 폰트, 간격)과 글로벌 CSS 스타일을 정의합니다.

## Files (Original)

- `base.css`
- `theme.css`
- `fonts.css`
- `index.css`

## Exports

- **index.css**: 모든 스타일 시트를 통합한 메인 엔트리.
- **theme.css**: 프로젝트 고유의 컬러 패드(Ink, Base, Primary 등)와 테마 변수 정의.
- **fonts.css**: 로컬 및 구글 폰트 설정.

## React: 스타일 적용 방식

- **Global Inject**: 어플리케이션의 최상단(`root.tsx`)에서 임포트되어 전체 페이지에 스타일을 적용합니다.
- **CSS Variables**: `theme.css`에 정의된 CSS 변수를 Tailwind 설정이나 직접 CSS에서 참조하여 일관된 디자인 시스템을 유지합니다.

## Example

```css
/* theme.css 예시 */
:root {
  --color-primary: #ffd200;
  --color-ink: #111111;
}
```
