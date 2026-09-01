import { Role, MatchType, BroadcastEvent } from '@/constant'

export type AgentSlot = {
  id: number
  rate: number
}
export type EngineSlot = {
  id: string
  rate: number
}

export type Match = {
  matchType: MatchType
  matchId: string
  phase: Phase
}

export type Player = {
  agentSlot: Array<Array<AgentSlot>>
  engineSlot: Array<Array<EngineSlot>>
  boss: [null | string, null | string]
  id: string
  name: string
  proposeBan: Array<null | number>
  selectBan: Array<null | number>
  role: Role
  score: Array<number>
  time: Array<number>
  isConnected: boolean
}

export type BroadcastPayloadMap = {
  [BroadcastEvent.COMMON_BOSS_SELECT]: string
  [BroadcastEvent.COMMON_BOSS_CONFIRM]: Record<PlayerRole, Player>
  [BroadcastEvent.BAN_SELECT]: Array<number | null>
  [BroadcastEvent.BAN_PROPOSE]: Record<PlayerRole, Player>
  [BroadcastEvent.BAN_FIX]: Array<number | null>
  [BroadcastEvent.BAN_CONFIRM]: Record<PlayerRole, Player>
  [BroadcastEvent.BOSS_SELECT]: Record<PlayerRole, Player>
  [BroadcastEvent.AGENT_PICK]: Record<PlayerRole, Player>
  [BroadcastEvent.ENGINE_PICK]: Record<PlayerRole, Player>
  [BroadcastEvent.SCORE]: Record<PlayerRole, Player>
  [BroadcastEvent.TIME]: Record<PlayerRole, Player>
  [BroadcastEvent.MATCH_TYPE]: Match
}

export type Match = Record<Role, Player> & {
  state: {
    ban: [null | string, null | string]
    matchType: MatchType
  }
}

export type PlayerRole = Role.A_SIDE | Role.B_SIDE
