import { supabase } from './index'
import { DB_SCHEMA } from './schema'

/**
 * Gemini 에이전트가 유기적으로 데이터를 조회하기 위한 툴셋입니다.
 */
export const AiDatabaseTools = {
  /**
   * DB 스키마 정보를 반환합니다.
   * 모델이 어떤 테이블과 컬럼을 조회할지 판단할 때 사용합니다.
   */
  getSchema: () => {
    return DB_SCHEMA
  },

  /**
   * 동적 쿼리를 실행합니다.
   * @param table 대상 테이블명
   * @param config 쿼리 설정 (select, filter 등)
   */
  executeQuery: async (
    table: string,
    config: {
      select?: string
      match?: Record<string, any>
      order?: { column: string; ascending?: boolean }
      limit?: number
    }
  ) => {
    let query = supabase.from(table).select(config.select || '*')

    if (config.match) {
      query = query.match(config.match)
    }

    if (config.order) {
      query = query.order(config.order.column, { ascending: config.order.ascending ?? false })
    }

    if (config.limit) {
      query = query.limit(config.limit)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Supabase Query Error: ${error.message}`)
    }

    return data
  },

  /**
   * 자연어 질문에 대응하는 복합 비즈니스 로직을 실행합니다. (예: 승률 분석)
   * 모델이 직접 쿼리하기 너무 복합한 경우를 위한 프리셋입니다.
   */
  analyzeTrends: async (type: 'agent_pick_rate' | 'win_rate') => {
    // 향후 복합 쿼리 로직 구현
    return { message: `${type} 분석 결과 (준비 중)` }
  },
}
