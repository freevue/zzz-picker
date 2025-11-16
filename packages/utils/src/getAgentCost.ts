import { isUndefined, sum } from '@fxts/core'
import type { CostWeight, AgentCostSetting } from '@zzz-picker/constant'

type ReturnAgentTotalCost = number | ((payload: CostWeight) => number)

function getAgentCost(cost: AgentCostSetting, payload: CostWeight): number
function getAgentCost(cost: AgentCostSetting): (payload: CostWeight) => number

function getAgentCost(cost: AgentCostSetting, payload?: CostWeight): ReturnAgentTotalCost {
  if (isUndefined(payload))
    return (currentPayload: CostWeight) => getAgentCost(cost, currentPayload)

  return sum([payload.used, payload.rate * cost.agentRate])
}

export default getAgentCost
