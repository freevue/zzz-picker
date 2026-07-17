import { Specialty } from '@/constant'

export type Agent = {
  banner: string
  fullNameKo: string
  id: number
  nameKo: string
  profile: string
  color: string | null
  isPickup: boolean
  isAllow: boolean
  rarity: 'A' | 'S'
  attribute: {
    nameKo: string
    src: string
  }
  specialty: {
    nameKo: (typeof Specialty)[keyof typeof Specialty]
    src: string
  }
}
