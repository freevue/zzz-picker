export const BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets'
export const NAVER_GAME_API_URL =
  'https://comm-api.game.naver.com/nng_main/v1/game/db/character/GM_NCR_007033/dataType/photo?offset=0&limit=70'
export const HOYOVERSE_ZZZ_API_URL =
  'https://sg-public-api-static.hoyoverse.com/content_v2_user/app/3e9196a4b9274bd7/getContentList?iPageSize=200&iPage=1&iChanId=287&sLangKey=ko-kr'
export const NAVER_CHZZK_API_URL =
  'https://comm-api.game.naver.com/nng_main/v1/game/db/character/objectId'

export const API_KEY = process.env.GOOGLE_API_KEY!
export const SHEET_ID = process.env.GOOGLE_SHEET_ID!

export enum SHEET_RANGE {
  AGENT = 'agent!B3:W100',
  BOSS = 'boss!B3:50',
  DEADLY_ASSAULT = 'deadly_assault_history!B3:50',
}

export enum AGENT_KEY {
  HOYOLAB_ID = 'hoyolabId',
  NAVER_CHZZK_ID = 'naverChzzkId',
  ZZZ_ID = 'zzzId',
  HOYOWIKI_ID = 'hoyowikiId',
  NAME_KO = 'nameKo',
  FULL_NAME_KO = 'fullNameKo',
  NAME_EN = 'nameEn',
  FULL_NAME_EN = 'fullNameEn',
  RARITY = 'rarity',
  IS_PICKUP = 'isPickup',
  IS_TEASER = 'isTeaser',
  IS_UP = 'isUp',
  RATE_COST = 'rateCost',
  S_EXCLUSIVE_ENGINE_COST = 'sExclusiveEngineCost',
  S_GENERAL_ENGINE_COST = 'sGeneralEngineCost',
  A_GENERAL_ENGINE_COST = 'aGeneralEngineCost',
  COLOR = 'color',
  CHZZK_SQUARE_IMAGE = 'chzzkSquareImage',
  CHZZK_BANNER_IMAGE = 'chzzkBannerImage',
  ZZZ_BANNER_IMAGE = 'zzzBannerImage',
  LAB_SQUARE_IMAGE = 'labSquareImage',
  LAB_VERTICAL_IMAGE = 'labVerticalImage',
}

export enum BOSS_KEY {
  BOSS_ID = 'bossId',
  NAME_KO = 'nameKo',
  FULL_NAME_KO = 'fullNameKo',
  NAME_EN = 'nameEn',
  FULL_NAME_EN = 'fullNameEn',
  IMAGE = 'image',
  WEAKNESS = 'weakness',
  RESISTANCE = 'resistance',
}

export enum DEADLY_ASSAULT_KEY {
  DATE = 'date',
  VERSION = 'version',
  BOSS_1 = 'boss1',
  BOSS_2 = 'boss2',
  BOSS_3 = 'boss3',
}
