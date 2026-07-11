export enum ErrorMessage {
  SELECT_DEADLY_ASSAULT_ERROR = '강습전 데이터를 불러오는 과정에 에러가 발생했습니다.',
}

export enum Role {
  HOST = 'H',
  A_SIDE = 'A',
  B_SIDE = 'B',
}

export enum BroadcastEvent {
  COMMON_BOSS_SELECT = 'commonBossSelect',
  COMMON_BOSS_CONFIRM = 'commonBossConfirm',
  BOSS_SELECT = 'bossSelect',
  FIRST_BAN_SELECT = 'firstBanSelect',
}

export enum Phase {
  COMMON_BOSS_SELECT = BroadcastEvent.COMMON_BOSS_SELECT,
  BAN = 'ban',
  PICK = 'pick',
}

export enum MatchType {
  ORIGINAL = 'original',
  LEGEND = 'legend',
  UNLIMITED = 'unlimited',
}
