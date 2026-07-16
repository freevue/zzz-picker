import { TableName } from './constant'
import { type Engine } from '@/type'
import { supabase } from '@zzz-picker/supabase'

export async function selectEngine(): Promise<Array<Engine>> {
  const { data } = await supabase.from(TableName.ENGINE).select<string, Engine>(
    `id,
    nameKo,
    rank,
    exclusiveAgentId,
    isPickup,
    isTeaser,
    ...iconImageId(icon: src),
    ...imageId(banner: src)`
  )

  if (data === null) throw Error('')

  return data
}
