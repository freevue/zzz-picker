import { passError } from '.'
import { supabase } from '../'
import { pipe } from '@fxts/core'
import { type SelectBoss } from '@zzz-picker/constant'

type Party = {
  select_1: number
  select_2: number
  select_3: number
  boss_id: SelectBoss
  score: number
  elapsed_time: number
}

async function postPartyLog(data: Party) {
  try {
    return await pipe(
      data,
      async (data) => await supabase.from('party_log').insert(data).select('id'),
      passError<{ id: number }>,
      ([{ id }]) => id
    )
  } catch {
    throw new Error('파티 로그 저장 실패')
  }
}

export default postPartyLog
