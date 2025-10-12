import type { URLState, CostWeight, CostTable } from '@/types'

export const DEFAULT_PICKS = []

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
    SPick: DEFAULT_COST_WEIGHT,
    SAlways: DEFAULT_COST_WEIGHT,
    AAlways: DEFAULT_COST_WEIGHT,
  },
  engine: {
    SExclusive: DEFAULT_COST_WEIGHT,
    S: DEFAULT_COST_WEIGHT,
    A: DEFAULT_COST_WEIGHT,
  },
}
