import { passError } from '.'
import { supabase } from '../'
import { map, pipe, toArray } from '@fxts/core'
import type { AgentId } from '@zzz-picker/constant'

function postBanLog(match_id: number) {
  return async (idList: Array<AgentId>) => {
    try {
      return await pipe(
        idList,
        map((agent_id) => ({ match_id, agent_id })),
        toArray,
        async (data) => await supabase.from('ban_log').insert(data).select('id'),
        passError<{ id: number }>,
        map(({ id }) => id),
        toArray
      )
    } catch (error) {
      throw error
    }
  }
}

export default postBanLog
