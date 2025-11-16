import { getAgentRarity, getEngineRarity, getAgentCost, getEngineCost } from './'
import { isNull, isUndefined, pipe, sum, peek } from '@fxts/core'
import type {
  AgentCostSetting,
  AgentInfo,
  EngineInfo,
  AgentCostType,
  EngineCostType,
  CostTable,
} from '@zzz-picker/constant'

type Payload = [AgentCostSetting, AgentInfo | undefined, EngineInfo | undefined]
type CostData = [AgentCostSetting, AgentCostType, EngineCostType]
type ReturnTotalCost = number | ((payload: Payload | null) => number)

function getTotalCost(costTable: CostTable, payload: Payload | null): number
function getTotalCost(costTable: CostTable): (payload: Payload | null) => number

function getTotalCost(costTable: CostTable, payload?: Payload | null): ReturnTotalCost {
  if (isUndefined(payload)) return (currentPayload) => getTotalCost(costTable, currentPayload)
  if (isNull(payload)) return 0

  return pipe(
    payload,
    ([cost, agent, engine]) =>
      [cost, getAgentRarity(agent), getEngineRarity(agent, engine || null)] as CostData,
    ([cost, agentRarity, engineRarity]) => [
      getAgentCost(cost, costTable[agentRarity]),
      getEngineCost(cost, engineRarity, costTable[engineRarity]),
    ],
    sum
  )
}

export default getTotalCost
