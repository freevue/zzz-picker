import { PickPhase } from '@zzz-picker/components/realtime'
import { type Side, type RoomState, GAME_TYPE } from '@zzz-picker/constant'
import { useSocket } from '@zzz-picker/provider/hooks'

type Props = {
  role: Side | 'H'
  room: RoomState
  gameType?: GAME_TYPE
  onUpdate: (data: RoomState) => void
}

const Pick: React.FC<Props> = (props) => {
  const { cost } = useSocket()
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

  const handleSelectAgent = (round: 'personal' | 'common', index: number, agentId: number) => {
    const roundKey = round === 'personal' ? 'personal' : 'common'
    const prevPickList = [...props.room.play[roundKey][side].pickList] as [
      number | null,
      number | null,
      number | null,
    ]
    prevPickList[index] = agentId || null

    props.onUpdate({
      ...props.room,
      play: {
        ...props.room.play,
        [roundKey]: {
          ...props.room.play[roundKey],
          [side]: {
            ...props.room.play[roundKey][side],
            pickList: prevPickList,
          },
        },
      },
    })
  }

  const handleSubmit = () => {
    // TODO: Socket 이벤트로 ready 상태 전송
  }

  return (
    <PickPhase
      role={props.role}
      pickList={pickList as any}
      pickCost={pickCost as any}
      boss={boss as any}
      banList={banList}
      onSelectAgent={handleSelectAgent}
      onSubmit={handleSubmit}
      disabled={props.role === 'H'}
    />
  )
}

export default Pick
