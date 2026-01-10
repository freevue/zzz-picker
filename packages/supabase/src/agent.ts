import { AiDatabaseTools } from './ai-client'
import { DB_SCHEMA } from './schema'
import { GoogleGenAI } from '@google/genai'

// ============================================================================
// 상수 정의
// ============================================================================

/**
 * Gemini 모델 상수 정의
 */
const MODELS = {
  INTELLIGENT: 'gemini-3-flash-preview',
  BALANCED: 'gemini-2.5-flash',
  FAST: 'gemini-2.5-flash-lite',
} as const

/**
 * 보안을 위한 허용된 테이블 목록 (Whitelist)
 */
const ALLOWED_TABLES = [
  'agents',
  'match_log',
  'ban_log',
  'play_log',
  'round_log',
  'party_log',
  'agent_select_log', // 파티 로그의 상세 에이전트+엔진 선택 정보
  'deadly_assault',
  'boss',
  'engines',
  'attributes',
  'faction',
  'specialty',
  'boss_weakness_attribute',
  'boss_resistance_attribute',
]

// ============================================================================
// Gemini 클라이언트 초기화
// ============================================================================

let client: GoogleGenAI | null = null

const getClient = () => {
  if (client) return client

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY 또는 GOOGLE_API_KEY 환경 변수가 설정되지 않았습니다.')
  }
  client = new GoogleGenAI({ apiKey })
  return client
}

// ============================================================================
// 파이프라인 컨텍스트 타입
// ============================================================================

interface QueryPlan {
  table: string
  select?: string
  match?: Record<string, any>
  order?: { column: string; ascending?: boolean }
  limit?: number
}

interface PipelineContext {
  // 입력
  userMessage: string

  // Step 1: 질문 분석 결과
  questionAnalysis?: {
    intent: string
    entities: string[]
    requiresAggregation: boolean
  }

  // Step 2: 관련 스키마 정보
  relevantSchema?: typeof DB_SCHEMA

  // Step 3: 쿼리 계획
  queryPlan?: QueryPlan[]

  // Step 4: DB 조회 결과
  queryResults?: any[]

  // Step 5: 정제된 데이터
  refinedData?: string

  // Step 6: 생성된 응답
  response?: string

  // 에러 처리
  error?: string
}

// ============================================================================
// 공통 유틸리티 함수
// ============================================================================

/**
 * 재사용 가능한 Gemini API 호출 함수
 */
const callGemini = async (
  model: keyof typeof MODELS,
  systemInstruction: string,
  userContent: string,
  options?: { tools?: any[] }
): Promise<{ text?: string; functionCalls?: any[]; error?: string }> => {
  try {
    const geminiClient = getClient()

    const config: any = {
      maxOutputTokens: 2048,
      systemInstruction,
    }

    if (options?.tools) {
      config.tools = options.tools
    }

    const response = await geminiClient.models.generateContent({
      model: MODELS[model],
      contents: [{ role: 'user', parts: [{ text: userContent }] }],
      config,
    })

    const responseData = (response as any).response || response
    const parts = responseData.candidates?.[0]?.content?.parts || []

    const textPart = parts.find((p: any) => p.text)
    const functionCallParts = parts.filter((p: any) => p.functionCall)

    return {
      text: textPart?.text,
      functionCalls: functionCallParts.length > 0 ? functionCallParts : undefined,
    }
  } catch (error: any) {
    if (error.status === 429 || error.message?.includes('RESOURCE_EXHAUSTED')) {
      return { error: '토큰 제한에 도달했습니다. 잠시 후 다시 시도해주세요.' }
    }
    return { error: `API 오류: ${error.message}` }
  }
}

// ============================================================================
// 파이프라인 단계 함수들
// ============================================================================

/**
 * Step 1: 질문 분석
 * 사용자 질문의 의도와 핵심 엔티티를 추출합니다.
 */
const analyzeQuestion = async (ctx: PipelineContext): Promise<PipelineContext> => {
  if (ctx.error) return ctx

  const systemInstruction = `
사용자의 질문을 분석하여 JSON 형식으로 응답하십시오.
반드시 아래 형식만 출력하고, 다른 텍스트는 포함하지 마십시오.

{
  "intent": "질문의 핵심 의도 (예: 조회, 비교, 통계, 순위 등)",
  "entities": ["관련된 주요 키워드들"],
  "requiresAggregation": true/false (집계/연산이 필요한지 여부)
}
`

  const result = await callGemini('FAST', systemInstruction, ctx.userMessage)

  if (result.error) {
    return { ...ctx, error: result.error }
  }

  try {
    // JSON 파싱 시도
    const jsonMatch = result.text?.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0])
      return { ...ctx, questionAnalysis: analysis }
    }
  } catch {
    // 파싱 실패 시 기본값 사용
  }

  return {
    ...ctx,
    questionAnalysis: {
      intent: '조회',
      entities: [],
      requiresAggregation: false,
    },
  }
}

/**
 * Step 2: 스키마 분석
 * 질문과 관련된 DB 스키마 정보를 추출합니다.
 */
const analyzeSchema = async (ctx: PipelineContext): Promise<PipelineContext> => {
  if (ctx.error) return ctx

  // DB_SCHEMA를 그대로 사용 (이미 정의된 스키마 정보 활용)
  return { ...ctx, relevantSchema: DB_SCHEMA }
}

/**
 * Step 3: 쿼리 계획 수립
 * 질문과 스키마를 바탕으로 실행할 쿼리를 계획합니다.
 */
const planQuery = async (ctx: PipelineContext): Promise<PipelineContext> => {
  if (ctx.error) return ctx

  const schemaInfo = JSON.stringify(ctx.relevantSchema, null, 2)
  const analysisInfo = JSON.stringify(ctx.questionAnalysis, null, 2)

  const systemInstruction = `
당신은 ZZZ(Zenless Zone Zero) 데이터베이스 쿼리 플래너입니다.
사용자의 질문 분석 결과와 DB 스키마를 바탕으로, 필요한 쿼리 계획을 JSON 배열로 출력하십시오.

[사용 가능한 테이블]
${ALLOWED_TABLES.join(', ')}

[DB 스키마]
${schemaInfo}

[질문 분석 결과]
${analysisInfo}

[출력 형식]
반드시 아래 JSON 배열 형식만 출력하고, 다른 텍스트는 포함하지 마십시오.
[
  {
    "table": "테이블명",
    "select": "조회할 컬럼들 (쉼표 구분, 기본값 *)",
    "match": { "조건키": "조건값" },
    "order": { "column": "정렬컬럼", "ascending": false },
    "limit": 10
  }
]

필요한 모든 데이터를 가져올 수 있도록 쿼리를 계획하십시오.
집계가 필요한 경우, 관련 데이터를 모두 가져온 후 후처리하도록 계획하십시오.
`

  const userContent = `사용자 질문: ${ctx.userMessage}`
  const result = await callGemini('INTELLIGENT', systemInstruction, userContent)

  if (result.error) {
    return { ...ctx, error: result.error }
  }

  try {
    const jsonMatch = result.text?.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      const plan = JSON.parse(jsonMatch[0]) as QueryPlan[]
      // 허용된 테이블만 필터링
      const validPlan = plan.filter((q) => ALLOWED_TABLES.includes(q.table))
      return { ...ctx, queryPlan: validPlan }
    }
  } catch {
    // 파싱 실패
  }

  return { ...ctx, queryPlan: [] }
}

/**
 * Step 4: 쿼리 실행
 * 계획된 쿼리를 실제 DB에서 실행합니다.
 */
const executeQuery = async (ctx: PipelineContext): Promise<PipelineContext> => {
  if (ctx.error) return ctx
  if (!ctx.queryPlan || ctx.queryPlan.length === 0) {
    return { ...ctx, queryResults: [] }
  }

  const results: any[] = []

  for (const query of ctx.queryPlan) {
    try {
      const result = await AiDatabaseTools.executeQuery(query.table, {
        select: query.select || '*',
        match: query.match,
        order: query.order,
        limit: query.limit,
      })
      results.push({
        table: query.table,
        data: result,
      })
    } catch (error: any) {
      results.push({
        table: query.table,
        error: error.message,
      })
    }
  }

  return { ...ctx, queryResults: results }
}

/**
 * Step 5: 데이터 정제
 * 조회된 데이터를 질문의 맥락에 맞게 정제합니다.
 */
const refineData = async (ctx: PipelineContext): Promise<PipelineContext> => {
  if (ctx.error) return ctx
  if (!ctx.queryResults || ctx.queryResults.length === 0) {
    return { ...ctx, refinedData: '조회된 데이터가 없습니다.' }
  }

  const dataStr = JSON.stringify(ctx.queryResults, null, 2)
  const analysisInfo = JSON.stringify(ctx.questionAnalysis, null, 2)

  const systemInstruction = `
당신은 데이터 분석 전문가입니다.
사용자의 질문 의도와 조회된 원본 데이터를 바탕으로, 질문에 답하기 위해 필요한 핵심 정보만 추출/정제하십시오.

[질문 분석]
${analysisInfo}

[규칙]
1. 집계가 필요하면 (예: 가장 많이 선택된, 평균, 합계 등) 직접 계산하여 결과를 제시하십시오.
2. 순위가 필요하면 정렬하여 상위 항목을 추출하십시오.
3. 불필요한 데이터는 제거하고 핵심만 남기십시오.
4. 결과는 간결한 텍스트 또는 정리된 목록으로 출력하십시오.
5. 데이터가 없으면 "데이터 없음"이라고 명시하십시오.
`

  const userContent = `
[원래 질문]
${ctx.userMessage}

[조회된 원본 데이터]
${dataStr}

위 데이터를 분석하여 질문에 답하기 위한 핵심 정보를 추출해주세요.
`

  const result = await callGemini('BALANCED', systemInstruction, userContent)

  if (result.error) {
    return { ...ctx, error: result.error }
  }

  return { ...ctx, refinedData: result.text || '데이터 정제 실패' }
}

/**
 * Step 6: 응답 생성
 * 정제된 데이터를 사용자 친화적인 답변으로 변환합니다.
 */
const generateResponse = async (ctx: PipelineContext): Promise<PipelineContext> => {
  if (ctx.error) return ctx

  const systemInstruction = `
당신은 ZZZ(Zenless Zone Zero) 게임 데이터 전문 어시스턴트입니다.
사용자의 질문에 대해 정제된 데이터를 바탕으로 친절하고 명확하게 답변하십시오.

[규칙]
1. 사실에 기반한 답변만 하십시오. 데이터에 없는 내용은 지어내지 마십시오.
2. 답변은 한국어로 자연스럽게 작성하십시오.
3. 필요시 목록이나 표 형식을 활용하십시오.
4. 데이터가 없다면 솔직하게 "해당 데이터를 찾을 수 없습니다"라고 답변하십시오.
5. 간결하되, 질문에 충분히 답변하십시오.
`

  const userContent = `
[사용자 질문]
${ctx.userMessage}

[분석된 데이터]
${ctx.refinedData}

위 데이터를 바탕으로 사용자에게 답변해주세요.
`

  const result = await callGemini('BALANCED', systemInstruction, userContent)

  if (result.error) {
    return { ...ctx, error: result.error }
  }

  return { ...ctx, response: result.text || '' }
}

/**
 * Step 7: 출력
 * 최종 응답을 반환합니다.
 */
const output = (ctx: PipelineContext): string => {
  if (ctx.error) {
    return `오류가 발생했습니다: ${ctx.error}`
  }
  return ctx.response || '응답을 생성할 수 없습니다.'
}

// ============================================================================
// 메인 파이프라인 함수
// ============================================================================

/**
 * 파이프라인 실행 헬퍼
 */
const pipe = async <T>(initial: T, ...fns: ((arg: T) => T | Promise<T>)[]): Promise<T> => {
  let result = initial
  for (const fn of fns) {
    result = await fn(result)
  }
  return result
}

/**
 * Gemini와 대화하는 메인 함수
 * 7단계 파이프라인을 통해 질문을 처리합니다.
 */
export const chatWithGemini = async (messages: any[]): Promise<string> => {
  // 마지막 메시지에서 텍스트 추출
  const lastMessage = messages[messages.length - 1]
  const userText = lastMessage?.parts?.[0]?.text || lastMessage?.text || ''

  if (!userText.trim()) {
    return '질문을 입력해주세요.'
  }

  // 파이프라인 컨텍스트 초기화
  const initialContext: PipelineContext = {
    userMessage: userText,
  }

  // 7단계 파이프라인 실행
  const finalContext = await pipe(
    initialContext,
    analyzeQuestion,
    analyzeSchema,
    planQuery,
    executeQuery,
    refineData,
    generateResponse
  )

  // 최종 출력
  return output(finalContext)
}

// Legacy export 유지 (기존 코드 호환성)
export const GeminiSupabaseTools = {
  get_database_schema: {
    description: 'Supabase 데이터베이스의 테이블 구조 및 컬럼 지도를 반환합니다.',
    parameters: { type: 'object', properties: {} },
    execute: AiDatabaseTools.getSchema,
  },
  query_database: {
    description: '특정 테이블에서 조건에 맞는 데이터를 조회합니다.',
    parameters: {
      type: 'object',
      properties: {
        table: { type: 'string' },
        select: { type: 'string' },
        match: { type: 'object' },
        limit: { type: 'number' },
      },
      required: ['table'],
    },
    execute: (args: any) => AiDatabaseTools.executeQuery(args.table, args),
  },
}
