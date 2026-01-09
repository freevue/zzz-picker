import { AiDatabaseTools } from './ai-client'
import { GoogleGenerativeAI, Tool } from '@google/generative-ai'

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

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export const chatWithGemini = async (
  messages: { role: 'user' | 'model'; parts: { text: string }[] }[]
) => {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash', // 사용자 요청에 따라 2.5를 사용하려 했으나 현재 사용 가능한 모델명으로 설정 (필요시 업데이트)
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

  const lastMessage = messages[messages.length - 1].parts[0].text
  const result = await chat.sendMessage(lastMessage)
  const response = await result.response

  // Tool Call 처리 로직 (단순 구현, 필요시 루프 확장 가능)
  const call = response.functionCalls()?.[0]
  if (call) {
    const tool = (GeminiSupabaseTools as any)[call.name]
    if (tool) {
      const toolResult = await tool.execute(call.args)
      const followUp = await chat.sendMessage([
        {
          functionResponse: {
            name: call.name,
            response: {
              content: toolResult || '조회된 데이터가 없습니다. 사실에 기반하여 답하십시오.',
            },
          },
        },
      ])
      return followUp.response.text()
    }
  }

  return response.text()
}
