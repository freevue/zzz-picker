import { TableName } from './constant'
import { type Player } from '@/type'
import { supabase } from '@zzz-picker/supabase'

export async function selectMath(id: string) {
  const { data } = await supabase
    .from(TableName.PLAY)
    .select<string, Player>(
      `id,
      agents,
      boss,
      engines,
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
    .eq('matchId', id)

  if (data === null) throw Error('')

  return data
}

export async function selectMatchPlayer(id: string) {
  const { data } = await supabase
    .from(TableName.PLAY)
    .select<string, Player>(
      `id,
      agents,
      boss,
      engines,
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

export async function updateCommonBoss(player: Player, id: string) {
  await supabase
    .from(TableName.PLAY)
    .update({
      boss: [null, id],
    })
    .eq('id', player.id)
}
