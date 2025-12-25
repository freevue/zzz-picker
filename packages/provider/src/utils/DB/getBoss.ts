import { passError } from '.'
import { supabase } from '../'
import { pipe } from '@fxts/core'
import type { Boss } from '@zzz-picker/constant'

const QUERY = `
  id,
  hp,
  nameKo: name_ko,
  resistance: boss_resistance_attribute_boss_id_fkey (
    ...boss_resistance_attribute_attribute_id_fkey (
      id,
      nameKo: name_ko
    )
  ),
  weakness: boss_atribute_boss_id_fkey (
    ...boss_atribute_attribute_id_fkey (
      id,
      nameKo: name_ko
    )
  )
`
async function getBoss(): Promise<Array<Boss>> {
  try {
    return pipe(
      await supabase
        .from('boss')
        .select<string, Boss>(QUERY)
        .setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600'),
      passError<Boss>
    )
  } catch {
    return []
  }
}

export default getBoss
