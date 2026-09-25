---
name: renew-overview
description: zzz-picker의 최신 메인 서비스 애플리케이션인 @zzz-picker/renew의 아키텍처 및 전반적인 구조를 설명합니다.
trigger: model_decision
---

# Renew App Overview

`@zzz-picker/renew`(`apps/renew`)는 zzz-picker의 최신 단일 진실 공급원(SSOT)이자 실제 경기가 진행되는 메인 웹 애플리케이션입니다.
젠레스 존 제로(Zenless Zone Zero)의 강습전 콘텐츠를 2명의 선수(A, B)와 1명의 호스트(H)가 참가하여 실시간으로 밴픽 및 파티 구성을 진행하고 승패를 가리는 환경을 제공합니다.

## 기술 스택

| 분류 | 기술 | 버전 및 용도 |
| :--- | :--- | :--- |
| **Framework** | Remix (Vite 기반) | `^2.17.5`, 풀스택 SSR/SPA 라우팅 및 번들링 |
| **Styling** | Tailwind CSS v4 | `@tailwindcss/vite`, `^4.1.14`, 독립 테마 및 고성능 스타일링 |
| **State & Context** | React Context & Hooks | React 19, `StoreContext`, `MatchContext`, `useCost`, `useMatch` |
| **Backend & DB** | Supabase Client | `@zzz-picker/supabase` 연동, PostgreSQL 및 Realtime Channel 브로드캐스트 |
| **Functional Utils** | `@fxts/core` | `^1.23.0`, 함수형 파이프라인(`pipe`, `map`, `filter`, `sum` 등) |
| **Icons & UI** | `lucide-react`, `cva` | UI 컴포넌트 변형 및 아이콘 세트 |

## 디렉토리 구조

```text
apps/renew/
├── app/
│   ├── components/       # 핵심 UI 및 도메인 비즈니스 컴포넌트
│   │   ├── PlayGround/   # 참가자(A/B) 밴픽 및 파티 구성 메인 뷰
│   │   ├── HostDashboard/# 호스트(H) 실시간 관전 및 결산 제어 대시보드
│   │   ├── CreateRoom/   # 룸 개설 모달 및 리그 선택
│   │   ├── CostDashboard/# 코스트 세부 대시보드
│   │   ├── Calc/         # 점수 및 보너스 계산기 컴포넌트
│   │   └── ui/           # 기초 UI 프리미티브 컴포넌트
│   ├── constant.ts       # 매치 타입, 역할, 페이즈, 이벤트 등 핵심 상수
│   ├── hooks/            # useCost, useMatch, useStore 등 전역 훅
│   ├── lib/              # Supabase DB 쿼리(DB/) 및 점수/코스트 유틸(utils.ts)
│   ├── provider/         # Store(마스터 데이터) 및 Match(실시간 상태) Provider
│   ├── routes/           # Remix 파일 기반 라우트 (_index, $roomId 등)
│   ├── type/             # Match, Player, Agent, Engine, Boss 타입 선언
│   ├── index.css         # 글로벌 CSS 및 V2 테크니컬 다크 테마 변수
│   └── root.tsx          # 애플리케이션 루트 및 마운트 진입점
├── DESIGN.md             # renew 전용 디자인 시스템 및 명세서
└── package.json          # 의존성 및 스크립트 (dev: remix vite:dev)
```

## 모노레포 내 역할 및 의존성 원칙

- **완결된 단일 서비스 구조**: 구버전처럼 다수의 분산 패키지(`@zzz-picker/components`, `@zzz-picker/provider`, `@zzz-picker/utils` 등)에 의존하지 않고, 필요한 도메인 로직과 상태, 스타일을 앱 내부에 자체 완결적으로 보유합니다.
- **유일한 워크스페이스 의존성**: Supabase 클라이언트 단일 인스턴스를 공유하기 위해 `@zzz-picker/supabase`만 워크스페이스 의존성(`workspace:*`)으로 참조합니다.

## 하위 가이드 링크

| Rule | Description |
| :--- | :--- |
| [라우트 명세 (Routes)](./routes.md) | 애플리케이션 라우트 구성 및 각 페이지 역할 |
| [컴포넌트 명세 (Components)](./components.md) | PlayGround, HostDashboard 등 주요 컴포넌트 아키텍처 |
| [실시간 통신 (Realtime)](./realtime.md) | Supabase Realtime 브로드캐스트 이벤트 및 페이즈 상태 머신 |
