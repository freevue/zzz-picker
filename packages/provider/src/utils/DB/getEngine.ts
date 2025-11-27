import { passError } from '.'
import { supabase } from '../'
import { pipe } from '@fxts/core'
import type { Engine } from '@zzz-picker/constant'

const QUERY = `
  id,
  nameKo: name_ko,
  isPickup: is_pickup,
  exclusiveAgentId: exclusive_agent_id,
  rank,
  imageUrl: image_url,
  iconUrl: icon_url
`
async function getEngine(): Promise<Array<Engine>> {
  try {
    return await pipe(
      QUERY,
      async (query) => await supabase.from('engines').select(query).eq('is_teaser', false),
      passError<Engine>
    )
  } catch {
    return []
  }
}

export default getEngine
