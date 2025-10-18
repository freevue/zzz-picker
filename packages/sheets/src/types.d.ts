export type Agent = {
  hoyolabId: null | number
  naverChzzkId: null | string
  zzzId: number
  hoyowikiId: null | number
  nameKo: string
  fullNameKo: string
  nameEn: null | string
  fullNameEn: null | string
  rarity: 'A' | 'S'
  isPickup: boolean
  isTeaser: boolean
  isUp: boolean
  rateCost: null | number
  sExclusiveEngineCost: null | number
  sGeneralEngineCost: null | number
  aGeneralEngineCost: null | number
  color: null | string
  chzzkSquareImage: null | string
  chzzkBannerImage: null | string
  zzzBannerImage: string
  labSquareImage: null | string
  labVerticalImage: null | string
}

export type Boss = {
  bossId: number
  nameKo: null | string
  fullNameKo: string
  nameEn: null | string
  fullNameEn: string
  image: string
}

export type DeadlyAssault = {
  date: string
  version: string
  boss1: number
  boss2: number
  boss3: number
}
