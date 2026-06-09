---
name: app-www-components-hub
description: 어플리케이션 전용 비즈니스 로직이 포함된 UI 컴포넌트들을 모아둔 허브 가이드입니다.
trigger: model_decision
---


# Components Hub GUIDE

## Purpose

- 어플리케이션 전용 비즈니스 로직이 포함된 UI 컴포넌트들을 모아둔 허브 폴더입니다.

## Directories (Components)

- **[Chat](./chat.md)**: 실시간 AI 채팅 관련 컴포넌트.
- **[Realtime](./realtime.md)**: 실시간 방 생성 및 관리 컴포넌트.
- **[Playground](./playground.md)**: 메인 경기 시뮬레이션 판.
- **[History](./history.md)**: 게임 통계 및 히스토리 컴포넌트.
- **[Header](./header.md)**: 글로벌 레이아웃 헤더.

## React: 구조적 설계

- **배럴링 (Barreling)**: `index.ts`를 통해 모든 주요 컴포넌트들을 통합하여 외부에서 쉽게 참조할 수 있도록 합니다.
- **기초 UI Kit 활용**: `@zzz-picker/components/v2`의 기초 UI를 활용하여 비즈니스 컴포넌트를 구성합니다.
