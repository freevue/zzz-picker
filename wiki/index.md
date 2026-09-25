---
name: zzz-picker-wiki
description: zzz-picker의 게임 규칙, 메인 앱, 데이터 모델, 디자인 및 운영 지식을 빠르게 찾는 통합 인덱스입니다.
---

# zzz-picker 프로젝트 위키

이 위키는 저장소의 도메인·아키텍처 지식을 한곳에서 찾기 위한 컴파일된 문서 모음입니다. 현재 실행 동작은 소스 코드가, 운영 데이터는 Supabase가 기준입니다. 문서와 실제 동작이 다르면 차이를 확인해 문서를 갱신합니다.

## 빠른 탐색

| 작업 | 먼저 읽을 문서 |
| :--- | :--- |
| 프로젝트와 에이전트 작업 규칙 | [`AGENTS.md`](../AGENTS.md) |
| 게임 모드, 점수, 승패 | [경기 규칙](game-rules.md) |
| 밴픽, 캐릭터/엔진 역할, 코스트 | [밴픽 시스템](banpick-system.md) |
| DB 테이블과 관계 | [데이터베이스](database.md) |
| 앱 구조와 페이지 진입 | [시스템 아키텍처](architecture.md) |
| 화면·라우트 상세 | [`apps/renew`](apps/renew/overview.md) |
| UI 토큰과 컴포넌트 스타일 | [디자인 시스템 요약](design-system.md), [renew DESIGN.md](../apps/renew/DESIGN.md) |
| 등록·정리·이관 작업 | [운영 문서 허브](operations.md) |
| 공유 패키지 | [패키지 인덱스](packages/index.md) |

## 문서 카탈로그

| 영역 | 문서 | 포함 내용 |
| :--- | :--- | :--- |
| 경기 | [game-rules.md](game-rules.md) | 경기 모드, 라운드, 점수·시간·코스트 계산 |
| 밴픽 | [banpick-system.md](banpick-system.md) | 페이즈 진행, 에이전트/W-엔진 정의, 코스트 프리셋 |
| 데이터 | [database.md](database.md) | Supabase 스키마, 관계도, 슬롯 구조 |
| 앱 개요 | [architecture.md](architecture.md) | 모노레포에서 renew의 역할, 라우트 지도, 상태 흐름 |
| renew 앱 | [overview.md](apps/renew/overview.md) · [routes.md](apps/renew/routes.md) · [components.md](apps/renew/components.md) · [realtime.md](apps/renew/realtime.md) | 기술 스택, 화면, 컴포넌트, Realtime 이벤트 |
| 디자인 | [design-system.md](design-system.md) · [apps/renew/DESIGN.md](../apps/renew/DESIGN.md) | renew 테마와 UI 규격 |
| 패키지 | [인덱스](packages/index.md) · [Supabase](packages/supabase.md) · [R2 Storage](packages/r2-storage.md) · [ZPDS](packages/zpds.md) | 공유 패키지의 역할과 사용 규칙 |
| 운영 | [operations.md](operations.md) | 등록, 무결성, R2, 알림, 마이그레이션 문서 허브 |

## 작업별 읽기 순서

- 경기 로직: [game-rules.md](game-rules.md) → [banpick-system.md](banpick-system.md) → 필요한 구현은 `apps/renew/app`에서 확인합니다.
- 화면 작업: [apps/renew/overview.md](apps/renew/overview.md) → [apps/renew/routes.md](apps/renew/routes.md) 또는 [apps/renew/components.md](apps/renew/components.md) → [apps/renew/DESIGN.md](../apps/renew/DESIGN.md).
- Realtime 작업: [apps/renew/realtime.md](apps/renew/realtime.md) → [packages/supabase.md](packages/supabase.md) → `apps/renew/app/provider`와 `apps/renew/app/hooks`를 확인합니다.
- DB 작업: [database.md](database.md) → 관련 [운영 문서](operations.md) → 실제 쿼리와 현재 스키마를 확인합니다.
- 로스터 운영: [operations.md](operations.md) → 해당 등록 상세 문서 → 필요한 `.agent/skills/*/SKILL.md` 실행 절차.

## 문서 관리 원칙

- 공용 프로젝트 지침은 [`AGENTS.md`](../AGENTS.md), 컴파일된 프로젝트 지식은 이 `wiki/`가 관리합니다.
- `.agent/rules/GEMINI.md`와 `.cursor/rules/`는 도구가 공용 문서를 자동으로 찾도록 돕는 진입점입니다. 본문 규칙을 복사해 두지 않습니다.
- `.agent/skills/`와 `.cursor/skills/`는 외부 시스템에 읽기/쓰기 작업을 수행하는 절차 문서입니다. 지식 문서와 분리해 유지합니다.
