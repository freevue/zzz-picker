import type { URLState, CostWeight, CostTable, AgentCostSetting } from '@/types'

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
      ...DEFAULT_COST_WEIGHT,
      used: 1,
      rate: 1,
    },
    SAlways: {
      ...DEFAULT_COST_WEIGHT,
      used: 1,
    },
    AAlways: DEFAULT_COST_WEIGHT,
  },
  engine: {
    SExclusive: {
      ...DEFAULT_COST_WEIGHT,
      used: 1,
      rate: 0.5,
    },
    S: {
      ...DEFAULT_COST_WEIGHT,
      used: 0,
      rate: 1,
    },
    A: DEFAULT_COST_WEIGHT,
  },
}
