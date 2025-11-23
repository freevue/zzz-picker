import { passError } from '.'
import { supabase } from '../'
import { isEmpty, pipe } from '@fxts/core'
import { type PlayState } from '@zzz-picker/constant'

async function postMatch({ nickname }: PlayState) {
  if (isEmpty(nickname.A) || isEmpty(nickname.B)) return null

  try {
    return await pipe(
      {
        a_name: nickname.A,
        b_name: nickname.B,
      },
      async (data) => await supabase.from('match_log').insert(data).select('id'),
      passError<{ id: number }>,
      ([{ id }]) => id
    )
  } catch (error) {
    throw Error('매칭 로그 저장 실패')
  }
}

export default postMatch
