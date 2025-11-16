import { isUndefined } from '@fxts/core'
import type { AgentCostType, AgentInfo } from '@zzz-picker/constant'

function getAgentRarity(params: AgentInfo | undefined): AgentCostType | null

function getAgentRarity(params?: AgentInfo): AgentCostType | null {
  if (isUndefined(params)) return null

  if (params.isPickup) return 'sPickAgent'
  if (params.rarity === 'A') return 'aAlwaysAgent'

  return 'sAlwaysAgent'
}

export default getAgentRarity
