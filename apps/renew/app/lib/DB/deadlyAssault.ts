import { TableName } from './constant'
import { BossType, ErrorMessage } from '@/constant'
import { type Boss } from '@/type'
import { filter, find, isUndefined, pipe } from '@fxts/core'
import { supabase } from '@zzz-picker/supabase'

export async function selectDeadlyAssault(): Promise<Array<Boss>> {
  const { data } = await supabase
    .from(TableName.DEADLY_ASSAULT)
    .select(
      `list: ${TableName.DEADLY_BOSS}(
        type,
        ...${TableName.BOSS}(
          id,
          nameKo,
          ...${TableName.IMAGE}(src)
        )
      )`
    )
    .lte('createdAt', new Date().toISOString())
    .order('createdAt', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (data === null) throw Error(ErrorMessage.SELECT_DEADLY_ASSAULT_ERROR)

  return data.list
}

export async function selectAdversityBoss(): Promise<Boss> {
  const data = await pipe(
    selectDeadlyAssault(),
    find((boss) => boss.type === BossType.ADVERSITY)
  )

  if (isUndefined(data)) throw Error(ErrorMessage.SELECT_DEADLY_ASSAULT_ERROR)

  return data
}

// null, "f7102ee9-0b5e-4140-808d-0614cb8d4103"
