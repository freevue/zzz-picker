import PlayerPick from './Pick/Player'
import { type RoomData } from './index'
import { type Side } from '@zzz-picker/constant'
import { useSocket } from '@zzz-picker/provider/hooks'

type Props = {
  role: Side
  room: RoomData
  onUpdate: (nextRoom: RoomData) => void
}

const Pick: React.FC<Props> = (props) => {
  const { cost } = useSocket()

  const readyState = props.room.state.realtime.ready || { A: false, B: false }

  const toggleReady = (side: Side) => {
    const nextReady = !readyState[side]
    props.onUpdate({
      ...props.room,
      state: {
        ...props.room.state,
        realtime: {
          ...props.room.state.realtime,
          ready: { ...readyState, [side]: nextReady },
        },
      } as any,
    })
  }

  return (
    <PlayerPick
      room={props.room}
      role={props.role}
      onUpdate={props.onUpdate}
      onComplete={() => toggleReady(props.role as Side)}
    />
  )
}

export default Pick
