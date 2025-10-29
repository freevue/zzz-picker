export type Side = 'A' | 'B'
export type SelectAgent = number | null
export type SelectBoss = number | null
export type RoundSide = {
  boss: SelectBoss
  time: number
  result: number
  pickList: [SelectAgent, SelectAgent, SelectAgent]
}
export type PlayRound = Record<Side, RoundSide>
export type PlayCostMap = Map<number, CostTable>

export type Rarity = 'S' | 'A'

export type AgentCostType = 'SPick' | 'SAlways' | 'AAlways'
export type EngineCostType = 'SExclusive' | 'S' | 'A'
export type CostWeight = {
  used: number
  rate: number
}
export type CostTable = {
  agent: {
    [key in AgentCostType]: CostWeight
  }
  engine: {
    [key in EngineCostType]: CostWeight
  }
}

export type Boss = {
  isOpen: boolean
  name: string
  images: {
    rectangle: string
  }
}

export type AgentCostSetting = {
  pickup: AgentCostType
  agentRate: number
  engineType: EngineCostType | null
  engineRate: number
}
