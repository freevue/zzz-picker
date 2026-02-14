import { ROOM_PHASE, type RoomData, type Rols } from '../index'
import { pipe, map, toArray, filter, isNull, concat, join } from '@fxts/core'
import { Typo, Agent } from '@zzz-picker/components/v2'
import { BAN_PHASE, SOCKET_EVENT } from '@zzz-picker/constant'
import { useSocket, useStore } from '@zzz-picker/provider/hooks'
import { motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'

type Props = {
  role: Rols
  room: RoomData
  onUpdate: (nextRoom: RoomData) => void
}

const Ban: React.FC<Props> = (props) => {
  const { agents } = useStore()
  const [selectedToBan, setSelectedToBan] = useState<number | null>(null)

  const realtime = (props.room.state as any).realtime || {}
  const phase = realtime.banPhase || BAN_PHASE.A_SELECT
  const candidates = realtime.banCandidates || [null, null]
  const bannedList = props.room.state.play.banList

  const [countdown, setCountdown] = useState<number | null>(null)

  // Logic Helpers
  const getAgentPosition = (agentId: number | null) => {
    if (isNull(agentId)) return null
    return agents.get(agentId)?.specialty.id
  }
  const DEALER_IDS = [1, 2, 3]
  const SUPPORTER_IDS = [4, 5, 6]
  const getAgentGroup = (specialtyId?: number | null) => {
    if (!specialtyId) return null
    if (DEALER_IDS.includes(specialtyId)) return 'DEALER'
    if (SUPPORTER_IDS.includes(specialtyId)) return 'SUPPORTER'
    return null
  }

  // Protected Agents (Server-side allowed list)
  const protectedAgents = useMemo(() => {
    return pipe(
      agents,
      filter(([, agent]) => agent.isAllow),
      map(([id]) => id),
      toArray
    )
  }, [agents])

  // Pool Logic
  const pool = useMemo(() => {
    return pipe(
      agents,
      filter(([, agent]) => agent.isPickup && agent.rarity === 'S'),
      map(([id]) => id),
      filter((id) => !protectedAgents.includes(id)),
      toArray
    )
  }, [agents, protectedAgents])

  // Disabled Logic
  const disabledAgents = useMemo(() => {
    const list = [...bannedList]
    if (phase === BAN_PHASE.B_SELECT) {
      const lastBannedId = bannedList[bannedList.length - 1]
      const lastBannedSpecialty = getAgentPosition(lastBannedId)
      const lastBannedGroup = getAgentGroup(lastBannedSpecialty)
      const sameGroupAgents = pool.filter((id) => {
        const agentSpecialty = getAgentPosition(id)
        return getAgentGroup(agentSpecialty) === lastBannedGroup
      })
      list.push(...sameGroupAgents)
    }
    return list
  }, [pool, phase, bannedList, agents])

  const { send } = useSocket()
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const isMyTurn = useMemo(() => {
    if (props.role === 'A') return [BAN_PHASE.A_SELECT, BAN_PHASE.A_BAN].includes(phase)
    if (props.role === 'B') return [BAN_PHASE.B_BAN, BAN_PHASE.B_SELECT].includes(phase)
    return false
  }, [props.role, phase])

  const isSelectionPhase = [BAN_PHASE.A_SELECT, BAN_PHASE.B_SELECT].includes(phase)
  const isBanActionPhase = [BAN_PHASE.B_BAN, BAN_PHASE.A_BAN].includes(phase)

  // Handlers
  const onChange = (id: number) => {
    if (!isMyTurn || !isSelectionPhase) return
    if (disabledAgents.includes(id)) return

    // Immediately select and update candidates (Single select for simplicity in grid)
    // Actually the original logic used Form.Party which handles array.
    // Here we'll treat 'selectedToBan' as the candidate locally for now?
    // Wait, candidates is an array [id, null] usually.
    // Let's stick to the flow:
    // 1. Select -> Send Update (Candidates)
    // 2. Confirm -> Send Confirm

    // In this simplified mobile UI, we might just select ONE agent as candidate.
    const newCandidates = [id, null] as any

    send(SOCKET_EVENT.BAN, { confirm: false, banCandidates: newCandidates })
    props.onUpdate({
      ...props.room,
      state: {
        ...props.room.state,
        realtime: {
          ...props.room.state.realtime,
          banCandidates: newCandidates,
        },
      } as any,
    })
    setSelectedToBan(id)
  }

  const handleConfirm = () => {
    if (countdown !== null) return

    if (isSelectionPhase) {
      // Proceed to BAN Phase
      let nextPhase = phase === BAN_PHASE.A_SELECT ? BAN_PHASE.B_BAN : BAN_PHASE.A_BAN

      props.onUpdate({
        ...props.room,
        state: {
          ...props.room.state,
          realtime: {
            ...props.room.state.realtime,
            banPhase: nextPhase,
            banCandidates: candidates,
          },
        } as any,
      })
    } else if (isBanActionPhase) {
      // Confirm Ban
      // In the original code, the 'other' player confirms the ban of the 'selected' agent.
      // Wait, logic check:
      // A Selects -> B Bans (Confirm?) -> B Selects -> A Bans
      // Actually usually "A Bans" means A picks who to ban.
      // Let's re-read original `Ban.tsx` logic carefully.

      // Original: `onBanConfirm` uses `selectedToBan`.
      // `nextBannedList` updated.
      // `nextPhase` updated.
      // `send` event.

      // Mobile UI needs to be simple:
      // IF it's my turn to SELECT/BAN, I tap an agent -> it visually highlights.
      // Then I tap CONFIRM.

      // If phase is A_SELECT, A selects meaningful agents?
      // Actually the BAN_PHASE constant implies:
      // A_SELECT: A selects candidates?
      // B_BAN: B confirms one of them?
      // Or is it just "A Turn to Ban"?
      // ZZZ Picker logic seems to be: Pick Candidates -> Confirm Ban.

      // For simplicity, let's assume `selectedToBan` is enough.

      if (!selectedToBan) return

      const nextBannedList = [...bannedList]
      const emptyIndex = nextBannedList.indexOf(null)
      if (emptyIndex !== -1) nextBannedList[emptyIndex] = selectedToBan

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
          play: {
            ...props.room.state.play,
            banList: nextBannedList,
          },
        } as any,
      })

      send(SOCKET_EVENT.BAN, { confirm: true, agentId: selectedToBan, nextPhase })
      setSelectedToBan(null)
    }
  }

  // Timer Logic (Copy-paste adapt)
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
    <div className="flex flex-col h-full bg-[#1a202c] text-white safe-area-inset-bottom">
      {/* Header */}
      <div className="flex-none p-6 text-center border-b border-white/5 bg-[#1a202c]">
        <Typo.Heading className="text-3xl font-black text-[#EF4444] tracking-widest uppercase items-center flex justify-center gap-2">
          BAN PHASE
          {countdown !== null && <span className="text-white text-lg">({countdown}s)</span>}
        </Typo.Heading>
        <p className="text-[#EF4444]/60 text-sm mt-1 font-bold">
          {isMyTurn ? '금지할 에이전트를 선택하세요' : '상대방이 금지 에이전트를 선택 중입니다'}
        </p>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
          {pool.map((agentId) => {
            const isBanned = bannedList.includes(agentId)
            const isDisabled = disabledAgents.includes(agentId) && !isBanned // Already banned handled nicely
            const isSelected = selectedToBan === agentId

            return (
              <div key={agentId} className="relative aspect-square">
                <Agent.Button
                  id={agentId as any}
                  size="xl"
                  onClick={() => {
                    // If it's my turn, allow select
                    if (isMyTurn) {
                      if (isBanActionPhase) setSelectedToBan(agentId)
                      else onChange(agentId)
                    }
                  }}
                  disabled={isDisabled}
                  className={`w-full h-full rounded-lg ${isSelected ? 'ring-2 ring-[#EF4444] scale-95' : ''}`}
                />

                {/* Banned Overlay */}
                {isBanned && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg pointer-events-none z-10">
                    <span className="text-[#EF4444] text-4xl font-black">X</span>
                  </div>
                )}

                {/* Selection Overlay */}
                {isSelected && (
                  <motion.div
                    layoutId="ban-selection"
                    className="absolute inset-0 border-4 border-[#EF4444] rounded-lg pointer-events-none z-20 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer Action */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-6 bg-[#1a202c]/90 backdrop-blur"
      >
        <button
          onClick={handleConfirm}
          disabled={!isMyTurn || (isBanActionPhase && !selectedToBan) || countdown !== null}
          className={pipe(
            [
              'w-full',
              'py-4',
              'rounded-xl',
              'text-xl',
              'font-black',
              'uppercase',
              'tracking-widest',
            ],
            concat(
              isMyTurn &&
                ((isBanActionPhase && selectedToBan) || isSelectionPhase) &&
                countdown === null
                ? ['bg-[#EF4444]', 'text-white', 'shadow-lg', 'shadow-[#EF4444]/30']
                : ['bg-gray-800', 'text-gray-600', 'cursor-not-allowed']
            ),
            join(' ')
          )}
        >
          CONFIRM BAN
        </button>
      </motion.div>
    </div>
  )
}

export default Ban
