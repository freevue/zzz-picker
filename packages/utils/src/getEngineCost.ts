import { isUndefined, pipe, sum, when, append, isNull } from '@fxts/core'
import type { CostWeight, AgentCostSetting, EngineCostType } from '@zzz-picker/constant'

type ReturnAgentTotalCost = number | ((payload: CostWeight) => number)

function getEngineCost(
  cost: AgentCostSetting,
  engineRarity: EngineCostType | null,
  payload: CostWeight
): number
function getEngineCost(
  cost: AgentCostSetting,
  engineRarity: EngineCostType | null
): (payload: CostWeight) => number

function getEngineCost(
  cost: AgentCostSetting,
  engineRarity: EngineCostType | null,
  payload?: CostWeight
): ReturnAgentTotalCost {
  if (isNull(engineRarity)) return 0
  if (isUndefined(payload))
    return (currentPayload: CostWeight) => getEngineCost(cost, engineRarity, currentPayload)

  return pipe(
    [payload.rate * (cost.engineRate - 1)],
    when(
      () => engineRarity === 'sEngine',
      () => [cost.engineRate >= 4 ? 1 : 0]
    ),
    append(payload.used),
    sum
  )
}

export default getEngineCost
