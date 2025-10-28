import type { AgentCostSetting, URLState, CostWeight, CostTable } from './types.d'

export * from './types.d'

export const PRETTY_AGENT_ID = 156728
export const DEFAULT_COST_RATE = 0.05
export const DEFAULT_TIME_BONUS = 333
export const DEFAULT_AGENT_COST_STATE: AgentCostSetting = {
  pickup: 'AAlways',
  agentRate: 0,
  engineType: 'SExclusive',
  engineRate: 0,
}
export const DEFAULT_URL_STATE: URLState = {
  banCount: 2,
  totalCost: 24,
  allowAgent: [],
}
export const DEFAULT_COST_WEIGHT: CostWeight = {
  used: 0,
  rate: 0,
}
export const DEFAULT_COST_TABLE: CostTable = {
  agent: {
    SPick: {
      used: 1,
      rate: 1,
    },
    SAlways: {
      used: 0,
      rate: 0,
    },
    AAlways: {
      used: 0,
      rate: 0,
    },
  },
  engine: {
    SExclusive: {
      used: 1,
      rate: 0.5,
    },
    S: {
      used: 0,
      rate: 1, // 4~5인 경우 1cost
    },
    A: {
      used: 0,
      rate: 0,
    },
  },
}
