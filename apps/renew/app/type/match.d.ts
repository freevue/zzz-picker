import { Role, MatchType, BroadcastEvent } from '@/constant'

export type Player = {
  agent: Record<number, [null | number, null | number, null | number]>
  engine: Record<number, [null | string, null | string, null | string]>
  boss: [null | string, null | string]
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
  [BroadcastEvent.COMMON_BOSS_CONFIRM]: {
    bossId: string
    playerId: string
  }
  [BroadcastEvent.BAN_SELECT]: Array<number | null>
  [BroadcastEvent.BAN_FIX]: Array<number | null>
  [BroadcastEvent.BOSS_SELECT]: {
    bossId: string
    round: number
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
  [BroadcastEvent.AGENT_PICK]: {
    index: number
    round: number
    role: Role.A_SIDE | Role.B_SIDE
    agentId: number | null
  }
  [BroadcastEvent.AGENT_RATE]: {
    role: Role.A_SIDE | Role.B_SIDE
    agentId: number
    rate: number
  }
  [BroadcastEvent.ENGINE_PICK]: {
    index: number
    round: number
    role: Role.A_SIDE | Role.B_SIDE
    engineId: string | null
  }
  [BroadcastEvent.ENGINE_RATE]: {
    role: Role.A_SIDE | Role.B_SIDE
    engineId: string
    rate: number
  }
}

export type Match = Record<Role, Player> & {
  state: {
    ban: [null | string, null | string]
    matchType: MatchType
  }
}

export type PlayerRole = Role.A_SIDE | Role.B_SIDE
