import Ban from './Ban'
import BossSelect from './Boss'
import Pick from './Pick'
import { type RoomState, DEFAULT_PLAY_STATE, DEFAULT_REALTIME_STATE } from '@zzz-picker/constant'
import { ROOM_PHASE, GAME_TYPE, type Side } from '@zzz-picker/constant'
import { useSocket } from '@zzz-picker/provider/hooks'
import { motion, AnimatePresence } from 'motion/react'
import { useCallback, useMemo, useState } from 'react'

export type Rols = Side | 'H'

export type RoomData = {
  id: string
  gameType: GAME_TYPE
  state: RoomState
}

type Props = {
  role: Rols
  id: string
  gameType: GAME_TYPE
  initialRoom: RoomState
}

const Component: React.FC<{
  phase: ROOM_PHASE
  role: Rols
  room: RoomState
  onUpdate: (data: RoomState) => void
}> = (props) => {
  switch (props.phase) {
    case ROOM_PHASE.WAITING:
    case ROOM_PHASE.BOSS_SELECT:
      return <BossSelect role={props.role} room={props.room} onUpdate={props.onUpdate} />
    case ROOM_PHASE.BAN:
      return <Ban role={props.role} room={props.room} onUpdate={props.onUpdate} />
    case ROOM_PHASE.PICK:
      return <Pick role={props.role} room={props.room} onUpdate={props.onUpdate} />
    default:
      return null
  }
}

const Phase: React.FC<Props> = (props) => {
  const { state: socketState } = useSocket()
  const [localRoom, setLocalRoom] = useState<RoomState | null>(null)

  const roomState = useMemo<RoomState>(() => {
    const base = {
      play: { ...socketState.play, ...props.initialRoom.play },
      realtime: { ...socketState.realtime, ...props.initialRoom.realtime },
    }
    return localRoom ? { ...base, play: { ...base.play, ...localRoom.play } } : base
  }, [socketState, props.initialRoom, localRoom])

  const onUpdateRoom = useCallback((data: RoomState) => {
    setLocalRoom(data)
  }, [])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="size-full"
        key={roomState.realtime.phase}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
      >
        <Component
          phase={roomState.realtime.phase as ROOM_PHASE}
          role={props.role}
          room={roomState}
          onUpdate={onUpdateRoom}
        />
      </motion.div>
    </AnimatePresence>
  )
}

export default Phase
