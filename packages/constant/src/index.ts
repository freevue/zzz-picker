import type { CostWeight, CostTable, RoundSide, PlayState } from './types.d'
import { pipe, range, map, toArray } from '@fxts/core'

export * from './types.d'

export const DEFAULT = {
  PRETTY_AGENT_ID: 156728,
  COST_BONUS_RATE: 0.05,
  TIME_BONUS: 333,
  BAN_COUNT: 2,
  TOTAL_COST: 24,
  MAX_SCORE: 70_000,
  ROUNDE_SIDE: {
    time: 0,
    result: 0,
    pickList: [null, null, null],
  } as RoundSide,
  COST_TABLE: {
    sPickAgent: { used: 1, rate: 1 },
    sAlwaysAgent: { used: 0, rate: 0 },
    aAlwaysAgent: { used: 0, rate: 0 },
    sExclusiveEngine: { used: 1, rate: 0.5 },
    sEngine: { used: 0, rate: 1 },
    aEngine: { used: 0, rate: 0 },
  } as CostTable,
}
export enum SOCKET_EVENT {
  MESSAGE = 'message',
  SYNC = 'sync',
  PICK = 'pick',
  UNPICK = 'unpick',
  BAN = 'ban',
  UNBAN = 'unban',
  JOIN = 'join',
}
export enum ROUND_TYPE {
  PERSONAL = 'personal',
  COMMON = 'common',
  UNLIMITED = 'unlimited',
}
export const DEFAULT_PLAY_STATE: PlayState = {
  nickname: {
    A: '',
    B: '',
  },
  banList: pipe(
    DEFAULT.BAN_COUNT,
    range,
    map(() => null),
    toArray
  ),
  common: {
    key: ROUND_TYPE.COMMON,
    title: '공용 무대',
    boss: null,
    A: DEFAULT.ROUNDE_SIDE,
    B: DEFAULT.ROUNDE_SIDE,
  },
  personal: {
    key: ROUND_TYPE.PERSONAL,
    title: '개인 무대',
    A: { ...DEFAULT.ROUNDE_SIDE, boss: null },
    B: { ...DEFAULT.ROUNDE_SIDE, boss: null },
  },
  unlimited: {
    key: ROUND_TYPE.UNLIMITED,
    title: '개인 무대',
    A: { ...DEFAULT.ROUNDE_SIDE, boss: null },
    B: { ...DEFAULT.ROUNDE_SIDE, boss: null },
  },
}

export const PRETTY_AGENT_ID = 156728
export const DEFAULT_COST_RATE = 0.05
export const DEFAULT_TIME_BONUS = 333
export const DEFAULT_COST_WEIGHT: CostWeight = {
  used: 0,
  rate: 0,
}

export const STORAGE_KEY = 'zzz-picker-play'
