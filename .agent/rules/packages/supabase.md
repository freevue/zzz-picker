---
triger: model_decision
tags: [package, supabase, ai]
aliases: [supabase-client, gemini-service]
---

# Supabase GUIDE

## Purpose

- Supabase 클라이언트 설정 및 AI(Gemini) 모델 연동 로직을 담당합니다.

## Files (Original)

- `agent.ts`
- `ai-client.ts`
- `index.ts`
- `schema.ts`

## Exports

- **supabase**: Supabase 클라이언트 인스턴스
- **chatWithGemini**: Gemini AI와 대화하는 비동기 함수

## Dependencies

### External

- [@supabase/supabase-js](https://supabase.com/docs/reference/javascript/introduction)
- [@google/generative-ai](https://ai.google.dev/gemini-api/docs/quickstart)

## Supabase: 클라이언트 및 AI 정책

- **Singleton Client**: `supabase` 인스턴스는 어플리케이션 전반에서 단일 인스턴스로 관리됩니다.
- **AI Integration**: Gemini API를 Supabase Edge Functions 또는 직접 호출 방식으로 연동하여 실시간 데이터 기반의 답변을 생성합니다.

## Example

```typescript
import { chatWithGemini } from '@zzz-picker/supabase'

const response = await chatWithGemini(history)
```
