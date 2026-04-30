---
triger: model_decision
tags: [monorepo, workspace, architecture]
aliases: [packages-overview]
---

# Packages Overview GUIDE

## Purpose

- 프로젝트의 공유 로직과 공통 기능을 분리하여 관리하는 모노레포 패키지들을 관리합니다.

## Directories (Packages)

- **[components](./components/v2.md)**: 공통 UI 컴포넌트 라이브러리 (V2).
- **[constant](./constant.md)**: 공통 상수 및 타입 정의.
- **[provider](../../packages/provider/src/GUIDE.md)**: 전역 상태 관리 및 소켓 통신 공급자. (현재 rules 미이동)
- **[supabase](./supabase.md)**: 데이터베이스 클라이언트 및 AI 연동 로직.
- **[utils](./utils.md)**: 범용 유틸리티 및 게임 핵심 로직.
- **[r2-storage](./r2-storage.md)**: Cloudflare R2 파일 저장소 연동.
- **[tailwind-config](./tailwind-config.md)**: 디자인 토큰 및 스타일 설정.

## Architecture: 모노레포 관리 정책

- **Separation of Concerns**: 각 패키지는 고유의 목적(UI, 상태, 통신, 유틸 등)에 따라 엄격히 분리되어야 합니다.
- **Inter-package Dependencies**: 패키지 간의 의존성은 최대한 최소화하며, 참조가 필요한 경우 각 패키지의 가이드를 통해 의존성을 명확히 파악해야 합니다.
- **Named Exports**: 모든 패키지는 트리쉐이킹 효율을 위해 `named export` 방식을 따릅니다.

## Example

```typescript
// 개별 패키지 사용 예시
import { Typo } from '@zzz-picker/components/v2'
import { Leagues } from '@zzz-picker/constant'
import { useStore } from '@zzz-picker/provider'
```
