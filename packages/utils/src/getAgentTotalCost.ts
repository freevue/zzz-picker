import { isUndefined, pipe, concat, isNull, sum } from '@fxts/core'
import type { CostTable, AgentCostSetting } from '@zzz-picker/constant'

function engineExclusionRule(agentSetting: AgentCostSetting) {
  return (engineTable: CostTable['engine']) => {
    if (isNull(agentSetting.engineType)) return []

    const { used, rate } = engineTable[agentSetting.engineType]

    switch (agentSetting.engineType) {
      case 'S':
        return [used, agentSetting.engineRate >= 4 ? rate : 0]
      default:
        return [used, rate * agentSetting.engineRate]
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
  if (isUndefined(agentSetting)) {
    return (currentAgentSetting: AgentCostSetting) =>
      getAgentTotalCost(costTable, currentAgentSetting)
  }

  const { agent, engine } = costTable

  return pipe(
    agent[agentSetting.pickup],
    ({ used, rate }) => [used, rate * agentSetting.agentRate],
    concat(agentSetting.engineType ? pipe(engine, engineExclusionRule(agentSetting)) : []),
    sum
  )
}

export default getAgentTotalCost
