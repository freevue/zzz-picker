import type { RoomData } from '../../index'
import { PlayerPickDialog, type PickInfo } from './PlayerPickDialog'
import { PlayerRound } from './PlayerRound'
import { isNumber } from '@fxts/core'
import { Dialog } from '@zzz-picker/components/v2'
import type { SelectAgent, Side, AgentCostSetting } from '@zzz-picker/constant'
import { useStore, useSetting } from '@zzz-picker/provider/hooks'
import { getTotalCost } from '@zzz-picker/utils'
import { useState } from 'react'
import { BossDialog } from '~/components'

type Props = {
  room: RoomData
  role: Side
  onUpdate: (nextRoom: RoomData) => void
  onComplete: () => void
}

const PlayerPick: React.FC<Props> = ({ room, role, onUpdate, onComplete }) => {
  const { agents, engines } = useStore()
  const { costTable } = useSetting()

  const [detailTarget, setDetailTarget] = useState<{ side: Side; index: number } | null>(null)
  const [bossTarget, setBossTarget] = useState<{
    roundId: 'personal' | 'common'
    side?: Side
  } | null>(null)

  const getPicksFromPlay = (side: Side) => {
    const r1 = room.state.play.personal[side].pickList
    const c1 = room.state.play.personal[side].pickCost || [null, null, null]
    const r2 =
      room.game_type === 'unlimited'
        ? room.state.play.unlimited[side].pickList
        : room.state.play.common[side].pickList
    const c2 =
      room.game_type === 'unlimited'
        ? room.state.play.unlimited[side].pickCost || [null, null, null]
        : room.state.play.common[side].pickCost || [null, null, null]

    return [...r1, ...r2].map(
      (agentId, index) =>
        ({
          agentId,
          engineId: ([...c1, ...c2][index]?.engineId || null) as number | null,
          agentRate: ([...c1, ...c2][index]?.agentRate || 0) as number,
          engineRate: ([...c1, ...c2][index]?.engineRate || 1) as number,
        }) as PickInfo
    )
  }

  const picks = {
    A: getPicksFromPlay('A'),
    B: getPicksFromPlay('B'),
  }
  const personalBoss = {
    A: room.state.play.personal.A.boss,
    B: room.state.play.personal.B.boss,
  }
  const commonBoss = room.state.play.common.boss
  const banList = room.state.play.banList || []

  // Computed helper
  const getCosts = (side: Side) => {
    return (picks[side] || []).map((p: PickInfo) => {
      if (!isNumber(p.agentId)) return 0
      const agent = agents.get(p.agentId)
      const engine = engines.get(p.engineId || 0)
      return getTotalCost(costTable, [p as unknown as AgentCostSetting, agent, engine])
    })
  }

  const handleUpdate = (updates: any) => {
    const { roundId, side, picks: newPicks, bossId, isCommon, detail, base } = updates

    if (detail) {
      const offset = roundId !== 'personal' ? 3 : 0
      setDetailTarget({ side, index: detail.index + offset })
      return
    }

    if (base?.boss) {
      setBossTarget({ roundId: base.roundId, side: base.side })
      return
    }

    if (newPicks) {
      const roundKey =
        roundId === 'personal'
          ? 'personal'
          : room.game_type === 'unlimited'
            ? 'unlimited'
            : 'common'

      const newPickAgents = newPicks as SelectAgent[]

      onUpdate({
        ...room,
        state: {
          ...room.state,
          play: {
            ...room.state.play,
            [roundKey]: {
              ...(room.state.play as any)[roundKey],
              [side as Side]: {
                ...(room.state.play as any)[roundKey][side as Side],
                pickList: newPickAgents,
              },
            },
          },
        } as any,
      })
    }

    if (bossId !== undefined) {
      const roundKey =
        roundId === 'personal'
          ? 'personal'
          : room.game_type === 'unlimited'
            ? 'unlimited'
            : 'common'

      onUpdate({
        ...room,
        state: {
          ...room.state,
          play: {
            ...room.state.play,
            [roundKey]: {
              ...(room.state.play as any)[roundKey],
              ...(isCommon
                ? { boss: bossId }
                : {
                    [side as Side]: {
                      ...(room.state.play as any)[roundKey][side as Side],
                      boss: bossId,
                    },
                  }),
            },
          },
        } as any,
      })
    }
  }

  const handleDetailUpdate = (updates: Partial<PickInfo>) => {
    if (!detailTarget) return
    const { side, index } = detailTarget
    const currentPicks = [...picks[side]]
    currentPicks[index] = { ...currentPicks[index], ...updates }

    // Derive round pick lists (Agent IDs)
    const round1 = currentPicks.slice(0, 3).map((p) => p.agentId)
    const round2 = currentPicks.slice(3, 6).map((p) => p.agentId)

    // Derive cost settings with explicit casting and logging
    const c1 = currentPicks.slice(0, 3).map((p) =>
      p.agentId
        ? {
            agentId: Number(p.agentId),
            engineId: p.engineId ? Number(p.engineId) : null,
            agentRate: Number(p.agentRate || 0),
            engineRate: Number(p.engineRate || 1),
          }
        : null
    )
    const c2 = currentPicks.slice(3, 6).map((p) =>
      p.agentId
        ? {
            agentId: Number(p.agentId),
            engineId: p.engineId ? Number(p.engineId) : null,
            agentRate: Number(p.agentRate || 0),
            engineRate: Number(p.engineRate || 1),
          }
        : null
    )

    console.log('[PlayerPick] handleDetailUpdate:', { side, index, updates, c1, c2 })

    const roundKey2 = room.game_type === 'unlimited' ? 'unlimited' : 'common'

    onUpdate({
      ...room,
      state: {
        ...room.state,
        play: {
          ...room.state.play,
          personal: {
            ...room.state.play.personal,
            [side]: {
              ...room.state.play.personal[side],
              pickList: round1 as any,
              pickCost: c1 as any,
            },
          },
          [roundKey2]: {
            ...(room.state.play as any)[roundKey2],
            [side]: {
              ...(room.state.play as any)[roundKey2][side],
              pickList: round2 as any,
              pickCost: c2 as any,
            },
          },
        },
      } as any,
    })
  }

  const handleBossSelect = (bossId: number) => {
    if (!bossTarget) return
    const { roundId, side } = bossTarget
    handleUpdate({
      roundId,
      bossId,
      isCommon: roundId === 'common',
      side: side || role,
    })
    setBossTarget(null)
  }

  return (
    <div className="flex flex-col items-center w-full max-w-7xl mx-auto px-4 py-20 gap-10">
      {/* Rows */}
      <div className="w-full flex gap-14 flex-wrap items-center justify-center">
        <PlayerRound
          roundId="personal"
          title="개인 무대"
          side={role}
          banAgents={banList as any}
          data={{
            pickList: picks[role].slice(0, 3).map((p: any) => p.agentId) as any,
            costList: getCosts(role).slice(0, 3),
            boss: personalBoss[role],
          }}
          onUpdate={handleUpdate}
        />
        <PlayerRound
          roundId="common"
          title="공용 무대"
          side={role}
          banAgents={banList as any}
          data={{
            pickList: picks[role].slice(3, 6).map((p: any) => p.agentId) as any,
            costList: getCosts(role).slice(3, 6),
            boss: commonBoss,
          }}
          onUpdate={handleUpdate}
        />
      </div>

      {/* Footer / Floating */}
      <div className="my-10">
        <button
          onClick={onComplete}
          className="px-16 py-5 bg-primary text-content rounded-2xl heading-2xl hover:scale-105 transition-all shadow-xl cursor-pointer"
        >
          {room.state.realtime.ready?.[role] ? '준비 완료 해제' : '선택 완료'}
        </button>
      </div>

      {/* Detail Dialog */}
      {detailTarget &&
        (() => {
          const tInfo = picks[detailTarget.side][detailTarget.index]
          const tAgent = agents.get(tInfo.agentId || 0)
          const tEngine = engines.get(tInfo.engineId || 0)
          if (!tAgent) return null

          // Cast to any to avoid type mismatch if local PickInfo differs from Dialog's expected type,
          // though we should sync them.
          return (
            <Dialog isOpen={!!detailTarget} onClose={() => setDetailTarget(null)}>
              <PlayerPickDialog
                pickInfo={tInfo as any}
                agent={tAgent}
                engine={tEngine}
                onUpdate={handleDetailUpdate}
              />
            </Dialog>
          )
        })()}
      <Dialog isOpen={!!bossTarget} onClose={() => setBossTarget(null)}>
        <BossDialog
          active={null}
          onClick={(e) => handleBossSelect(Number(e.currentTarget.value))}
        />
      </Dialog>
    </div>
  )
}

export default PlayerPick
