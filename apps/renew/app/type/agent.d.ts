import { Specialty } from '@/constant'

export type AgentCost = {
  agentId: number
  rate: number
  cost: number
}

export type Agent = {
  banner: string
  fullNameKo: string
  id: number
  nameKo: string
  profile: string
  color: string | null
  isPickup: boolean
  isAllow: boolean
  isTeaser: boolean
  rarity: 'A' | 'S'
  attribute: {
    nameKo: string
    src: string
  }
  cost: Array<Cost>
  specialty: {
    nameKo: (typeof Specialty)[keyof typeof Specialty]
    src: string
  }
}
