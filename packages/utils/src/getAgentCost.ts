import { getAgentRarity } from './'
import { isUndefined, pipe, sum } from '@fxts/core'
import type { CostTable, AgentInfo } from '@zzz-picker/constant'

type CostData = {
  agent: Pick<AgentInfo, 'rarity' | 'isPickup'> | undefined
  agentRate: number
}

type ReturnAgentTotalCost = number | ((payload: CostData) => number)

function getAgentCost(costTable: CostTable, payload: CostData): number
function getAgentCost(costTable: CostTable): (payload: CostData) => number

function getAgentCost(costTable: CostTable, payload?: CostData): ReturnAgentTotalCost {
  if (isUndefined(payload))
    return (currentPayload: CostData) => getAgentCost(costTable, currentPayload)

  if (isUndefined(payload.agent)) return 0

  return pipe(
    { rarity: payload.agent.rarity, isPickup: payload.agent.isPickup },
    getAgentRarity,
    (agentCostType) => costTable[agentCostType],
    ({ used, rate }) => [used, rate * payload.agentRate],
    sum
  )
}

export default getAgentCost
