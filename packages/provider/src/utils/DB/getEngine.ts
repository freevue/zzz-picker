import { passError, QUERY } from '.'
import { supabase } from '../'
import { pipe } from '@fxts/core'
import type { Engine } from '@zzz-picker/constant'

async function getEngine(): Promise<Array<Engine>> {
  try {
    return pipe(
      QUERY.ENGINES,
      async (query) =>
        await supabase
          .from('engines')
          .select<QUERY.ENGINES, Engine>(query)
          .eq<'is_teaser'>('is_teaser', false),
      passError<Engine>
    )
  } catch {
    return []
  }
}

export default getEngine
