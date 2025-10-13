import type { URLState, CostWeight, CostTable } from '@/types'

export const DEFAULT_PICKS = []

export const DEFAULT_COST_RATE = 0.05

export const DEFAULT_URL_STATE: URLState = {
  banCount: 2,
  totalCost: 20,
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
      rate: 1,
    },
    S: {
      ...DEFAULT_COST_WEIGHT,
      used: 1,
      rate: 0,
    },
    A: DEFAULT_COST_WEIGHT,
  },
}
