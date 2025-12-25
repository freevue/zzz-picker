import { passError, QUERY } from '.'
import { supabase } from '../'
import { pipe } from '@fxts/core'
import type { Engine } from '@zzz-picker/constant'

async function getEngine(): Promise<Array<Engine>> {
  try {
    return pipe(
      await supabase
        .from('engines')
        .select<QUERY.ENGINES, Engine>(QUERY.ENGINES)
        .eq<'is_teaser'>('is_teaser', false)
        .setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600'),
      passError<Engine>
    )
  } catch {
    return []
  }
}

export default getEngine
