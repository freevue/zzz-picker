import { passError } from '.'
import { supabase } from '../'
import { pipe } from '@fxts/core'

const FOO = `
  agent_id,
  agent_rate,
  engine_id,
  engine_rate,
  ...agent_select_log_agent_id_fkey (
    agentNameKo: name_ko
  ),
  ...agent_select_log_engine_id_fkey (
    engineNameKo: name_ko
  )
`
const QUERY = `
  id,
  a_name,
  b_name,
  mach_at,
  playList: play_log_match_id_fkey (
    ...play_log_round_id_fkey(
      round_type,
      aParty: round_log_a_party_id_fkey(
        score,
        elapsed_time,
        select_1: party_log_select_1_fkey(
          ${FOO}
        ),
        select_2: party_log_select_2_fkey(
          ${FOO}
        ),
        select_3: party_log_select_3_fkey(
          ${FOO}
        )
      ),
      bParty: round_log_b_party_id_fkey(
        score,
        elapsed_time,
        select_1: party_log_select_1_fkey(
          ${FOO}
        ),
        select_2: party_log_select_2_fkey(
          ${FOO}
        ),
        select_3: party_log_select_3_fkey(
          ${FOO}
        )
      )
    )
  )
`
async function getMatchLog(id: number) {
  try {
    return await pipe(
      QUERY,
      async (query) => await supabase.from('match_log').select(query).eq('id', id),
      passError<any>,
      ([match]) => match
    )
  } catch {
    return []
  }
}

export default getMatchLog
