import { AiDatabaseTools } from './ai-client'

/**
 * Gemini 모델에게 제공할 도구 정의(Tool Definitions)입니다.
 * 이 정보는 Gemini SDK의 `tools` 매개변수로 전달되어 모델이 도구 사용을 결정할 수 있게 합니다.
 */
export const GeminiSupabaseTools = {
  // 1. 스키마 확인 도구
  get_database_schema: {
    description:
      'Supabase 데이터베이스의 테이블 구조 및 컬럼 지도를 반환합니다. 어떤 데이터를 가져와야 할지 판단이 서지 않을 때 가장 먼저 호출해야 합니다.',
    parameters: {
      type: 'object',
      properties: {},
    },
    execute: AiDatabaseTools.getSchema,
  },

  // 2. 동적 데이터 조회 도구
  query_database: {
    description:
      "특정 테이블에서 조건에 맞는 데이터를 조회합니다. 'get_database_schema'를 통해 확인한 테이블명과 컬럼명을 사용하십시오.",
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

/**
 * [예시] Gemini 에이전트가 생각하는 과정:
 * 1. 유저: "현재 등록된 에이전트 수랑 제일 나중에 추가된 에이전트가 누구야?"
 * 2. 모델: (생각) 에이전트 정보를 알려면 먼저 스키마를 봐야겠군. -> 'get_database_schema' 호출
 * 3. 모델: (생각) 'agents' 테이블에 'id'와 'name_ko'가 있네. 데이터 조회를 하자. -> 'query_database' 호출
 *          파라미터: { table: 'agents', select: 'id, name_ko', order: { column: 'id', ascending: false }, limit: 1 }
 * 4. 모델: "현재 총 20명의 에이전트가 등록되어 있으며, 가장 최근에 추가된 에이전트는 '엘렌 조'입니다."
 */
