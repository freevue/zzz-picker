import { ROOM_PHASE, type RoomData, type Rols } from '../../index'
import { pipe, sort, find, throwIf, isUndefined } from '@fxts/core'
import { Typo } from '@zzz-picker/components/v2'
import { BAN_PHASE, SOCKET_EVENT } from '@zzz-picker/constant'
import { useSocket, useStore } from '@zzz-picker/provider/hooks'
import dayjs from 'dayjs'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'

type Props = {
  role: Rols
  room: RoomData
  onUpdate: (nextRoom: RoomData) => void
}

const useCurrentBossList = () => {
  const { deadlyAssaultList } = useStore()

  return useMemo(() => {
    try {
      if (!deadlyAssaultList || deadlyAssaultList.length === 0) return []

      return pipe(
        deadlyAssaultList,
        sort((prev, curr) => curr.open.diff(prev.open)),
        find((deadlyAssault) => dayjs(deadlyAssault.open).isBefore(dayjs())),
        throwIf(isUndefined, () => Error('No Active Assault')),
        ({ boss1, boss2, boss3 }) => [boss1, boss2, boss3]
      )
    } catch {
      return []
    }
  }, [deadlyAssaultList])
}

const ParticipantBossSelect: React.FC<Props> = (props) => {
  const { send } = useSocket()
  const bosses = useCurrentBossList()

  const [localSelectedBossId, setLocalSelectedBossId] = useState<number | null>(null)
  const lastInteractionTime = useRef<number>(0)

  useEffect(() => {
    const serverBossId = (props.room.state as any).realtime?.bossCandidates
    if (serverBossId) {
      setLocalSelectedBossId(serverBossId)
    }
  }, [])

  useEffect(() => {
    const serverBossId = (props.room.state as any).realtime?.bossCandidates
    const timeSinceInteraction = Date.now() - lastInteractionTime.current
    if (timeSinceInteraction > 500) {
      setLocalSelectedBossId(serverBossId || null)
    }
  }, [props.room.state])

  // Strict Role Logic: Only Player B can interact
  const isPlayerB = props.role === 'B'

  const handleSelect = (bossId: number) => {
    if (!isPlayerB) return
    setLocalSelectedBossId(bossId)
    lastInteractionTime.current = Date.now()
    send(SOCKET_EVENT.BOSS, { confirm: false, bossId, roundKey: 'common' })

    props.onUpdate({
      ...props.room,
      state: {
        ...props.room.state,
        realtime: {
          ...props.room.state.realtime,
          bossCandidates: bossId,
        },
      } as any,
    })
  }

  const handleConfirm = () => {
    if (!isPlayerB || !localSelectedBossId) return

    props.onUpdate({
      ...props.room,
      state: {
        ...props.room.state,
        realtime: {
          ...props.room.state.realtime,
          phase: ROOM_PHASE.BAN,
          banPhase: BAN_PHASE.A_SELECT,
          bossCandidates: null,
        },
        play: {
          ...props.room.state.play,
          common: {
            ...props.room.state.play.common,
            boss: localSelectedBossId,
          },
        },
      } as any,
    })

    send(SOCKET_EVENT.BOSS, { confirm: true, bossId: localSelectedBossId, roundKey: 'common' })
  }

  return (
    <div className="flex flex-col h-screen text-[var(--color-ink)] relative overflow-hidden">
      <div className="flex-none md:pt-12 pt-4 pb-4 px-6 text-center z-10">
        <Typo.Heading className="text-4xl font-black text-primary tracking-[0.05em] uppercase drop-shadow-lg">
          공용무대
        </Typo.Heading>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-40 md:pb-32 min-h-0 overscroll-contain">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto pt-4">
          {bosses.map((boss, index) => {
            if (!boss) return null
            const isSelected = localSelectedBossId === boss.id
            return (
              <motion.button
                key={boss.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSelect(boss.id)}
                disabled={!isPlayerB}
                whileTap={isPlayerB ? { scale: 0.98 } : undefined}
                className={`group relative w-full aspect-[3/4] flex-shrink-0 rounded-bl-3xl rounded-tr-3xl rounded-tl-md rounded-br-md overflow-hidden transition-all duration-300 bg-[#ecede7] ${
                  isSelected
                    ? 'ring-4 ring-primary z-10 scale-[1.02]'
                    : isPlayerB
                      ? 'opacity-80 active:opacity-100' // Removed hover, added active state
                      : 'opacity-50 grayscale'
                }`}
              >
                {/* Background Image - Fitted to 3:4 */}
                <div className="absolute inset-0 bg-[#ecede7] flex items-center justify-center">
                  <img
                    src={`/images/boss/${boss.id}.webp`}
                    alt={boss.nameKo}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name Label */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent pt-12">
                  <h3 className="text-xl font-bold text-white text-center drop-shadow-md">
                    {boss.nameKo}
                  </h3>
                </div>

                {/* Selection Indicator - Checkmark Removed as per feedback */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute inset-0 bg-primary/10 z-0"
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Footer / Action Area */}
      <AnimatePresence>
        {isPlayerB && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-5xl mx-auto md:p-6 bg-primary md:bg-transparent">
              <button
                onClick={handleConfirm}
                disabled={!localSelectedBossId}
                className={`w-full relative overflow-hidden transition-all duration-200 ${
                  localSelectedBossId
                    ? 'bg-primary text-[#0c1119] active:brightness-90'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                } h-16 md:h-14 md:rounded-xl shadow-[0_-8px_30px_rgb(0,0,0,0.5)]`}
              >
                <span className="text-lg font-black uppercase tracking-[0.2em] md:tracking-widest">
                  선택 확정
                </span>
              </button>
              {/* Safe area filler for mobile - ensure it carries the primary color if selected */}
              <div
                className={`h-[safe-area-inset-bottom] pb-[env(safe-area-inset-bottom)] ${localSelectedBossId ? 'bg-primary' : 'bg-gray-800'} md:hidden`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* A Side Waiting Indicator */}
      {!isPlayerB && (
        <div className="fixed bottom-12 left-0 right-0 text-center pointer-events-none z-20">
          <div className="inline-block px-6 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
            <span className="text-sm text-gray-300 font-medium tracking-wider uppercase animate-pulse">
              B 선수의 선택을 기다리고 있습니다...
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ParticipantBossSelect
