export type EngineCost = {
  engineId: string
  rate: number
  cost: number
}

export type Engine = {
  id: string
  rank: 'B' | 'A' | 'S'
  banner: string
  fullNameKo: string
  nameKo: string
  exclusiveAgentId: number | null
  isPickup: boolean
  isAllow: boolean
  isTeaser: boolean
  banner: string
  icon: string
  cost: Array<EngineCost>
}
