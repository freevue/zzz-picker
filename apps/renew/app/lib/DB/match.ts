import { TableName } from './constant'
import { PlayerRole, type Player } from '@/type'
import { supabase } from '@zzz-picker/supabase'

export async function selectHostMatch(hostId: string) {
  const { data } = await supabase
    .from(TableName.MATCH)
    .select(
      `matchId: id,
      matchType`
    )
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
    .select<string, Player>(
      `id,
      agent,
      engine,
      boss,
      name,
      proposeBan,
      rate,
      role,
      score,
      selectBan,
      time,
      matchId,
      ...${TableName.MATCH}(matchType)`
    )
    .eq('matchId', matchId)

  if (data === null) throw Error('')

  return data
}

export async function selectMatchPlayerId(playerId: string) {
  const { data } = await supabase
    .from(TableName.PLAY)
    .select<string, Player>(
      `matchId,
      ...${TableName.MATCH}(matchType)`
    )
    .eq('id', playerId)
    .single()

  if (data === null) throw Error('')

  return data
}

export async function updateBoss(playerId: string, boss: [string | null, string | null]) {
  await supabase.from(TableName.PLAY).update({ boss }).eq('id', playerId)

  return ''
}

export async function updateAgent(
  playerId: string,
  agent: Record<number, [number | null, number | null, number | null]>,
  rate: {
    agents: Record<number, number>
    engines: Record<string, number>
  }
) {
  await supabase.from(TableName.PLAY).update({ agent, rate }).eq('id', playerId)

  return ''
}

export async function updateEngine(
  playerId: string,
  engine: Record<number, [string | null, string | null, string | null]>,
  rate: {
    agents: Record<number, number>
    engines: Record<string, number>
  }
) {
  await supabase.from(TableName.PLAY).update({ engine, rate }).eq('id', playerId)

  return ''
}

export async function updateCommonBoss(matchId: string, id: string) {
  await supabase
    .from(TableName.PLAY)
    .update({
      boss: [null, id],
    })
    .eq('matchId', matchId)

  return ''
}

export function updateProposeBan(player: Player) {
  return async (proposeBan: Array<number>) => {
    console.log({ proposeBan })

    await supabase.from(TableName.PLAY).update({ proposeBan }).eq('id', player.id)
  }
}

export function updateSelectBan(player: Player) {
  return async (selectBan: Array<number>) => {
    await supabase.from(TableName.PLAY).update({ selectBan }).eq('id', player.id)
  }
}

export function updateScore(id: string, role: PlayerRole) {
  return async (score: Array<number>) => {
    const data = await supabase
      .from(TableName.PLAY)
      .update({ score })
      .eq('matchId', id)
      .eq('role', role)
      .select()

    console.log(data)
  }
}
