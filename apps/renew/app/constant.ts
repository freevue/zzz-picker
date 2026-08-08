export const SETTING = {
  MAX_PLAYER_BAN_PROPOSE: 2,
  MAX_PLAYER_BAN_FIX: 1,
  MINUS_RATE: 0.025,
}

export enum BossType {
  TRIAL = 'trial',
  ADVERSITY = 'adversity',
}

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
  BAN_SELECT = 'banSelect',
  BAN_PROPOSE = 'banPropose',
  BAN_FIX = 'banFix',
  BAN_CONFIRM = 'banConfirm',
  AGENT_PICK = 'agentPick',
  ENGINE_PICK = 'enginePick',
  SCORE = 'score',
  TIME = 'time',
  MATCH_TYPE = 'matchType',
}

export enum Phase {
  COMMON_BOSS_SELECT = BroadcastEvent.COMMON_BOSS_SELECT,
  BAN = 'ban',
  BAN_FIX = 'banFix',
  PICK = 'pick',
}

export enum MatchType {
  ORIGINAL = 'original',
  LEGEND = 'legend',
  UNLIMITED = 'unlimited',
}

export enum Specialty {
  SUPPORT = '지원',
  ATTACK = '강공',
  RUPTURE = '명파',
  STUN = '격파',
  ANOMALY = '이상',
  DEFENSE = '방어',
}

export const DEALER = [Specialty.ATTACK, Specialty.RUPTURE, Specialty.ANOMALY]
export const SUPPORT = [Specialty.SUPPORT, Specialty.STUN, Specialty.DEFENSE]

export enum Position {
  DEALER = 'dealer',
  SUPPORT = 'support',
}
