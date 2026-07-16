import { TableName } from './constant'
import { type Player } from '@/type'
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

export async function selectMath(matchId: string) {
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

export async function selectMatchPlayer(id: string) {
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
    .eq('id', id)
    .single()

  if (data === null) throw Error('')

  return data
}

export async function selectMatchId(playerId: string) {
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

export async function updateCommonBoss(player: Player, id: string) {
  await supabase
    .from(TableName.PLAY)
    .update({
      boss: [null, id],
    })
    .eq('id', player.id)

  return ''
}

export function updateProposeBan(player: Player) {
  return async (proposeBan: Array<number>) => {
    await supabase.from(TableName.PLAY).update({ proposeBan }).eq('id', player.id)
  }
}

export function updateSelectBan(player: Player) {
  return async (selectBan: Array<number>) => {
    await supabase.from(TableName.PLAY).update({ selectBan }).eq('id', player.id)
  }
}
