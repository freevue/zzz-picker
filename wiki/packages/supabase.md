---
name: supabase-package
description: Supabase 클라이언트 단일 인스턴스 설정 및 AI 데이터베이스 연동 도구를 제공합니다.
---

# Supabase 패키지 가이드 (`@zzz-picker/supabase`)

`packages/supabase`는 Supabase 클라이언트와 데이터베이스 연동 인스턴스를 관리하며, `@zzz-picker/renew`가 직접 의존하는 핵심 워크스페이스 패키지입니다.

---

## 1. 목적 (Purpose)

- **Singleton Client**: 어플리케이션 전반에서 재사용할 단일 `supabase` 클라이언트 인스턴스 생성 및 노출.
- **Realtime Channel Type**: 실시간 통신에 사용되는 `RealtimeChannel` 타입 export.
- **AI 도구 및 유틸리티**: Gemini 에이전트 연동 함수 및 DB 조회 툴셋 제공.

---

## 2. 파일 구성 및 주요 Exports

```text
packages/supabase/src/
├── index.ts        # 메인 진입점 (supabase 클라이언트 및 agent export)
├── agent.ts        # Gemini AI 채팅 연동 함수 (chatWithGemini)
├── ai-client.ts    # AI 데이터베이스 도구 (AiDatabaseTools)
└── schema.ts       # DB 스키마 메타데이터
```

### Exports
- **`supabase`**: `createClient(SUPABASE_URL, SUPABASE_ANON_KEY)`로 초기화된 Supabase 클라이언트 단일 인스턴스.
- **`RealtimeChannel`**: Supabase JS의 실시간 채널 인터페이스 타입.
- **`chatWithGemini`**: Gemini API를 호출하여 데이터 기반 대화를 수행하는 함수.
- **`AiDatabaseTools`**: AI 에이전트가 동적 DB 쿼리를 수행할 수 있는 툴셋(`getSchema`, `executeQuery`).

---

## 3. 사용 예시

```typescript
import { supabase, type RealtimeChannel } from '@zzz-picker/supabase'

// DB 쿼리 수행
const { data, error } = await supabase.from('agent').select('*')

// 실시간 브로드캐스트 채널 구독
const channel: RealtimeChannel = supabase.channel(`room:${roomId}`)
```
