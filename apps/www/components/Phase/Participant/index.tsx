import { ROOM_PHASE, type RoomData, type Rols } from '../index'
import Ban from './Ban'
import BossSelect from './Boss/index'
import Pick from './Pick'
import { Typo } from '@zzz-picker/components/v2'
import type { Side } from '@zzz-picker/constant'
import { motion, AnimatePresence } from 'motion/react'

type Props = {
  role: Rols
  room: RoomData
  onUpdate: (nextRoom: RoomData) => void
}

const ParticipantPhase: React.FC<Props> = (props) => {
  const phase = props.room.state.realtime.phase

  const toggleReady = () => {
    const side = props.role as Side
    const readyState = props.room.state.realtime.ready || { A: false, B: false }
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

  const renderPhase = () => {
    switch (phase) {
      case ROOM_PHASE.WAITING:
      case ROOM_PHASE.BOSS_SELECT:
        return <BossSelect {...props} />
      case ROOM_PHASE.BAN:
        return <Ban {...props} />
      case ROOM_PHASE.PICK:
        return <Pick {...props} onComplete={toggleReady} />
      case ROOM_PHASE.DONE:
        return (
          <div className="flex px-4 flex-col h-full items-center justify-center bg-[#1a202c] text-white gap-6">
            <Typo.Heading heading={1} className="text-3xl font-bold text-[#F59E0B]">
              준비 완료!
            </Typo.Heading>
            <p className="text-white/60 text-center">
              관리자가 경기를 시작할 때까지 잠시만 기다려주세요.
            </p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={phase}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.4, ease: 'circOut' }}
        className="h-full w-full"
      >
        {renderPhase()}
      </motion.div>
    </AnimatePresence>
  )
}

export default ParticipantPhase
