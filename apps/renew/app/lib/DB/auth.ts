import { TableName } from './constant'
import { supabase } from '@zzz-picker/supabase'

export async function selectValidAuthKey(id: string) {
  const { data } = await supabase
    .from(TableName.AUTH_KEY)
    .select('isApproval: is_approval')
    .eq('id', id)
    .single()

  if (data === null) throw Error('')

  return data
}
