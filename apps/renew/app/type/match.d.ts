import { Role, MatchType, BroadcastEvent } from '@/constant'

export type Player = {
  agents: [null | number, null | number, null | number]
  boss: [null | string, null | string]
  engines: [null | string, null | string, null | string]
  id: string
  matchId: string
  matchType: MatchType
  name: string
  proposeBan: Array<null | number>
  selectBan: Array<null | number>
  rate: {
    agents: Record<number, number>
    engines: Record<string, number>
  }
  role: Role
  score: number
  time: number
}

export type BroadcastPayloadMap = {
  [BroadcastEvent.COMMON_BOSS_SELECT]: string
  [BroadcastEvent.COMMON_BOSS_CONFIRM]: string
  [BroadcastEvent.BAN_SELECT]: Array<number | null>
  [BroadcastEvent.BAN_FIX]: Array<number | null>
  [BroadcastEvent.BOSS_SELECT]: {
    bossId: string
    side: Role.A_SIDE | Role.B_SIDE
  }
  [BroadcastEvent.BAN_PROPOSE]: {
    list: Array<number | null>
    role: Role.A_SIDE | Role.B_SIDE
  }
  [BroadcastEvent.BAN_CONFIRM]: {
    list: Array<number | null>
    role: Role.A_SIDE | Role.B_SIDE
  }
}

export type Match = Record<Role, Player> & {
  state: {
    ban: [null | string, null | string]
    matchType: MatchType
  }
}

export type PlayerRole = Role.A_SIDE | Role.B_SIDE
