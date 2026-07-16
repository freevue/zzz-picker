import { TableName } from './constant'
import { type Agent } from '@/type'
import { supabase } from '@zzz-picker/supabase'

export async function selectAgent(): Promise<Array<Agent>> {
  const { data } = await supabase.from(TableName.AGENT).select<string, Agent>(
    `id,
    nameKo,
    fullNameKo,
    color,
    isPickup,
    isAllow,
    rarity,
    ...bannerImageId(banner: src),
    ...profileImageId(profile: src),
    specialty(
      nameKo,
      ...image(src)
    ),
    attribute(
      nameKo,
      ...image(src)
    )`
  )

  if (data === null) throw Error('')

  return data
}
