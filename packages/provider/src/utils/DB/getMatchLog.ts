import { passError } from '.'
import { supabase } from '../'
import { pipe } from '@fxts/core'

const PARTY_QUERY = `
  agentId: agent_id,
  agentRate: agent_rate,
  engineId: engine_id,
  engineRate: engine_rate,
  ...agent_select_log_agent_id_fkey (
    agentNameKo: name_ko
  ),
  ...agent_select_log_engine_id_fkey (
    engineNameKo: name_ko
  )
`
const QUERY = `
  id,
  aName: a_name,
  bName: b_name,
  machAt: mach_at,
  banList: ban_log_match_id_fkey(
    agentId: agent_id
  ),
  playList: play_log_match_id_fkey (
    ...play_log_round_id_fkey(
      round_type,
      aParty: round_log_a_party_id_fkey(
        score,
        elapsedTime: elapsed_time,
        boss: party_log_boss_id_fkey(
          id,
          nameKo: name_ko
        ),
        select_1: party_log_select_1_fkey(
          ${PARTY_QUERY}
        ),
        select_2: party_log_select_2_fkey(
          ${PARTY_QUERY}
        ),
        select_3: party_log_select_3_fkey(
          ${PARTY_QUERY}
        )
      ),
      bParty: round_log_b_party_id_fkey(
        score,
        elapsedTime: elapsed_time,
        boss: party_log_boss_id_fkey(
          id,
          nameKo: name_ko
        ),
        select_1: party_log_select_1_fkey(
          ${PARTY_QUERY}
        ),
        select_2: party_log_select_2_fkey(
          ${PARTY_QUERY}
        ),
        select_3: party_log_select_3_fkey(
          ${PARTY_QUERY}
        )
      )
    )
  )
`
async function getMatchLog(key: string) {
  try {
    return await pipe(
      QUERY,
      async (query) => await supabase.from('match_log').select(query).eq('auth_key', key),
      passError<any>
    )
  } catch {
    return []
  }
}

export default getMatchLog
