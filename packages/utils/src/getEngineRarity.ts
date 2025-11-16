import { isUndefined, isNull } from '@fxts/core'
import type { AgentInfo, EngineCostType, EngineInfo } from '@zzz-picker/constant'

type EngineRarity = EngineCostType | null
type ReturnEngineRarity = EngineRarity | ((engine: EngineInfo | null) => EngineRarity)

function getEngineRarity(agent: AgentInfo | undefined, engine: EngineInfo | null): EngineRarity
function getEngineRarity(agent: AgentInfo | undefined): (engine: EngineInfo | null) => EngineRarity

function getEngineRarity(agent?: AgentInfo, engine?: EngineInfo | null): ReturnEngineRarity {
  if (isUndefined(agent)) return null
  if (isUndefined(engine))
    return (currentEngine: EngineInfo | null) => getEngineRarity(agent, currentEngine)
  if (isNull(engine)) return null

  if (engine.rank !== 'S') return 'aEngine'
  if (!agent.isPickup) return 'sEngine'
  if (Number(engine.exclusiveAgentId) === Number(agent.id)) return 'sExclusiveEngine'

  return 'sEngine'
}

export default getEngineRarity
