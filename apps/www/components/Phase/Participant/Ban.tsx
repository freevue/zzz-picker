import { ROOM_PHASE, type RoomData, type Rols } from '../index'
import { isNull, join } from '@fxts/core'
import { Typo, Agent } from '@zzz-picker/components/v2'
import { BAN_PHASE, SOCKET_EVENT } from '@zzz-picker/constant'
import { useSocket, useStore } from '@zzz-picker/provider/hooks'
import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'

type Props = {
  role: Rols
  room: RoomData
  onUpdate: (nextRoom: RoomData) => void
}

const Ban: React.FC<Props> = (props) => {
  const { agents } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'S' | 'A'>('S')
  const [currentSlotIndex, setCurrentSlotIndex] = useState<number | null>(null)

  const realtime = (props.room.state as any).realtime || {}
  const phase = realtime.banPhase || BAN_PHASE.A_SELECT
  const candidates = (realtime.banCandidates || [null, null]) as (number | null)[]
  const bannedList = (props.room.state.play.banList || []) as (number | null)[]

  const [countdown, setCountdown] = useState<number | null>(null)

  // Logic Helpers
  const isMyTurn = useMemo(() => {
    if (props.role === 'A') return [BAN_PHASE.A_SELECT, BAN_PHASE.A_BAN].includes(phase)
    if (props.role === 'B') return [BAN_PHASE.B_BAN, BAN_PHASE.B_SELECT].includes(phase)
    return false
  }, [props.role, phase])

  const isSelectionPhase = [BAN_PHASE.A_SELECT, BAN_PHASE.B_SELECT].includes(phase)
  const isBanActionPhase = [BAN_PHASE.B_BAN, BAN_PHASE.A_BAN].includes(phase)

  // Pool & Filter Logic
  const allAgents = useMemo(() => Array.from(agents.values()), [agents])
  const filteredAgents = useMemo(() => {
    return allAgents.filter(
      (a: any) => a.isPickup && !a.isAllow && !a.isTeaser && a.rarity === activeTab
    )
  }, [allAgents, activeTab])

  const disabledAgents = useMemo(() => {
    const list = [...bannedList, ...candidates].filter(
      (id: number | null) => !isNull(id)
    ) as number[]
    return list
  }, [bannedList, candidates])

  const { send } = useSocket()
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Handlers
  const handleSelectCandidate = (agentId: number) => {
    if (currentSlotIndex === null || !isMyTurn || !isSelectionPhase) return
    const newCandidates = [...candidates]
    newCandidates[currentSlotIndex] = agentId

    send(SOCKET_EVENT.BAN, { confirm: false, banCandidates: newCandidates })
    props.onUpdate({
      ...props.room,
      state: {
        ...props.room.state,
        realtime: { ...props.room.state.realtime, banCandidates: newCandidates },
      } as any,
    })
    setIsModalOpen(false)
  }

  const handleRemoveCandidate = (index: number) => {
    if (!isMyTurn || !isSelectionPhase) return
    const newCandidates = [...candidates]
    newCandidates[index] = null

    send(SOCKET_EVENT.BAN, { confirm: false, banCandidates: newCandidates })
    props.onUpdate({
      ...props.room,
      state: {
        ...props.room.state,
        realtime: { ...props.room.state.realtime, banCandidates: newCandidates },
      } as any,
    })
  }

  const handleConfirmAction = (selectedId?: number) => {
    if (countdown !== null) return

    if (isSelectionPhase) {
      if (candidates.some((c: number | null) => isNull(c))) return
      const nextPhase = phase === BAN_PHASE.A_SELECT ? BAN_PHASE.B_BAN : BAN_PHASE.A_BAN

      props.onUpdate({
        ...props.room,
        state: {
          ...props.room.state,
          realtime: { ...props.room.state.realtime, banPhase: nextPhase },
        } as any,
      })
      send(SOCKET_EVENT.BAN, { confirm: true, nextPhase })
    } else if (isBanActionPhase) {
      if (!selectedId) return
      const nextBannedList = [...bannedList]
      const emptyIndex = nextBannedList.indexOf(null)
      if (emptyIndex !== -1) nextBannedList[emptyIndex] = selectedId

      const nextPhase = phase === BAN_PHASE.B_BAN ? BAN_PHASE.B_SELECT : BAN_PHASE.END

      props.onUpdate({
        ...props.room,
        state: {
          ...props.room.state,
          realtime: {
            ...props.room.state.realtime,
            banPhase: nextPhase,
            banCandidates: [null, null],
          },
          play: { ...props.room.state.play, banList: nextBannedList },
        } as any,
      })

      send(SOCKET_EVENT.BAN, { confirm: true, agentId: selectedId, nextPhase })
    }
  }

  // Timer
  useEffect(() => {
    if (phase === BAN_PHASE.END && countdown === null) setCountdown(5)
    if (countdown !== null && countdown > 0) {
      timerRef.current = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else if (countdown === 0 && (props.role === 'H' || props.role === 'A')) {
      props.onUpdate({
        ...props.room,
        state: {
          ...props.room.state,
          realtime: { ...props.room.state.realtime, phase: ROOM_PHASE.PICK },
        } as any,
      })
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [phase, countdown, props.role])

  return (
    <div className="flex flex-col h-screen bg-[#0c1119] text-white relative font-sans overflow-hidden">
      {/* Background Decors */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#EF4444]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#EF4444]/5 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <div className="flex-none p-6 text-center z-10 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <Typo.Heading className="text-3xl md:text-4xl font-black text-[#EF4444] tracking-[0.4em] uppercase italic">
          BAN PHASE
          {countdown !== null && (
            <span className="ml-4 text-white font-mono opacity-60">[{countdown}s]</span>
          )}
        </Typo.Heading>
        <p className="mt-2 text-xs font-bold tracking-[0.3em] text-white/30 uppercase">
          {phase.replace(/_/g, ' ')}
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start p-4 md:p-12 gap-12 z-10 overflow-y-auto pb-32">
        {/* Status Tip */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 px-8 py-3 rounded-bl-3xl rounded-tr-3xl backdrop-blur-xl shadow-2xl"
        >
          <p className="text-sm md:text-lg font-bold text-[#EF4444] tracking-widest text-center">
            {isMyTurn
              ? '금지할 에이전트를 선택하고 확정하세요'
              : '상대방의 전술적 선택을 기다리는 중...'}
          </p>
        </motion.div>

        {/* Phase Layout */}
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-12 items-center">
          {/* Candidates Slot Area */}
          <div className="flex flex-col gap-6 items-center">
            <h3 className="text-sm font-black text-white/20 tracking-[0.3em] uppercase">
              Candidates Slots
            </h3>
            <div className="flex gap-6">
              {candidates.map((id: number | null, i: number) => (
                <div key={i} className="relative">
                  <motion.div
                    whileHover={isMyTurn && isSelectionPhase ? { scale: 1.02, y: -4 } : {}}
                    whileTap={isMyTurn && isSelectionPhase ? { scale: 0.95 } : {}}
                    onClick={() => {
                      if (isMyTurn && isSelectionPhase) {
                        setCurrentSlotIndex(i)
                        setIsModalOpen(true)
                      }
                    }}
                    className={join(' ', [
                      'w-32 h-44 md:w-44 md:h-60 border-2 transition-all duration-500 relative',
                      'rounded-bl-[3rem] rounded-tr-[3rem] overflow-hidden group',
                      id
                        ? 'border-[#EF4444] shadow-[0_0_30px_rgba(239,68,68,0.3)] bg-gradient-to-br from-[#EF4444]/20 to-transparent'
                        : 'border-white/10 bg-white/5 hover:border-[#EF4444]/50',
                      !isMyTurn && 'cursor-default grayscale-[0.5] opacity-80',
                    ])}
                  >
                    {id ? (
                      <Agent.Button
                        id={id as any}
                        className="w-full h-full !w-full !h-full pointer-events-none scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                        <span className="text-5xl text-white/5 font-black group-hover:text-[#EF4444]/40 transition-colors">
                          +
                        </span>
                        <span className="text-[10px] font-black text-white/10 tracking-widest uppercase group-hover:text-white/30">
                          Select
                        </span>
                      </div>
                    )}
                  </motion.div>

                  {id && isMyTurn && isSelectionPhase && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveCandidate(i)
                      }}
                      className="absolute -top-3 -right-3 w-8 h-8 bg-[#EF4444] text-white rounded-full flex items-center justify-center text-sm font-black shadow-2xl z-20 active:scale-90"
                    >
                      X
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* VS Divider */}
          <div className="hidden lg:flex flex-col items-center gap-2">
            <div className="w-px h-24 bg-gradient-to-t from-[#EF4444] to-transparent" />
            <span className="text-2xl font-black text-white/10 italic">VS</span>
            <div className="w-px h-24 bg-gradient-to-b from-[#EF4444] to-transparent" />
          </div>

          {/* Banned History area */}
          <div className="flex flex-col gap-6 items-center">
            <h3 className="text-sm font-black text-white/20 tracking-[0.3em] uppercase">
              Banned History
            </h3>
            <div className="flex gap-4">
              {bannedList.map((id: number | null, i: number) => (
                <div
                  key={i}
                  className="w-24 h-24 md:w-32 md:h-32 bg-black/40 border border-white/5 rounded-bl-3xl rounded-tr-3xl overflow-hidden relative flex items-center justify-center group"
                >
                  {id ? (
                    <>
                      <Agent.Button
                        id={id as any}
                        className="w-full h-full grayscale opacity-40 group-hover:opacity-60 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-red-900/20 mix-blend-multiply" />
                      <div className="absolute inset-0 flex items-center justify-center rotate-[-15deg]">
                        <span className="text-3xl md:text-4xl font-black text-[#EF4444] drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] italic">
                          BANNED
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="w-2 h-2 bg-white/5 rounded-full" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-8 flex flex-col items-center gap-6">
          <AnimatePresence mode="wait">
            {isBanActionPhase && isMyTurn && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="flex flex-col items-center gap-6"
              >
                <Typo.Heading className="text-lg font-black tracking-widest uppercase text-white/60">
                  상대방의 후보 중 하나를 금지하세요
                </Typo.Heading>
                <div className="flex gap-6">
                  {candidates.map((id: number | null, i: number) => {
                    if (!id) return null
                    const agent = agents.get(id)
                    return (
                      <button
                        key={i}
                        onClick={() => handleConfirmAction(id)}
                        className="group relative px-10 py-5 bg-transparent overflow-hidden rounded-bl-3xl rounded-tr-3xl border-2 border-[#EF4444] transition-all hover:bg-[#EF4444] shadow-[0_0_40px_rgba(239,68,68,0.1)] active:scale-95"
                      >
                        <span className="relative z-10 text-white font-black text-xl tracking-tighter uppercase group-hover:scale-110 transition-transform inline-block">
                          PERMANENT BAN: {(agent as any)?.name}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {isSelectionPhase && isMyTurn && !candidates.some(isNull) && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => handleConfirmAction()}
                className="px-16 py-5 bg-white text-black font-black text-xl rounded-bl-3xl rounded-tr-3xl shadow-[0_15px_40px_rgba(255,255,255,0.2)] hover:bg-white/90 active:scale-95 transition-all overflow-hidden relative group"
              >
                <span className="relative z-10 tracking-[0.2em] uppercase">후보군 선택 완료</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Selection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 backdrop-blur-3xl bg-[#0c1119]/80"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 40 }}
              className="bg-[#151b24] w-full max-w-3xl h-[85vh] flex flex-col border border-white/10 rounded-bl-[6rem] rounded-tr-[6rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-none bg-black/20 p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5">
                <Typo.Heading className="text-2xl font-black tracking-widest">
                  AGENT SELECTION
                </Typo.Heading>
                <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
                  {(['S', 'A'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={join(' ', [
                        'px-8 py-2 rounded-full text-sm font-black tracking-widest transition-all',
                        activeTab === tab
                          ? 'bg-white text-black shadow-lg'
                          : 'text-white/30 hover:text-white/60',
                      ])}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6">
                  {filteredAgents.map((agent: any) => {
                    const isDisabled = disabledAgents.includes(agent.id)
                    return (
                      <motion.div
                        key={agent.id}
                        whileHover={!isDisabled ? { scale: 1.05, y: -5 } : {}}
                        whileTap={!isDisabled ? { scale: 0.95 } : {}}
                        className="relative aspect-[3/4]"
                      >
                        <Agent.Button
                          id={agent.id as any}
                          onClick={() => !isDisabled && handleSelectCandidate(agent.id)}
                          className={join(' ', [
                            'w-full h-full !w-full !h-full rounded-bl-3xl rounded-tr-3xl overflow-hidden transition-all duration-300',
                            isDisabled
                              ? 'grayscale opacity-10 cursor-not-allowed scale-90'
                              : 'cursor-pointer hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]',
                            agent.rarity === 'S' && !isDisabled && 'ring-2 ring-yellow-500/30',
                          ])}
                        />
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              <div className="flex-none p-6 text-center bg-black/20 border-t border-white/5">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="group flex items-center justify-center gap-2 mx-auto"
                >
                  <span className="text-[10px] font-black tracking-[0.5em] text-white/20 group-hover:text-white transition-colors uppercase">
                    Cancel Selection process
                  </span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Ban
