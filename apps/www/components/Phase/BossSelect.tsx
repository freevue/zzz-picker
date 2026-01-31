import { ROOM_PHASE, type RoomData, type Rols } from './index'
import { pipe, map, toArray, concat, join, zipWithIndex } from '@fxts/core'
import { Typo } from '@zzz-picker/components/v2'
import { BAN_PHASE, type Boss, SOCKET_EVENT } from '@zzz-picker/constant'
import { useStore, useSocket } from '@zzz-picker/provider/hooks'
import { motion } from 'motion/react'
import { useMemo } from 'react'

type Props = {
  role: Rols
  room: RoomData
  onUpdate: (nextRoom: RoomData) => void
}

const BossSelect: React.FC<Props> = (props) => {
  const { boss: bossMap, deadlyAssaultList } = useStore()

  const bosses = useMemo(() => {
    const currentAssault = deadlyAssaultList[0] // 최신 3종 보스 셋
    if (!currentAssault) return []

    const allowedIds = [currentAssault.boss1.id, currentAssault.boss2.id, currentAssault.boss3.id]
    return allowedIds.map((id) => bossMap.get(id)).filter(Boolean) as Boss[]
  }, [bossMap, deadlyAssaultList])

  const { send } = useSocket()
  const handleSelect = (bossId: number) => {
    if (props.role !== 'B') return

    // 실시간 후보군 공유
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
    const currentBossId = (props.room.state as any).realtime?.bossCandidates
    if (props.role !== 'B' || !currentBossId) return

    props.onUpdate({
      ...props.room,
      state: {
        ...props.room.state,
        realtime: {
          ...props.room.state.realtime,
          phase: ROOM_PHASE.BAN,
          banPhase: BAN_PHASE.A_SELECT,
          bossCandidates: null, // 확정 시 초기화
        },
        play: {
          ...props.room.state.play,
          common: {
            ...props.room.state.play.common,
            boss: currentBossId,
          },
        },
      } as any,
    })

    // 실시간 확정 이벤트 전송
    send(SOCKET_EVENT.BOSS, { confirm: true, bossId: currentBossId, roundKey: 'common' })
  }

  const isPlayerB = props.role === 'B'
  const currentBossId = (props.room.state as any).realtime?.bossCandidates

  return (
    <div className="py-20 px-4 h-screen overflow-y-auto">
      <Typo.Heading className="heading-4xl text-ink text-center" heading={1}>
        {isPlayerB ? '공통 무대를 선택해주세요' : '플레이어 B가 보스를 선택 중입니다...'}
      </Typo.Heading>
      <ul className="flex flex-wrap mt-10 w-full justify-center gap-4 max-w-4xl mx-auto">
        {pipe(
          bosses,
          zipWithIndex,
          map(([index, boss]) => (
            <motion.li
              className="flex-1 w-1/3"
              key={boss.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.2 }}
            >
              <button
                className={pipe(
                  ['w-full', 'group', 'block', 'focus:outline-none', 'relative'],
                  concat(isPlayerB ? ['cursor-pointer'] : ['cursor-default']),
                  join(' ')
                )}
                type="button"
                onClick={() => handleSelect(boss.id)}
                disabled={!isPlayerB}
              >
                <div
                  className={pipe(
                    [
                      'w-full',
                      'overflow-hidden',
                      'rounded-bl-4xl',
                      'rounded-tr-4xl',
                      'bg-netural',
                      'border-4',
                      'transition-all',
                    ],
                    concat(
                      currentBossId === boss.id
                        ? ['border-primary shadow-xl shadow-primary/20 scale-105']
                        : isPlayerB
                          ? ['group-hover:border-primary/50', 'border-transparent', 'grayscale']
                          : ['border-transparent', 'grayscale', 'opacity-50']
                    ),
                    concat(
                      currentBossId && currentBossId !== boss.id ? ['grayscale opacity-50'] : []
                    ),
                    join(' ')
                  )}
                >
                  <img
                    className="block w-full aspect-[3/4] object-cover"
                    src={`/images/boss/${boss.id}.webp`}
                    alt={boss.nameKo}
                  />
                </div>
                <span
                  className={pipe(
                    [
                      'text-ink heading-xl mt-6 block w-full text-center break-keep transition-colors',
                    ],
                    concat(
                      currentBossId === boss.id ? ['text-primary'] : ['group-hover:text-primary']
                    ),
                    join(' ')
                  )}
                >
                  {boss.nameKo}
                </span>
              </button>
            </motion.li>
          )),
          toArray
        )}
      </ul>

      {isPlayerB && (
        <div className="mt-10 h-20 flex items-center justify-center">
          <button
            onClick={handleConfirm}
            disabled={!currentBossId}
            className={pipe(
              ['px-16', 'py-4', 'rounded-2xl', 'heading-2xl', 'transition-all'],
              concat(
                currentBossId
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
