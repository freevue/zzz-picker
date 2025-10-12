export type Side = 'A' | 'B'
export type SelectAgent = number | null
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

export type CostWeight = {
  used: number
  rate: number
}
export type CostTable = {
  agent: {
    SPick: CostWeight
    SAlways: CostWeight
    AAlways: CostWeight
  }
  engine: {
    SExclusive: CostWeight
    S: CostWeight
    A: CostWeight
  }
}
