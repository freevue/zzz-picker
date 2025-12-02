import { passError } from '.'
import { supabase } from '../'
import { pipe } from '@fxts/core'

const QUERY = `
  id,
  nameKo: name_ko,
  version,
  createdAt: created_at
`
async function getAuthKeyList() {
  try {
    return await pipe(
      QUERY,
      async (query) =>
        await supabase
          .from('auth_key')
          .select(query)
          .eq('is_approval', false)
          .lte('expired_at', new Date().toISOString()),
      passError<any>
    )
  } catch {
    return []
  }
}

export default getAuthKeyList
