import type { Rarity, AgentId, BossId } from '@zzz-picker/constant'

type Attribute = {
  id: number
  nameKo: string
}
type Source = {
  name: string
  url: string
}
type Image = {
  url: string
  description: string
  sources: Source
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
  boss1: Pick<Boss, 'id', 'nameKo'>
  boss2: Pick<Boss, 'id', 'nameKo'>
  boss3: Pick<Boss, 'id', 'nameKo'>
}
export type Engine = {
  id: number
  nameKo: string
  exclusiveAgentId: AgentId
  rank: Rarity
  imageUrl: string
  iconUrl: string
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
