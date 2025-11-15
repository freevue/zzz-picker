import type { EngineCostType, EngineInfo } from '@zzz-picker/constant'

type Params = {
  engine: EngineInfo
  agentId: number
}

function getEngineRarity(params: Params): EngineCostType

function getEngineRarity({ engine, agentId }: Params): EngineCostType {
  if (engine.rank !== 'S') return 'aEngine'
  if (Number(engine.exclusiveAgentId) === Number(agentId)) return 'sExclusiveEngine'

  return 'sEngine'
}

export default getEngineRarity
