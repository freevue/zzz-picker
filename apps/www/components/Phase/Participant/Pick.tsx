import type { RoomData, Rols } from '../index'
import { pipe, map, toArray, concat, join } from '@fxts/core'
import { Typo, Agent } from '@zzz-picker/components/v2'
import type { Side } from '@zzz-picker/constant'
import { useStore } from '@zzz-picker/provider/hooks'
import { useState, useMemo } from 'react'

// Reuse PickInfo type locally or import if exported
export type PickInfo = {
  agentId: number | null
  engineId: number | null
  agentRate: number
  engineRate: number
}

type Props = {
  room: RoomData
  role: Rols
  onUpdate: (nextRoom: RoomData) => void
  onComplete: () => void
}

const Pick: React.FC<Props> = ({ room, role, onUpdate, onComplete }) => {
  const { agents } = useStore()

  const getPicksFromPlay = (side: any) => {
    // Safety check for role
    if (side !== 'A' && side !== 'B') return []

    const r1 = (room.state.play.personal as any)[side]?.pickList || []
    const c1 = (room.state.play.personal as any)[side]?.pickCost || [null, null, null]
    const r2 =
      room.game_type === 'unlimited'
        ? (room.state.play.unlimited as any)[side]?.pickList || []
        : (room.state.play.common as any)[side]?.pickList || []
    const c2 =
      room.game_type === 'unlimited'
        ? (room.state.play.unlimited as any)[side]?.pickCost || [null, null, null]
        : (room.state.play.common as any)[side]?.pickCost || [null, null, null]

    // Combine 3+3=6 slots
    return [...r1, ...r2].map((agentId, index) => ({
      agentId,
      engineId: ([...c1, ...c2][index]?.engineId || null) as number | null,
      agentRate: ([...c1, ...c2][index]?.agentRate || 0) as number,
      engineRate: ([...c1, ...c2][index]?.engineRate || 1) as number,
    })) as PickInfo[]
  }

  const myPicks = getPicksFromPlay(role)
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null)

  // Find next empty slot for auto-selection focus
  const nextEmptySlot = useMemo(() => {
    return myPicks.findIndex((p) => !p.agentId)
  }, [myPicks])

  // Active slot is either manually selected or the next empty one
  // If all full, default to last or none? Let's say none if not manually selected.
  // Actually standard UX: if full, maybe just stay on last one or requiring manual tap.
  const activeSlot =
    selectedSlotIndex !== null ? selectedSlotIndex : nextEmptySlot !== -1 ? nextEmptySlot : 0

  const handleSelectAgent = (agentId: number) => {
    if (activeSlot === null || role === 'H') return

    const isRound1 = activeSlot < 3
    const roundKey = isRound1 ? 'personal' : room.game_type === 'unlimited' ? 'unlimited' : 'common'
    const side = role as Side

    // Get current list for the specific round
    const currentRoundList = isRound1
      ? room.state.play.personal[side].pickList
      : room.game_type === 'unlimited'
        ? room.state.play.unlimited[side].pickList
        : room.state.play.common[side].pickList

    // Update the specific index in the round (0-2)
    const newRoundList = [...currentRoundList]
    newRoundList[activeSlot % 3] = agentId

    onUpdate({
      ...room,
      state: {
        ...room.state,
        play: {
          ...room.state.play,
          [roundKey]: {
            ...(room.state.play as any)[roundKey],
            [side]: {
              ...(room.state.play as any)[roundKey][side],
              pickList: newRoundList,
            },
          },
        },
      } as any,
    })

    // Auto-advance to next slot if available and we just filled one
    if (selectedSlotIndex !== null && selectedSlotIndex < 5) {
      setSelectedSlotIndex(selectedSlotIndex + 1)
    }
  }

  // All Agents List
  const allAgents = useMemo(() => {
    return pipe(
      agents,
      map(([id]) => id),
      toArray
    )
  }, [agents])

  const banList = room.state.play.banList || []

  return (
    <div className="flex flex-col h-full bg-[#1a202c] text-white safe-area-inset-bottom">
      <div className="flex-none p-4 text-center border-b border-white/5 bg-[#1a202c] z-10">
        <Typo.Heading className="text-2xl font-bold text-[#06B6D4] uppercase tracking-widest">
          PICK PHASE
        </Typo.Heading>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-48">
        <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
          {allAgents.map((agentId) => {
            const isPicked = myPicks.some((p) => p.agentId === agentId)
            const isBanned = banList.includes(agentId)
            const isSelected = myPicks[activeSlot]?.agentId === agentId

            return (
              <div key={agentId} className="relative aspect-square">
                <Agent.Button
                  id={agentId as any}
                  size="md"
                  disabled={isBanned || (isPicked && !isSelected)}
                  className={pipe(
                    ['w-full', 'h-full', 'transition-all'],
                    concat(isSelected ? ['ring-4', 'ring-[#06B6D4]', 'scale-95'] : []),
                    join(' ')
                  )}
                  onClick={() => handleSelectAgent(agentId)}
                />
                {isBanned && (
                  <div className="absolute inset-0 bg-black/60 rounded-3xl flex items-center justify-center pointer-events-none">
                    <span className="text-[#EF4444] font-bold text-xl">X</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0f172a]/95 backdrop-blur-lg rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] safe-area-inset-bottom z-30 border-t border-white/10">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-1.5 bg-white/20 rounded-full" />
        </div>

        <div className="flex overflow-x-auto gap-3 pb-4 scrolling-touch px-2 mb-4 justify-start md:justify-center">
          {myPicks.map((pick, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSlotIndex(idx)}
              className={pipe(
                [
                  'flex-none',
                  'size-16',
                  'rounded-full',
                  'border-2',
                  'flex',
                  'items-center',
                  'justify-center',
                  'overflow-hidden',
                  'bg-white/5',
                  'transition-all',
                ],
                concat(
                  activeSlot === idx
                    ? ['border-[#06B6D4]', 'ring-4', 'ring-[#06B6D4]/20', 'scale-110']
                    : ['border-white/10', 'opacity-60']
                ),
                join(' ')
              )}
            >
              {pick.agentId ? (
                <Agent.Profile id={pick.agentId} className="size-full" flat />
              ) : (
                <span className="text-white/20 text-xl font-bold">{idx + 1}</span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={onComplete}
          className="w-full py-4 bg-[#06B6D4] text-[#1a202c] rounded-xl text-xl font-black uppercase tracking-widest shadow-lg shadow-[#06B6D4]/20 active:scale-95 transition-transform"
        >
          {room.state.realtime.ready?.[role as 'A' | 'B'] ? 'UNLOCK' : 'LOCK IN'}
        </button>
      </div>
    </div>
  )
}

export default Pick
