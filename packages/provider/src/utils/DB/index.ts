import { isNull, pipe, throwIf } from '@fxts/core'
import type { PostgrestResponse } from '@supabase/supabase-js'

export function passError<T>(payload: PostgrestResponse<T>) {
  return pipe(
    payload,
    throwIf(
      ({ error }) => !isNull(error),
      () => Error('')
    ),
    ({ data }) => data || []
  )
}

export { default as getDeadlyAssaultList } from './getDeadlyAssaultList'
export { default as getBoss } from './getBoss'
export { default as getEngine } from './getEngine'
export { default as getAgent } from './getAgent'
