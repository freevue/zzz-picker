export type Agent = {
  banner: string
  fullNameKo: string
  id: number
  nameKo: string
  profile: string
  color: string | null
  isPickup: boolean
  attribute: {
    nameKo: string
    src: string
  }
  specialty: {
    nameKo: string
    src: string
  }
}
