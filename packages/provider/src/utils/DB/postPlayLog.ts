import { passError } from '.'
import { supabase } from '../'
import { map, pipe, toArray } from '@fxts/core'

function postPlayLog(match_id: number) {
  return async (idList: Array<number>) => {
    try {
      return await pipe(
        idList,
        map((round_id) => ({ match_id, round_id })),
        toArray,
        async (data) => await supabase.from('play_log').insert(data).select('id'),
        passError<{ id: number }>,
        map(({ id }) => id),
        toArray
      )
    } catch (error) {
      throw error
    }
  }
}

export default postPlayLog
