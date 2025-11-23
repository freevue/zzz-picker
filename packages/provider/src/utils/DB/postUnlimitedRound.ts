import { passError, postAgentSelectLog, postPartyLog } from '.'
import { supabase } from '../'
import { includes, isNull, map, pipe, toArray, toAsync, zip } from '@fxts/core'
import {
  ROUND_TYPE,
  type PlayState,
  type AgentCostSetting,
  type SelectAgent,
  type Side,
} from '@zzz-picker/constant'

type Cost = {
  A: Array<[number, AgentCostSetting]>
  B: Array<[number, AgentCostSetting]>
}
type PickList = [SelectAgent, SelectAgent, SelectAgent]

async function postUnlimitedRound({ unlimited }: PlayState, cost: Cost) {
  if (isNull(unlimited.A.boss) || isNull(unlimited.B.boss)) return null
  if (includes(null, unlimited.A.pickList) || includes(null, unlimited.B.pickList)) return null

  try {
    return await pipe(
      [
        [unlimited.A.pickList, cost.A] as [PickList, Cost['A']],
        [unlimited.B.pickList, cost.B] as [PickList, Cost['B']],
      ],
      toAsync,
      map(async ([pickList, cost]) => await postAgentSelectLog(pickList, cost)),
      zip(['A', 'B'] as [Side, Side]),
      map(([side, [select_1, select_2, select_3]]) => ({
        select_1,
        select_2,
        select_3,
        boss_id: unlimited[side].boss,
        score: unlimited[side].result,
        elapsed_time: unlimited[side].time,
      })),
      map(postPartyLog),
      toArray,
      ([a_party_id, b_party_id]) => ({ a_party_id, b_party_id, round_type: ROUND_TYPE.COMMON }),
      async (data) => await supabase.from('round_log').insert(data).select('id'),
      passError<{ id: number }>,
      ([{ id }]) => id
    )
  } catch (error) {
    throw error
  }
}

export default postUnlimitedRound
