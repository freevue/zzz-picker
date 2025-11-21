type Source = {
  name: string
  url: string
}
type Image = {
  url: string
  description: string
  sources: Source
}

export type Side = 'A' | 'B'
export type RoundId = 'common' | 'personal' | 'unlimited'
export type AgentId = number
export type EngineId = number
export type BossId = number
export type SelectAgent = AgentId | null
export type SelectBoss = BossId | null
export type RoundSide = {
  time: number
  result: number
  pickList: [SelectAgent, SelectAgent, SelectAgent]
}
export type PlayCostMap = Map<number, CostTable>
export type Rarity = 'S' | 'A' | 'B'
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
export type Boss = {
  id: BossId
  nameKo: string
  hp: Array<number>
  resistance: Array<Attribute>
  weakness: Array<Attribute>
}
export type DeadlyAssault = {
  id: number
  version: number
  open: string
  boss1: Pick<Boss, 'id' | 'nameKo'>
  boss2: Pick<Boss, 'id' | 'nameKo'>
  boss3: Pick<Boss, 'id' | 'nameKo'>
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
export type PlayState = {
  nickname: {
    A: string
    B: string
  }
  banList: Array<SelectAgent>
  common: CommonRound
  personal: PersonalRound
  unlimited: UnlimitedRound
}
export type AgentCostSetting = {
  agentId: AgentId
  engineId: EngineId | null
  agentRate: number
  engineRate: number
}
export type AgentInfo = {
  id: number
  rarity: Rarity
  isTeaser: boolean
  isPickup: boolean
  isAllow: boolean
  color: string
  nameKo: string
  fullNameKo: string | null
}
export type Engine = {
  id: number
  isPickup: boolean
  nameKo: string
  exclusiveAgentId: AgentId
  rank: Rarity
  imageUrl: string
  iconUrl: string
}
export type Attribute = {
  id: number
  nameKo: string
}
export type Agent = {
  id: AgentId
  rarity: Rarity
  isTeaser: boolean
  isPickup: boolean
  isAllow: boolean
  color: string
  nameKo: string
  fullNameKo: string
  banner: Image
  profile: Image
  specialty: {
    id: number
    nameKo: string
  }
  attributes: {
    id: number
    nameKo: string
  }
  engine: Array<Engine>
}
