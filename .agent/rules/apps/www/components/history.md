---
name: app-www-components-history
description: 플레이어의 과거 경기 데이터를 시각화하고 통계를 제공하는 History 컴포넌트들에 대한 정의입니다.
trigger: model_decision
---


# History GUIDE

## Purpose

- 플레이어의 과거 경기 데이터(픽률, 밴율, 승률, 점수 등)를 시각화하고 통계를 제공하는 대시보드 성격의 컴포넌트 모음입니다.

## 주요 컴포넌트

- **BestMatch**: 가장 성능이 좋았던 조합 정보를 시각화.
- **BestPick / BestBan / BestBoss**: 랭킹 표시 컴포넌트.
- **TotalScore**: 누적 점수 표시.
- **AppleSection**: Apple-style 테마가 적용된 섹션 구성요소.

## React: 통계 시각화

- **Data Driven**: 외부 데이터 히스토리를 기반으로 맵핑 및 집계를 수행하여 동적으로 리스트를 생성합니다.
- **Modular Components**: 각 통계 항목이 독립된 파일로 분리되어 유연하게 조합할 수 있습니다.
