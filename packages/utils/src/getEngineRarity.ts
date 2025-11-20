import { isUndefined, isNull } from '@fxts/core'
import type { AgentInfo, EngineCostType, Engine } from '@zzz-picker/constant'

type EngineRarity = EngineCostType | null
type ReturnEngineRarity = EngineRarity | ((engine: Engine | null) => EngineRarity)

function getEngineRarity(agent: AgentInfo | undefined, engine: Engine | null): EngineRarity
function getEngineRarity(agent: AgentInfo | undefined): (engine: Engine | null) => EngineRarity

function getEngineRarity(agent?: AgentInfo, engine?: Engine | null): ReturnEngineRarity {
  if (isUndefined(agent)) return null
  if (isUndefined(engine))
    return (currentEngine: Engine | null) => getEngineRarity(agent, currentEngine)
  if (isNull(engine)) return null

  if (engine.rank !== 'S') return 'aEngine'
  if (!agent.isPickup) return 'sEngine'
  if (Number(engine.exclusiveAgentId) === Number(agent.id)) return 'sExclusiveEngine'

  return 'sEngine'
}

export default getEngineRarity
