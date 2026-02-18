import { PickPhase } from '@zzz-picker/components/realtime'
import {
  type Side,
  type RoomState,
  type AgentCostSetting,
  GAME_TYPE,
  SOCKET_EVENT,
} from '@zzz-picker/constant'
import { useSocket, useStore, useSetting } from '@zzz-picker/provider/hooks'
import { getTotalCost } from '@zzz-picker/utils'
import { useMemo } from 'react'

type Props = {
  role: Side | 'H'
  room: RoomState
  gameType?: GAME_TYPE
  onUpdate: (data: RoomState) => void
}

const Pick: React.FC<Props> = (props) => {
  const { send } = useSocket()
  const { agents, engines } = useStore()
  const { costTable } = useSetting()
  const side = props.role === 'H' ? 'A' : props.role

  const pickList = {
    personal: props.room.play.personal[side].pickList,
    common: props.room.play.common[side].pickList,
  }

  const pickCost = {
    personal: props.room.play.personal[side].pickCost || [null, null, null],
    common: props.room.play.common[side].pickCost || [null, null, null],
  }

  const boss = {
    personal: props.room.play.personal[side].boss,
    common: props.room.play.common.boss,
  }

  const banList = props.room.play.banList

  // 각 슬롯의 Cost 계산
  const slotCosts = useMemo(() => {
    const calcRoundCosts = (roundKey: 'personal' | 'common'): [number, number, number] => {
      const pickList = props.room.play[roundKey][side].pickList
      const pickCost = props.room.play[roundKey][side].pickCost || [null, null, null]
      return pickList.map((agentId: number | null, index: number) => {
        const costSetting = pickCost[index]
        if (!agentId || !costSetting) return 0
        const agent = agents.get(agentId)
        const engine = costSetting.engineId ? engines.get(costSetting.engineId) : undefined
        return getTotalCost(costTable, [costSetting, agent, engine])
      }) as [number, number, number]
    }
    return {
      personal: calcRoundCosts('personal'),
      common: calcRoundCosts('common'),
    }
  }, [props.room.play, side, agents, engines, costTable])

  const onSelectAgent = (round: 'personal' | 'common', index: number, agentId: number) => {
    const roundKey = round === 'personal' ? 'personal' : 'common'
    const prevPickList = [...props.room.play[roundKey][side].pickList] as [
      number | null,
      number | null,
      number | null,
    ]
    prevPickList[index] = agentId || null

    // pickCost도 함께 업데이트 (기본값 세팅)
    const prevPickCost = [...(props.room.play[roundKey][side].pickCost || [null, null, null])] as [
      AgentCostSetting | null,
      AgentCostSetting | null,
      AgentCostSetting | null,
    ]
    if (agentId) {
      prevPickCost[index] = {
        agentId,
        engineId: null,
        agentRate: 0,
        engineRate: 1,
      }
    }

    send(SOCKET_EVENT.PICK, {
      side,
      roundKey,
      pickList: prevPickList,
      pickCost: prevPickCost,
    })
  }

  const onRemoveAgent = (round: 'personal' | 'common', index: number) => {
    const roundKey = round === 'personal' ? 'personal' : 'common'
    const prevPickList = [...props.room.play[roundKey][side].pickList] as [
      number | null,
      number | null,
      number | null,
    ]
    prevPickList[index] = null

    const prevPickCost = [...(props.room.play[roundKey][side].pickCost || [null, null, null])] as [
      AgentCostSetting | null,
      AgentCostSetting | null,
      AgentCostSetting | null,
    ]
    prevPickCost[index] = null

    send(SOCKET_EVENT.PICK, {
      side,
      roundKey,
      pickList: prevPickList,
      pickCost: prevPickCost,
    })
  }

  const onSelectBoss = (round: 'personal' | 'common', bossId: number) => {
    const roundKey = round === 'personal' ? 'personal' : 'common'
    // Boss 선택은 SOCKET_EVENT.BOSS를 사용할 수도 있지만, Pick Phase 내에서의 동작이므로 로컬 업데이트 후
    // 필요하다면 별도 이벤트를 쏘거나 PICK 이벤트에 포함시킬 수 있음.
    // 기존 Socket.tsx에 BOSS 이벤트 핸들러가 있으므로 그것을 활용
    send(SOCKET_EVENT.BOSS, {
      confirm: false,
      bossId,
      roundKey,
      side,
    })
  }

  const onCostChange = (round: 'personal' | 'common', index: number, setting: AgentCostSetting) => {
    const roundKey = round === 'personal' ? 'personal' : 'common'
    const prevPickCost = [...(props.room.play[roundKey][side].pickCost || [null, null, null])] as [
      AgentCostSetting | null,
      AgentCostSetting | null,
      AgentCostSetting | null,
    ]
    prevPickCost[index] = setting

    send(SOCKET_EVENT.PICK, {
      side,
      roundKey,
      pickCost: prevPickCost,
    })
  }

  const onSubmit = () => {
    send(SOCKET_EVENT.READY, {
      side,
      ready: true,
    })
  }

  return (
    <PickPhase
      role={props.role}
      pickList={pickList as any}
      pickCost={pickCost as any}
      boss={boss as any}
      banList={banList}
      slotCosts={slotCosts}
      onSelectAgent={onSelectAgent}
      onRemoveAgent={onRemoveAgent}
      onSelectBoss={onSelectBoss}
      onCostChange={onCostChange}
      onSubmit={onSubmit}
      disabled={props.room.realtime.ready[side]}
    />
  )
}

export default Pick
