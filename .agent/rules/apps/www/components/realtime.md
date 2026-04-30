---
triger: model_decision
tags: [component, realtime, multiplayer]
aliases: [realtime-components]
---

# Realtime GUIDE

## Purpose

- 실시간 밴픽 경기를 위한 방(Room) 생성 및 참여 정보 관리를 담당하는 컴포넌트 모음입니다.

## 주요 컴포넌트

- **CreateRoomForm**: 리그(정식/레전드/언리미티드) 선택 및 플레이어 닉네임 입력 방 생성 폼.
- **RoomInfo**: 생성된 방의 접속 링크 표시, 클립보드 복사, 초기화 기능 제공.

## React: 상태 및 애니메이션

- **상태 관리**: `useState`를 사용하여 리그 선택 및 사용자 닉네임 상태를 로컬에서 관리합니다.
- **애니메이션**: `motion/react`의 `AnimatePresence`를 사용하여 폼과 정보 사이의 전환 시 부드러운 페이드 효과를 적용합니다.
