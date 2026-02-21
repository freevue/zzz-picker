import Ban from './Ban'
import BossSelect from './Boss'
import End from './End'
import Pick from './Pick'
import { type RoomState } from '@zzz-picker/constant'
import { ROOM_PHASE, GAME_TYPE, type Side } from '@zzz-picker/constant'
import { useSocket } from '@zzz-picker/provider/hooks'
import { motion, AnimatePresence } from 'motion/react'
import { useCallback, useMemo } from 'react'

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
  gameType: GAME_TYPE
  onUpdate: (data: RoomState) => void
}> = (props) => {
  switch (props.phase) {
    case ROOM_PHASE.WAITING:
    case ROOM_PHASE.BOSS_SELECT:
      return <BossSelect role={props.role} room={props.room} onUpdate={props.onUpdate} />
    case ROOM_PHASE.BAN:
      return <Ban role={props.role} room={props.room} onUpdate={props.onUpdate} />
    case ROOM_PHASE.PICK:
      return (
        <Pick
          role={props.role}
          room={props.room}
          gameType={props.gameType}
          onUpdate={props.onUpdate}
        />
      )
    case ROOM_PHASE.DONE:
      return <End />
    default:
      return null
  }
}

const Phase: React.FC<Props> = (props) => {
  const { state: socketState } = useSocket()
  const roomState = useMemo<RoomState>(() => {
    // Socket state is the single source of truth.
    console.log('[Phase] Current Room State:', {
      phase: socketState.realtime.phase,
      socketPhase: socketState.realtime.phase,
    })
    return socketState
  }, [socketState])

  const onUpdateRoom = useCallback((data: RoomState) => {
    console.log('[Phase] onUpdateRoom called (ignored for sync fix):', data.realtime.phase)
    // Intentionally doing nothing to enforce Single Source of Truth from Socket
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
          gameType={props.gameType}
          onUpdate={onUpdateRoom}
        />
      </motion.div>
    </AnimatePresence>
  )
}

export default Phase
