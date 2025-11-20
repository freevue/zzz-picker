import { passError } from '.'
import { supabase } from '../'
import { pipe } from '@fxts/core'
import type { Agent } from '@zzz-picker/constant'

const QUERY = `
  id,
  rarity,
  isTeaser: is_teaser,
  isPickup: is_pickup,
  isAllow: is_allow,
  color,
  nameKo: name_ko,
  fullNameKo: full_name_ko,
  banner: fk_banner_image (
    url,
    description,
    sources: new_agent_images_source_id_fkey (
      name,
      url
    )
  ),
  profile: fk_profile_image (
    url,
    description,
    sources: new_agent_images_source_id_fkey (
      name,
      url
    )
  ),
  specialty: agents_specialty_id_fkey (
    id,
    nameKo: name_ko
  ),
  attributes: agents_attributes_id_fkey (
    id,
    nameKo: name_ko
  ),
  engine: engines_exclusive_agent_id_fkey (
    id,
    nameKo: name_ko,
    exclusiveAgentId: exclusive_agent_id,
    rank,
    imageUrl: image_url,
    iconUrl: icon_url
  )
`
async function getAgent(): Promise<Array<Agent>> {
  try {
    return await pipe(
      QUERY,
      async (query) => await supabase.from('agents').select(query),
      passError<Agent>
    )
  } catch {
    return []
  }
}

export default getAgent
