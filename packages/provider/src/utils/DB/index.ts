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
export { default as postPersonalRound } from './postPersonalRound'
export { default as postAgentSelectLog } from './postAgentSelectLog'
export { default as postCommonRound } from './postCommonRound'
export { default as postUnlimitedRound } from './postUnlimitedRound'
export { default as postPlayLog } from './postPlayLog'
export { default as postPartyLog } from './postPartyLog'
export { default as postMatch } from './postMatch'
export { default as getMatchLog } from './getMatchLog'
