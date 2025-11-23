import { passError } from '.'
import { supabase } from '../'
import { fromEntries, map, pipe, toArray } from '@fxts/core'
import { type AgentCostSetting, type AgentId, type SelectAgent } from '@zzz-picker/constant'

type PickList = [SelectAgent, SelectAgent, SelectAgent]

async function postAgentSelectLog(pickList: PickList, cost: Array<[number, AgentCostSetting]>) {
  try {
    const costData = pipe(cost, fromEntries)

    return await pipe(
      pickList,
      map((agentId) => costData[agentId as AgentId]),
      map(({ agentId, agentRate, engineId, engineRate }) => ({
        agent_id: agentId,
        agent_rate: agentRate,
        engine_id: engineId,
        engine_rate: engineRate,
      })),
      toArray,
      async (list) => await supabase.from('agent_select_log').insert(list).select('id'),
      passError<{ id: number }>,
      ([{ id: id_1 }, { id: id_2 }, { id: id_3 }]) => [id_1, id_2, id_3] as [number, number, number]
    )
  } catch {
    throw new Error('캐릭터 선택 로그 저장 실패')
  }
}

export default postAgentSelectLog
