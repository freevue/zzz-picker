import { passError } from '.'
import { supabase } from '../'
import { pipe } from '@fxts/core'
import type { DeadlyAssault } from '@zzz-picker/constant'

const QUERY = `
  id,
  version,
  open: open_at,
  boss1: boss!deadly_assault_boss_1_fkey (
    id,
    nameKo: name_ko
  ),
  boss2: boss!deadly_assault_boss_2_fkey (
    id,
    nameKo: name_ko
  ),
  boss3: boss!deadly_assault_boss_3_fkey (
    id,
    nameKo: name_ko
  )
`
async function getDeadlyAssaultList(): Promise<Array<DeadlyAssault>> {
  try {
    return pipe(
      await supabase
        .from('deadly_assault')
        .select<string, DeadlyAssault>(QUERY)
        .order('open_at', { ascending: false })
        .setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600'),
      passError<DeadlyAssault>
    )
  } catch {
    return []
  }
}

export default getDeadlyAssaultList
