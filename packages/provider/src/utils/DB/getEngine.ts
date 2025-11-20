import { passError } from '.'
import { supabase } from '../'
import type { Engine } from '../../type'
import { pipe } from '@fxts/core'

const QUERY = `
  id,
  nameKo: name_ko,
  exclusiveAgentId: exclusive_agent_id,
  rank,
  imageUrl: image_url,
  iconUrl: icon_url
`
async function getEngine(): Promise<Array<Engine>> {
  try {
    return await pipe(
      QUERY,
      async (query) => await supabase.from('engines').select(query),
      passError<Engine>
    )
  } catch {
    return []
  }
}

export default getEngine
