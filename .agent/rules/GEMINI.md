# 엔강대 밴픽 사이트 가이드 (GEMINI.md)

해당 프로젝트는 젠레스 존 제로의 강습전 콘텐츠를 2명의 참가자와 1명의 호스트로 구성되어 참가자들의 점수를 가지고 경쟁하는 경기를 위한 사이트입니다.

이 문서는 프로젝트의 전체적인 규칙과 구조를 이해하기 위한 최상위 가이드입니다.

## 1. 핵심 규칙 (Core Rules)

경기의 전반적인 운영 및 밴픽 규칙에 대한 설명입니다.

- [게임 규칙 (Game Rule)](game-rule.md)
- [밴픽 규칙 (BanPick Rule)](banpick-rule.md)
- [캐릭터 및 엔진 코스트 설정](cost-schema.md)
- [캐릭터(에이전트) 정의](zzz-agent.md)
- [엔진(무기) 정의](zzz-engine.md)

## 2. 데이터 및 인프라

- [데이터베이스 스키마 및 테이블](database-schema.md): Supabase 기반 데이터 구조 설명

## 3. 패키지 가이드 (Packages)

프로젝트의 공유 로직과 공통 기능을 분리하여 관리하는 모노레포 패키지들입니다.

- [패키지 전체 개요](packages/overview.md)
- [공통 유틸리티 (Utils)](packages/utils.md)
- [Supabase 및 AI 연동](packages/supabase.md)
- [R2 스토리지 연동](packages/r2-storage.md)
- [Tailwind 스타일 설정](packages/tailwind-config.md)
- [공통 상수 및 타입 (Constant)](packages/constant.md)
- [UI 컴포넌트 라이브러리 (V2)](packages/components/v2.md)
- [디자인 시스템 - 카드](packages/design-system/card.md)
- [디자인 시스템 - 버튼](packages/design-system/button.md)

## 4. 애플리케이션 가이드 (Apps)

실제 사용자에게 제공되는 웹 서비스 라우트와 컴포넌트입니다.

- [WWW 앱 개요](apps/www/overview.md)
- [페이지 라우트 정의 (Routes)](apps/www/routes.md)
- [앱 컴포넌트 허브](apps/www/components/overview.md)
- [채팅 컴포넌트](apps/www/components/chat.md)
- [실시간 경기 컴포넌트](apps/www/components/realtime.md)
- [경기판 (Playground) 컴포넌트](apps/www/components/playground.md)
- [히스토리/통계 컴포넌트](apps/www/components/history.md)
- [헤더 컴포넌트](apps/www/components/header.md)

---
*이 문서는 Gemini 기반 에이전트들이 프로젝트를 이해하기 위한 루트 가이드로 사용됩니다.*
