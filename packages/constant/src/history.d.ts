import type { RoundId, AgentId, BossId, EngineId } from './types'

export type AuthData = {
  createdAt: string
  id: string
  nameKo: string
  version: number
}
export type SelectData = {
  agentId: AgentId
  engineId: EngineId
  agentRate: number
  engineRate: number
  agentNameKo: string
  engineNameKo: string
}
export type PartyData = {
  score: number
  boss: BossData
  select_1: SelectData
  select_2: SelectData
  select_3: SelectData
  elapsedTime: number
}
export type PlayData = {
  aParty: PartyData
  bParty: PartyData
  round_type: RoundId
}
export type BossData = {
  id: BossId
  nameKo: string
}
export type HistoryData = {
  id: number
  aName: string
  bName: string
  machAt: string
  banList: Array<{ agentId: AgentId }>
  playList: Array<PlayData>
}
