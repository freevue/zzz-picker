import { TableName } from './constant'
import type { Match, PlayerRole, Player, AgentSlot, EngineSlot } from '@/type'
import { every, flatMap, isNumber, pipe } from '@fxts/core'
import { supabase } from '@zzz-picker/supabase'
import { MatchType, Phase, Role } from '~/constant'

export async function selectHostMatch(hostId: string) {
  const { data } = await supabase
    .from(TableName.MATCH)
    .select<string, Match>(`matchId: id, matchType, phase`)
    .eq('hostId', hostId)

  return data?.[0]
}

export async function selectMatchHost(matchId: string) {
  const { data } = await supabase
    .from(TableName.MATCH)
    .select<string, { hostId: string }>('hostId')
    .eq('id', matchId)
    .single()

  if (data === null) throw Error('')

  return data
}

export async function selectMatchPlayer(matchId: string) {
  const { data } = await supabase
    .from(TableName.PLAY)
    .select<string, Player>('*')
    .eq('matchId', matchId)

  if (data === null) throw Error('')

  return data
}

export async function selectMatchPlayerId(playerId: string) {
  const { data } = await supabase
    .from(TableName.PLAY)
    .select<string, Match>(`matchId, ...${TableName.MATCH}(matchType, phase)`)
    .eq('id', playerId)

  if (data === null) throw Error('')

  return data?.[0]
}

export function updateBoss(playerId: string) {
  return async (boss: [string | null, string | null]) => {
    const { data } = await supabase
      .from(TableName.PLAY)
      .update({ boss })
      .eq('id', playerId)
      .select<string, Player>('*')

    if (data === null) throw Error('')

    return data
  }
}

export function updateAgent(id: string) {
  return async (agentSlot: Array<Array<AgentSlot>>) => {
    const { data } = await supabase
      .from(TableName.PLAY)
      .update({ agentSlot })
      .eq('id', id)
      .select<string, Player>('*')

    if (data === null) throw Error('')

    return data
  }
}

export function updateEngine(id: string) {
  return async (engineSlot: Array<Array<EngineSlot>>) => {
    const { data } = await supabase
      .from(TableName.PLAY)
      .update({ engineSlot })
      .eq('id', id)
      .select<string, Player>('*')

    if (data === null) throw Error('')

    return data
  }
}

export function updateCommonBoss(matchId: string) {
  return async (id: string) => {
    const { data } = await supabase
      .from(TableName.PLAY)
      .update({ boss: [null, id] })
      .eq('matchId', matchId)
      .select<string, Player>('*')

    if (data === null) throw Error('')

    await pipe(Phase.BAN, updateMatchPhase(matchId))

    return data
  }
}

export function updateProposeBan(id: string) {
  return async (proposeBan: Array<number>) => {
    const { data } = await supabase
      .from(TableName.PLAY)
      .update({ proposeBan })
      .eq('id', id)
      .select<string, Player>('*')

    if (data === null) throw Error('')

    return data
  }
}

export function updateSelectBan(id: string) {
  return async (selectBan: Array<number>) => {
    const { data } = await supabase
      .from(TableName.PLAY)
      .update({ selectBan })
      .eq('id', id)
      .select<string, Player>('*')

    if (data === null) throw Error('')

    return data
  }
}

export function updateMatchPhase(id: string) {
  return async (phase: Phase) => {
    const { data } = await supabase
      .from(TableName.MATCH)
      .update({ phase })
      .eq('id', id)
      .select<string, Match>('*')
      .single()

    if (data === null) throw Error('')

    return data
  }
}

export function updateScore(id: string) {
  return async (score: Array<number>) => {
    const { data } = await supabase
      .from(TableName.PLAY)
      .update({ score })
      .eq('id', id)
      .select<string, Player>('*')

    if (data === null) throw Error('')

    return data
  }
}

export async function insertMatch(matchType: MatchType) {
  const { data } = await supabase
    .from(TableName.MATCH)
    .insert({
      matchType,
      phase: matchType === MatchType.UNLIMITED ? Phase.PICK : Phase.COMMON_BOSS_SELECT,
    })
    .select()
    .single()

  return data
}

export function insertPlayer(matchId: string) {
  return async ({ role, name }: { role: Role; name: string }) => {
    const { data } = await supabase
      .from(TableName.PLAY)
      .insert({ matchId, role, name })
      .select()
      .single()

    return data
  }
}
