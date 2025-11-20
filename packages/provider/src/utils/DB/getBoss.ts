import { passError } from '.'
import { supabase } from '../'
import type { Boss } from '../../type'
import { pipe } from '@fxts/core'

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
    return await pipe(
      QUERY,
      async (query) => await supabase.from('boss').select(query),
      passError<Boss>
    )
  } catch {
    return []
  }
}

export default getBoss
