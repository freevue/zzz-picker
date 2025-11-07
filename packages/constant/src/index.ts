import type { AgentCostSetting, CostWeight, CostTable, RoundSide } from './types.d'

export const DEFAULT_AGENT_COST_STATE: AgentCostSetting = {
  rarity: 'aAlwaysAgent',
  agentRate: 0,
  engineType: 'sExclusiveEngine',
  engineRate: 0,
}

export * from './types.d'

export const DEFAULT = {
  PRETTY_AGENT_ID: 156728,
  COST_BONUS_RATE: 0.05,
  TIME_BONUS: 333,
  BAN_COUNT: 2,
  TOTAL_COST: 24,
  MAX_SCORE: 70_000,
  ROUNDE_SIDE: {
    time: 0,
    result: 0,
    pickList: [null, null, null],
  } as RoundSide,
  COST_TABLE: {
    sPickAgent: { used: 1, rate: 1 },
    sAlwaysAgent: { used: 0, rate: 0 },
    aAlwaysAgent: { used: 0, rate: 0 },
    sExclusiveEngine: { used: 1, rate: 0.5 },
    sEngine: { used: 0, rate: 1 },
    aEngine: { used: 0, rate: 0 },
  } as CostTable,
}

export const PRETTY_AGENT_ID = 156728
export const DEFAULT_COST_RATE = 0.05
export const DEFAULT_TIME_BONUS = 333
export const DEFAULT_COST_WEIGHT: CostWeight = {
  used: 0,
  rate: 0,
}

export const STORAGE_KEY = 'zzz-picker-play'
