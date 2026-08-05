import { TableName } from './constant'
import { type Agent, type AgentCost } from '@/type'
import { map, pipe, toArray, groupBy } from '@fxts/core'
import { supabase } from '@zzz-picker/supabase'

async function selectAgentCost() {
  const { data } = await supabase
    .from(TableName.AGENT_COST)
    .select<string, AgentCost>(`agentId, rate, cost`)

  if (data === null) throw Error('')

  return data
}

export async function selectAgent(): Promise<Array<Agent>> {
  const costMap = await pipe(
    selectAgentCost(),
    groupBy(({ agentId }) => agentId)
  )
  const { data } = await supabase.from(TableName.AGENT).select<string, Agent>(
    `id,
    nameKo,
    fullNameKo,
    color,
    isPickup,
    isAllow,
    isTeaser,
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

  return pipe(
    data,
    map((agent) => ({ ...agent, cost: costMap[agent.id] ?? [] })),
    toArray
  )
}
