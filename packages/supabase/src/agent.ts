import { AiDatabaseTools } from './ai-client'
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { Content, Part } from '@google/generative-ai'

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

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

/**
 * 보안을 위한 허용된 테이블 목록 (Whitelist)
 */
const ALLOWED_TABLES = ['agents', 'match_log', 'teams', 'metadata']

export const chatWithGemini = async (messages: Content[]) => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-3-flash-preview',
    tools: [
      {
        functionDeclarations: Object.entries(GeminiSupabaseTools).map(([name, tool]) => ({
          name,
          description: tool.description,
          parameters: tool.parameters as any,
        })),
      },
    ],
  })

  const chat = model.startChat({
    history: messages.slice(0, -1),
    generationConfig: {
      maxOutputTokens: 2048,
    },
  })

  const lastMsg = messages[messages.length - 1]
  const lastMessageText = lastMsg.parts[0].text || ''

  let response = await chat.sendMessage(lastMessageText)
  let responseText = response.response.text()
  let functionCalls = response.response.functionCalls()

  // 다중 도구 호출 및 순차적 실행을 위한 루프
  while (functionCalls && functionCalls.length > 0) {
    const functionResponses: Part[] = await Promise.all(
      functionCalls.map(async (call) => {
        const tool = (GeminiSupabaseTools as any)[call.name]

        // 보안 필터: query_database 사용 시 테이블 화이트리스트 체크
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

    // 도구 실행 결과를 모델에 전달하고 다음 응답 수신
    response = await chat.sendMessage(functionResponses)
    responseText = response.response.text()
    functionCalls = response.response.functionCalls()
  }

  return responseText
}
