import { TableName } from './constant'
import { type Engine, type EngineCost } from '@/type'
import { groupBy, map, pipe, toArray } from '@fxts/core'
import { supabase } from '@zzz-picker/supabase'

async function selectEngineCost() {
  const { data } = await supabase
    .from(TableName.ENGINE_COST)
    .select<string, EngineCost>(`engineId, rate, cost`)

  if (data === null) throw Error('')

  return data
}

export async function selectEngine(): Promise<Array<Engine>> {
  const costMap = await pipe(
    selectEngineCost(),
    groupBy(({ engineId }) => engineId)
  )
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

  return pipe(
    data,
    map((engine) => ({ ...engine, cost: costMap[engine.id] })),
    toArray
  )
}
