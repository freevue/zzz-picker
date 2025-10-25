export type Side = 'A' | 'B'
export type SelectAgent = number | null
export type PickState = {
  [key in Side]: [RoundSelectAgentState, RoundSelectAgentState, RoundSelectAgentState]
}
export type PlayState = Map<string, PickState>
export type RoundSelectAgentState = {
  id: SelectAgent
  setting: AgentCostSetting
}
export type Pick = {
  agent: SelectAgent
  cost: number
}
export type PickAgent = [Pick, Pick, Pick]
export type BanAgent = Array<SelectAgent>
export type AllowAgent = Array<number>

export type RoundSide = {
  pick: PickAgent
  score: number
  time: number
}
export type Round = Record<Side, RoundSide>

export type Rarity = 'S' | 'A'
export type AgentImage = {
  square: string
  rectangle: string
  vertical: string
  color: string
  header: string
}
export type Agent = {
  isTeaser: boolean
  isUp: boolean
  name: string
  fullName: string
  id: number
  rarity: Rarity
  images: AgentImage
}

export type URLState = {
  banCount: number
  totalCost: number
  allowAgent: AllowAgent
}

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
