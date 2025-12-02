// import { supabase } from '../'
import { isNull, pipe, throwIf } from '@fxts/core'
import type { PostgrestResponse } from '@supabase/supabase-js'

// const from = (table: string) => supabase.from(table)

// type From = ReturnType<typeof from>

// const select =
//   <T extends string, R>(query: T) =>
//   (builder: From) =>
//     builder.select<T, R>(query)

// type Select<T extends string, R> = ReturnType<typeof select<T, R>>

// const eq =
//   <K extends string, V>(column: K, value: V) =>
//   <S, R, Q>(builder: PostgrestFilterBuilder<S, R, Q>) =>
//     builder.eq(column, value)

// function execute<T>(builder: PromiseLike<PostgrestResponse<T>>): Promise<PostgrestResponse<T>> {
//   return Promise.resolve(builder)
// }

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

export { default as QUERY } from './query'
export { default as getDeadlyAssaultList } from './getDeadlyAssaultList'
export { default as getBoss } from './getBoss'
export { default as getEngine } from './getEngine'
export { default as getAgent } from './getAgent'
export { default as postPersonalRound } from './postPersonalRound'
export { default as postAgentSelectLog } from './postAgentSelectLog'
export { default as postCommonRound } from './postCommonRound'
export { default as postUnlimitedRound } from './postUnlimitedRound'
export { default as postPlayLog } from './postPlayLog'
export { default as postPartyLog } from './postPartyLog'
export { default as postMatch } from './postMatch'
export { default as getMatchLog } from './getMatchLog'
export { default as postBanLog } from './postBanLog'
export { default as authCheck } from './authCheck'
export { default as getAuthKey } from './getAuthKey'
export { default as getAuthKeyList } from './getAuthKeyList'
