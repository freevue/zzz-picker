import { ROOM_PHASE, type RoomData, type Rols } from '../index'
import BossCard from './BossCard'
import { pipe, map, toArray, concat, join, zipWithIndex } from '@fxts/core'
import { Typo } from '@zzz-picker/components/v2'
import { BAN_PHASE, type Boss, SOCKET_EVENT } from '@zzz-picker/constant'
import { useStore, useSocket } from '@zzz-picker/provider/hooks'
import { useEffect, useMemo, useRef, useState } from 'react'

type Props = {
  role: Rols
  room: RoomData
  onUpdate: (nextRoom: RoomData) => void
}

const BossSelect: React.FC<Props> = (props) => {
  const { boss: bossMap, deadlyAssaultList } = useStore()
  const { send } = useSocket()

  // Local state for immediate feedback and to prevent flickering
  const [localSelectedBossId, setLocalSelectedBossId] = useState<number | null>(null)
  const lastInteractionTime = useRef<number>(0)

  // Initialize local state from room state on mount
  useEffect(() => {
    const serverBossId = (props.room.state as any).realtime?.bossCandidates
    if (serverBossId) {
      setLocalSelectedBossId(serverBossId)
    }
  }, []) // Run once on mount

  // Sync from server state, but respect local interaction timestamp
  useEffect(() => {
    const serverBossId = (props.room.state as any).realtime?.bossCandidates

    // If user interacted recently (within 500ms), ignore server update to prevent "bouncing" back to old state
    // This allows the local optimistic update to persist until the server catches up
    const timeSinceInteraction = Date.now() - lastInteractionTime.current

    if (timeSinceInteraction > 500) {
      setLocalSelectedBossId(serverBossId || null)
    }
  }, [props.room.state])

  const bosses = useMemo(() => {
    const currentAssault = deadlyAssaultList[0]
    if (!currentAssault) return []

    const allowedIds = [currentAssault.boss1.id, currentAssault.boss2.id, currentAssault.boss3.id]
    return allowedIds.map((id) => bossMap.get(id)).filter(Boolean) as Boss[]
  }, [bossMap, deadlyAssaultList])

  const handleSelect = (bossId: number) => {
    if (props.role !== 'B') return

    // Update local state immediately logic (Optimistic UI)
    setLocalSelectedBossId(bossId)
    lastInteractionTime.current = Date.now()

    // Send to server
    send(SOCKET_EVENT.BOSS, { confirm: false, bossId, roundKey: 'common' })

    // Update parent state (which might trigger a re-render with "old" prop data if not careful,
    // but our local state protects the UI)
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
    if (props.role !== 'B' || !localSelectedBossId) return

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

  const isPlayerB = props.role === 'B'

  return (
    <div className="py-20 h-screen w-screen overflow-y-auto flex flex-col">
      <Typo.Heading className="heading-4xl text-ink text-center" heading={1}>
        {isPlayerB ? '공통 무대를 선택해주세요' : '플레이어 B가 보스를 선택 중입니다...'}
      </Typo.Heading>
      <ul className="py-4 px-20 flex mt-10 w-full justify-center flex-wrap gap-10 mx-auto">
        {pipe(
          bosses,
          zipWithIndex,
          map(([index, boss]) => (
            <BossCard
              key={boss.id}
              index={index}
              boss={boss}
              isSelected={localSelectedBossId === boss.id}
              isPlayerB={isPlayerB}
              currentBossId={localSelectedBossId}
              onClick={() => handleSelect(boss.id)}
            />
          )),
          toArray
        )}
      </ul>

      {isPlayerB && (
        <div className="mt-10 h-20 flex items-center justify-center">
          <button
            onClick={handleConfirm}
            disabled={!localSelectedBossId}
            className={pipe(
              ['px-16', 'py-4', 'rounded-2xl', 'heading-2xl', 'transition-all'],
              concat(
                localSelectedBossId
                  ? ['bg-primary', 'text-content', 'hover:scale-105', 'shadow-xl', 'cursor-pointer']
                  : ['bg-ink/10', 'text-ink/30', 'cursor-not-allowed']
              ),
              join(' ')
            )}
          >
            선택 확정
          </button>
        </div>
      )}
    </div>
  )
}

export default BossSelect
