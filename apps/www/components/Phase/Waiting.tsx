import { ROOM_PHASE, type RoomData, type Rols } from './index'
import { pipe, concat, join } from '@fxts/core'
import { Typo } from '@zzz-picker/components/v2'
import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'

type Props = {
  role: Rols
  room: RoomData
  onUpdate: (nextRoom: RoomData) => void
}

const Waiting: React.FC<Props> = ({ role, room, onUpdate }) => {
  const [countdown, setCountdown] = useState<number | null>(null)

  const isOnlineA = !!room.state?.realtime.status?.['A']
  const isOnlineB = !!room.state?.realtime.status?.['B']
  const isOnlineH = !!room.state?.realtime.status?.['H']

  const allConnected = isOnlineA && isOnlineB && isOnlineH

  useEffect(() => {
    console.log('[Waiting] Current status:', { isOnlineA, isOnlineB, isOnlineH, allConnected })
  }, [isOnlineA, isOnlineB, isOnlineH, allConnected])

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (allConnected) {
      if (countdown === null) {
        console.log('[Waiting] Starting countdown...')
        setCountdown(5)
      } else if (countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      } else if (countdown === 0 && role === 'H') {
        console.log('[Waiting] Countdown finished, Host transitioning phase...')
        onUpdate({
          ...room,
          state: {
            ...room.state,
            realtime: {
              ...room.state.realtime,
              phase: ROOM_PHASE.BOSS_SELECT,
            },
          },
        })
      }
    } else {
      if (countdown !== null) console.log('[Waiting] Connection lost, resetting countdown')
      setCountdown(null)
    }

    return () => clearTimeout(timer)
  }, [allConnected, countdown, role, onUpdate, room])

  const renderStatus = (label: string, isOnline: boolean, nickname: string) => (
    <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-content/5 border-2 border-primary/10 min-w-[240px]">
      <div
        className={pipe(
          ['w-4', 'h-4', 'rounded-full'],
          concat(
            isOnline ? ['bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.8)]'] : ['bg-ink/20']
          ),
          join(' ')
        )}
      />
      <div className="text-center">
        <Typo.Heading heading={3} className="heading-xl text-ink">
          {label}
        </Typo.Heading>
        <Typo.Body className="body-md text-ink/50 mt-1">{nickname || 'Waiting...'}</Typo.Body>
      </div>
      <Typo.Body
        className={pipe(
          ['body-sm', 'font-bold'],
          concat(isOnline ? ['text-primary'] : ['text-ink/30']),
          join(' ')
        )}
      >
        {isOnline ? 'CONNECTED' : 'DISCONNECTED'}
      </Typo.Body>
    </div>
  )

  return (
    <div className="flex flex-col items-center justify-center gap-16 py-10 min-h-[50vh]">
      <div className="flex flex-wrap justify-center gap-8 w-full max-w-5xl">
        {renderStatus(
          '관리자',
          isOnlineH,
          room.users.find((u) => u.role === 'Host')?.nickname || 'Host'
        )}
        {renderStatus(room.names.A || 'Player A', isOnlineA, 'Player A')}
        {renderStatus(room.names.B || 'Player B', isOnlineB, 'Player B')}
      </div>

      <div className="h-32 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {countdown !== null && (
            <motion.div
              key="countdown"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              className="flex flex-col items-center gap-4"
            >
              <Typo.Heading heading={2} className="heading-6xl text-primary font-black">
                {countdown}
              </Typo.Heading>
              <Typo.Body className="body-lg text-ink/40 uppercase tracking-widest">
                Starting Soon
              </Typo.Body>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Waiting
