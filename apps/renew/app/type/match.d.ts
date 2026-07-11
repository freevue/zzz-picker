import { Role, MatchType, BroadcastEvent } from '@/constant'

export type Player = {
  agents: [null | number, null | number, null | number]
  boss: [null | string, null | string]
  engines: [null | string, null | string, null | string]
  id: string
  matchId: string
  matchType: MatchType
  name: string
  proposeBan: Array<null | string>
  rate: {
    agents: Record<number, number>
    engines: Record<number, number>
  }
  role: Role
  score: number
  selectBan: Array<null | string>
  time: number
  proposeBan: Array<null | string>
  selectBan: Array<null | string>
}

export type BroadcastPayloadMap = {
  [BroadcastEvent.COMMON_BOSS_SELECT]: string
  [BroadcastEvent.FIRST_BAN_SELECT]: Array<number | null>
  [BroadcastEvent.COMMON_BOSS_CONFIRM]: string
  [BroadcastEvent.BOSS_SELECT]: {
    bossId: string
    side: 'A' | 'B'
  }
}

export type Match = Record<Role, Player> & {
  state: {
    ban: [null | string, null | string]
    matchType: MatchType
  }
}
