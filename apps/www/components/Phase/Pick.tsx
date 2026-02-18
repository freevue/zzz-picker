import { PickPhase } from '@zzz-picker/components/realtime'
import { type Side, type RoomState, type AgentCostSetting, GAME_TYPE } from '@zzz-picker/constant'
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
  const { cost } = useSocket()
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

    props.onUpdate({
      ...props.room,
      play: {
        ...props.room.play,
        [roundKey]: {
          ...props.room.play[roundKey],
          [side]: {
            ...props.room.play[roundKey][side],
            pickList: prevPickList,
            pickCost: prevPickCost,
          },
        },
      },
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

    props.onUpdate({
      ...props.room,
      play: {
        ...props.room.play,
        [roundKey]: {
          ...props.room.play[roundKey],
          [side]: {
            ...props.room.play[roundKey][side],
            pickList: prevPickList,
            pickCost: prevPickCost,
          },
        },
      },
    })
  }

  const onSelectBoss = (round: 'personal' | 'common', bossId: number) => {
    const roundKey = round === 'personal' ? 'personal' : 'common'
    props.onUpdate({
      ...props.room,
      play: {
        ...props.room.play,
        [roundKey]: {
          ...props.room.play[roundKey],
          [side]: {
            ...props.room.play[roundKey][side],
            boss: bossId,
          },
        },
      },
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

    props.onUpdate({
      ...props.room,
      play: {
        ...props.room.play,
        [roundKey]: {
          ...props.room.play[roundKey],
          [side]: {
            ...props.room.play[roundKey][side],
            pickCost: prevPickCost,
          },
        },
      },
    })
  }

  const onSubmit = () => {
    // TODO: Socket 이벤트로 ready 상태 전송
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
      disabled={props.role === 'H'}
    />
  )
}

export default Pick
