import { passError } from '.'
import { supabase } from '../'
import { pipe } from '@fxts/core'

async function authCheck(password: string): Promise<boolean> {
  try {
    return await pipe(
      password,
      async (password) => await supabase.from('auth_key').select('is_approval').eq('id', password),
      passError<{ is_approval: boolean }>,
      ([{ is_approval }]) => is_approval
    )
  } catch {
    return false
  }
}

export default authCheck
