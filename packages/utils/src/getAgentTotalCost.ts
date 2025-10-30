import { isUndefined, pipe, concat, isNull, sum } from '@fxts/core'
import type { CostTable, AgentCostSetting } from '@zzz-picker/constant'

function engineExclusionRule(agentSetting: AgentCostSetting) {
  return (engineTable: CostTable) => {
    if (isNull(agentSetting.engineType)) return []

    const { used, rate } = engineTable[agentSetting.engineType]

    switch (agentSetting.engineType) {
      case 'sEngine':
        return [used, agentSetting.engineRate >= 4 ? rate : 0]
      default:
        return [used, rate * (agentSetting.engineRate - 1)]
    }
  }
}

type ReturnAgentTotalCost = number | ((agentSetting: AgentCostSetting) => number)

function getAgentTotalCost(costTable: CostTable, agentSetting: AgentCostSetting): number
function getAgentTotalCost(costTable: CostTable): (agentSetting: AgentCostSetting) => number

function getAgentTotalCost(
  costTable: CostTable,
  agentSetting?: AgentCostSetting
): ReturnAgentTotalCost {
  if (isUndefined(agentSetting))
    return (currentAgentSetting: AgentCostSetting) =>
      getAgentTotalCost(costTable, currentAgentSetting)

  return pipe(
    costTable[agentSetting.rarity],
    ({ used, rate }) => [used, rate * agentSetting.agentRate],
    concat(agentSetting.engineType ? pipe(costTable, engineExclusionRule(agentSetting)) : []),
    sum
  )
}

export default getAgentTotalCost
