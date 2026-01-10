import { AiDatabaseTools } from './ai-client'
import { GoogleGenAI } from '@google/genai'

/**
 * Gemini 모델 상수 정의
 */
const MODELS = {
  // 속도, 확장성, 최첨단 인텔리전스를 위해 설계된 가장 균형 잡힌 모델
  INTELLIGENT: 'gemini-3-flash-preview',
  // 최고의 가격 대비 성능, 에이전트 사용 사례에 적합
  BALANCED: 'gemini-2.5-flash',
  // 비용 효율성과 높은 처리량에 최적화된 가장 빠른 Flash 모델
  FAST: 'gemini-2.5-flash-lite',
} as const

/**
 * Gemini 모델에게 제공할 도구 정의(Tool Definitions)입니다.
 */
export const GeminiSupabaseTools = {
  get_database_schema: {
    description:
      'Supabase 데이터베이스의 테이블 구조 및 컬럼 지도를 반환합니다. 어떤 데이터를 가져와야 할지 판단이 서지 않을 때 가장 먼저 호출해야 합니다.',
    parameters: {
      type: 'object',
      properties: {},
    },
    execute: AiDatabaseTools.getSchema,
  },

  query_database: {
    description:
      "특정 테이블에서 조건에 맞는 데이터를 조회합니다. 'get_database_schema'를 통해 확인한 테이블명과 컬럼명을 사용하십시오. 결과가 없으면 결과를 임의로 생성하지 말고 데이터가 없다고 답변하십시오.",
    parameters: {
      type: 'object',
      properties: {
        table: { type: 'string', description: "조회할 테이블명 (예: 'agents', 'match_log')" },
        select: {
          type: 'string',
          description: "조회할 컬럼들 (쉼표로 구분, 예: 'id, name_ko'). 기본값은 '*'",
        },
        match: { type: 'object', description: '필터링 조건 (예: { id: 1 }).' },
        limit: { type: 'number', description: '조회 결과 개수 제한' },
      },
      required: ['table'],
    },
    execute: (args: any) => AiDatabaseTools.executeQuery(args.table, args),
  },
}

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
  'deadly_assault',
  'boss',
  'engines',
  'attributes',
  'faction',
  'specialty',
  'boss_weakness_attribute',
  'boss_resistance_attribute',
]

const SYSTEM_INSTRUCTION = `
당신은 ZZZ (Zenless Zone Zero) 데이터 분석 전문 AI 에이전트입니다.
다음 원칙을 반드시 준수하십시오:
1. **절대적인 사실 기반**: 반드시 'query_database' 도구를 통해 조회된 실제 데이터만을 사용해야 합니다.
2. **환각 방지**: 도구 실행 결과에 없는 데이터(점수, 캐릭터 이름, 매치 기록 등)를 절대 만들어내거나 추측하지 마십시오.
3. **정직한 응답**: 조회 결과가 없거나 부족할 경우, 데이터를 지어내지 말고 "데이터가 없습니다"라고 명확히 말하십시오.
4. **테이블 제한**: 허용된 테이블(${ALLOWED_TABLES.join(', ')}) 내의 정보만 신뢰하십시오.
5. **분석적 태도**: 데이터를 단순 나열하기보다, 질문의 의도에 맞춰 분석하고 요약하십시오.
`

export const chatWithGemini = async (messages: any[]) => {
  const client = getClient()

  // Token Efficiency: 전체 히스토리 대신 현재 입력된 메시지만 사용하여 계획 수립
  const currentMessage = messages[messages.length - 1]
  const plannerContents = [currentMessage]

  // Step 1: Intent Analysis & Tool Selection (의도 분석 및 도구 선택)
  // 목적: 사용자 질문을 분석하고 필요한 데이터를 가져오기 위한 최적의 도구 호출 생성
  // 모델: INTELLIGENT (gemini-3-flash-preview)

  const plannerTools = [
    {
      functionDeclarations: Object.entries(GeminiSupabaseTools).map(([name, tool]) => ({
        name,
        description: tool.description,
      })),
    },
  ]

  const plannerConfig = {
    maxOutputTokens: 2048,
    tools: plannerTools,
    systemInstruction: `
당신은 ZZZ (Zenless Zone Zero) 데이터 분석을 위한 'Query Planner'입니다.
사용자의 질문을 분석하여 어떤 테이블에서 어떤 데이터를 조회해야 할지 판단하고, 정확한 'query_database' 도구를 호출하십시오.

[사용 가능한 테이블]
${ALLOWED_TABLES.join(', ')}

[지침]
1. **필수**: 오직 도구 호출(Function Call)만 생성하십시오. 불필요한 대화나 설명은 생략하십시오.
2. **분석적 접근**: 질문이 복잡하다면 필요한 모든 데이터를 조회하도록 계획을 세우십시오.
3. **가용성**: 위 테이블 목록에 있는 정보는 모두 쿼리할 수 있습니다. 예를 들어 'ban_log'나 'match_log' 등 필요한 테이블을 적극적으로 선택하십시오.
`,
  }

  let response
  try {
    response = await client.models.generateContent({
      model: MODELS.INTELLIGENT,
      contents: plannerContents, // 현재 메시지만 전송
      config: plannerConfig,
    })
  } catch (error: any) {
    if (error.status === 429 || error.message?.includes('RESOURCE_EXHAUSTED')) {
      return '현재 모델의 사용량이 토큰 제한에 도달했습니다. 잠시 후 다시 시도해주세요. (Token Limit Exceeded)'
    }
    return `Step 1 (분석) 오류: ${error.message}`
  }

  let responseData = (response as any).response || response
  let functionCalls = responseData.candidates?.[0]?.content?.parts?.filter(
    (p: any) => p.functionCall
  )

  // Step 2: Tool Execution (도구 실행 및 데이터 확보)
  // Synthesis(Step 3)를 위한 컨텍스트 구성: [현재 메시지, ...도구 결과]
  // 전체 히스토리가 아닌 현재 턴의 데이터만 사용하여 합성
  let synthesisContents = [currentMessage]

  if (functionCalls && functionCalls.length > 0) {
    // 모델의 Function Call 내용을 기록 (선택 사항이나 모델이 무엇을 했는지 알기 위해 포함 가능)
    // 여기서는 토큰 절약 및 순수 데이터 합성을 위해 Tool Response를 중점적으로 처리

    // contents.push(responseData.candidates?.[0]?.content) // (생략 가능)

    const functionResponses = await Promise.all(
      functionCalls.map(async (part: any) => {
        const call = part.functionCall
        const tool = (GeminiSupabaseTools as any)[call.name]

        // 보안 필터
        if (call.name === 'query_database') {
          const args = call.args as any
          const table = args.table as string
          if (!ALLOWED_TABLES.includes(table)) {
            return {
              functionResponse: {
                name: call.name,
                response: { content: `Error: '${table}' 테이블에 대한 접근 권한이 없습니다.` },
              },
            }
          }
        }

        if (tool) {
          try {
            const toolResult = await tool.execute(call.args)
            return {
              functionResponse: {
                name: call.name,
                response: { content: toolResult || '조회된 데이터가 없습니다.' },
              },
            }
          } catch (error: any) {
            return {
              functionResponse: {
                name: call.name,
                response: { content: `Error: ${error.message}` },
              },
            }
          }
        }
        return {
          functionResponse: {
            name: call.name,
            response: { content: '해당 도구를 찾을 수 없습니다.' },
          },
        }
      })
    )

    // 실행 결과(Function Response)를 합성용 컨텍스트에 추가
    synthesisContents.push({
      role: 'tool',
      parts: functionResponses,
    })
  } else {
    // 도구 호출이 없는 경우
    // Step 1에서 텍스트 응답이 생성되었을 수 있음 (예: "안녕하세요").
    // 이를 Step 3로 넘겨서 다듬거나, 아니면 Step 3가 원본 질문을 보고 처리하게 함.
    // 여기서는 synthesisContents에 사용자 질문만 있으므로 Step 3 모델이 직접 답변.
  }

  // Step 3: Response Synthesis (결과 종합 및 생성)
  // 목적: 확보된 데이터(또는 대화 맥락)를 바탕으로 사용자의 질문에 대한 최종 답변 생성
  // 모델: BALANCED (gemini-2.5-flash) - 가성비 및 문장 생성 능력 우수
  // 설정: tools를 비활성화하여 추가 도구 호출을 방지하고 환각(Hallucination) 억제

  const synthesisConfig = {
    maxOutputTokens: 2048,
    // tools: [], // 도구 제거 (Data Only 모드)
    systemInstruction: `
당신은 ZZZ (Zenless Zone Zero) 데이터 분석 결과 리포터입니다.
사용자 질문과 제공된 도구 실행 결과(Function Response)를 바탕으로 답변하십시오.

[엄격한 제약 사항]
1. **Fact-Only**: 오직 제공된 'tool' 데이터에 기반해서만 답변하십시오. 
2. **No-Hallucination**: 데이터에 없는 내용(승률, 픽률, 이름 등)은 절대 지어내지 마십시오.
3. **Data-Not-Found**: 만약 데이터가 없거나 '조회된 데이터가 없습니다'라는 결과만 있다면, "관련된 데이터를 찾을 수 없습니다"라고 솔직하게 답변하십시오.
4. **Concise**: 불필요한 서론/본론을 줄이고 핵심 정보를 요약해서 전달하십시오.
`,
  }

  try {
    response = await client.models.generateContent({
      model: MODELS.BALANCED,
      contents: synthesisContents, // 최적화된 컨텍스트 사용
      config: synthesisConfig,
    })
  } catch (error: any) {
    if (error.status === 429 || error.message?.includes('RESOURCE_EXHAUSTED')) {
      return '결과 생성 중 토큰 제한에 도달했습니다. (Token Limit Exceeded)'
    }
    return `Step 3 (생성) 오류: ${error.message}`
  }

  responseData = (response as any).response || response
  return responseData.candidates?.[0]?.content?.parts?.[0]?.text || ''
}
