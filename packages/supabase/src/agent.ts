import { AiDatabaseTools } from './ai-client'
import { GoogleGenAI } from '@google/genai'

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
const ALLOWED_TABLES = ['agents', 'match_log', 'teams', 'metadata']

export const chatWithGemini = async (messages: any[]) => {
  const client = getClient()

  // messages는 이미 { role, parts } 형태의 배열로 가정
  // generateContent를 위해 전체 히스토리를 contents로 사용
  const contents = [...messages]

  const tools = [
    {
      functionDeclarations: Object.entries(GeminiSupabaseTools).map(([name, tool]) => ({
        name,
        description: tool.description,
        parameters: tool.parameters as any,
      })),
    },
  ]

  const generateConfig = {
    maxOutputTokens: 2048,
    tools,
  }

  // 1차 생성 요청
  let response = await client.models.generateContent({
    model: 'gemini-2.0-flash-lite',
    contents,
    config: generateConfig,
  })

  // 응답 처리
  let responseData = (response as any).response || response
  let functionCalls = responseData.candidates?.[0]?.content?.parts?.filter(
    (p: any) => p.functionCall
  )

  // Tool Call 루프
  while (functionCalls && functionCalls.length > 0) {
    // 모델의 Function Call 응답을 히스토리에 추가
    const modelResponseContent = responseData.candidates?.[0]?.content
    contents.push(modelResponseContent)

    // Tool 실행
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

    // 실행 결과(Function Response)를 히스토리에 추가
    contents.push({
      role: 'tool',
      parts: functionResponses,
    })

    // 다음 단계 생성 요청 (tools 설정 유지)
    response = await client.models.generateContent({
      model: 'gemini-2.0-flash-lite',
      contents,
      config: generateConfig,
    })

    responseData = (response as any).response || response
    functionCalls = responseData.candidates?.[0]?.content?.parts?.filter((p: any) => p.functionCall)
  }

  return responseData.candidates?.[0]?.content?.parts?.[0]?.text || ''
}
