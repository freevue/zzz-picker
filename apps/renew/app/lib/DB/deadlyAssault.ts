import { TableName } from './constant'
import { ErrorMessage } from '@/constant'
import { type Boss } from '@/type'
import { supabase } from '@zzz-picker/supabase'

export async function selectDeadlyAssault(): Promise<Array<Boss>> {
  const { data } = await supabase
    .from(TableName.DEADLY_ASSAULT)
    .select(
      `list: ${TableName.DEADLY_BOSS}(
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

// null, "f7102ee9-0b5e-4140-808d-0614cb8d4103"
