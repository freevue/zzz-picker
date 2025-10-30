import type { AgentCostType, Rarity } from '@zzz-picker/constant'

type Params = {
  rarity: Rarity
  isPickup: boolean
}

function getAgentRarity(params: Params): AgentCostType

function getAgentRarity({ rarity, isPickup }: Params): AgentCostType {
  if (isPickup) return 'sPickAgent'
  if (rarity === 'A') return 'aAlwaysAgent'

  return 'sAlwaysAgent'
}

export default getAgentRarity
