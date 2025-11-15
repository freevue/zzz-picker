import { getEngineRarity } from './'
import { isUndefined, pipe, isNull, sum } from '@fxts/core'
import type { CostTable, EngineInfo } from '@zzz-picker/constant'

type CostData = {
  engine: EngineInfo | null
  engineRate: number
  agentId: number
}

type ReturnAgentTotalCost = number | ((payload: CostData) => number)

function getEngineCost(costTable: CostTable, payload: CostData): number
function getEngineCost(costTable: CostTable): (payload: CostData) => number

function getEngineCost(costTable: CostTable, payload?: CostData): ReturnAgentTotalCost {
  if (isUndefined(payload))
    return (currentPayload: CostData) => getEngineCost(costTable, currentPayload)
  if (isNull(payload.engine)) return 0
  if (isUndefined(payload.engine)) return 0

  return pipe(
    { engine: payload.engine, agentId: payload.agentId },
    getEngineRarity,
    (engineCostType) => {
      const { used, rate } = costTable[engineCostType]

      return [
        used,
        engineCostType === 'sEngine'
          ? payload.engineRate >= 4
            ? rate
            : 0
          : rate * (payload.engineRate - 1),
      ]
    },
    sum
  )
}

export default getEngineCost
