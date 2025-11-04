export type Side = 'A' | 'B'
export type RoundId = 'common' | 'personal' | 'unlimited'
export type AgentId = number
export type BossId = number
export type SelectAgent = AgentId | null
export type SelectBoss = BossId | null
export type RoundSide = {
  time: number
  result: number
  pickList: [SelectAgent, SelectAgent, SelectAgent]
}
export type PlayCostMap = Map<number, CostTable>
export type Rarity = 'S' | 'A'
export type AgentCostType = 'sPickAgent' | 'sAlwaysAgent' | 'aAlwaysAgent'
export type EngineCostType = 'sExclusiveEngine' | 'sEngine' | 'aEngine'
export type CostWeight = {
  used: number
  rate: number
}
export type CostTable = {
  sPickAgent: CostWeight
  sAlwaysAgent: CostWeight
  aAlwaysAgent: CostWeight
  sExclusiveEngine: CostWeight
  sEngine: CostWeight
  aEngine: CostWeight
}
export type DeadlyAssault = {
  version: number
  openAt: string
  boss1: number
  boss2: number
  boss3: number
}
export type CommonRound = {
  key: 'common'
  title: string
  boss: SelectBoss
} & Record<Side, RoundSide>
export type PersonalRound = {
  key: 'personal'
  title: string
} & Record<Side, RoundSide & { boss: SelectBoss }>
export type UnlimitedRound = Omit<PersonalRound, 'key'> & {
  key: 'unlimited'
}

// ---
export type Boss = {
  isOpen: boolean
  name: string
  images: {
    rectangle: string
  }
}

export type AgentCostSetting = {
  rarity: AgentCostType
  agentRate: number
  engineType: EngineCostType | null
  engineRate: number
}
