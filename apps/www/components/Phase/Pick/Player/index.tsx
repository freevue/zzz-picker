import type { RoomData } from '../../index'
import { PlayerPickDialog, type PickInfo } from './PlayerPickDialog'
import { PlayerRound } from './PlayerRound'
import { isNumber } from '@fxts/core'
import { Dialog } from '@zzz-picker/components/v2'
import type { SelectAgent, Side, AgentCostSetting } from '@zzz-picker/constant'
import { useStore, useSetting } from '@zzz-picker/provider/hooks'
import { getTotalCost } from '@zzz-picker/utils'
import { useState } from 'react'

type Props = {
  room: RoomData
  role: 'A' | 'B'
  onUpdate: (nextRoom: RoomData) => void
  onComplete: () => void
}

const PlayerPick: React.FC<Props> = ({ room, role, onUpdate, onComplete }) => {
  const { agents, engines } = useStore()
  const { costTable } = useSetting()

  const [detailTarget, setDetailTarget] = useState<{ side: Side; index: number } | null>(null)

  const getPicksFromPlay = (side: Side) => {
    const r1 = room.state.play.personal[side].pickList
    const r2 =
      room.game_type === 'unlimited'
        ? room.state.play.unlimited[side].pickList
        : room.state.play.common[side].pickList
    return [...r1, ...r2].map(
      (agentId) =>
        ({
          agentId,
          engineId: null as number | null,
          agentRate: 0,
          engineRate: 1,
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
    const { roundId, side, picks: newPicks, bossId, isCommon } = updates

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

    const round1 = currentPicks.slice(0, 3).map((p) => p.agentId)
    const round2 = currentPicks.slice(3, 6).map((p) => p.agentId)
    const roundKey2 = room.game_type === 'unlimited' ? 'unlimited' : 'common'

    onUpdate({
      ...room,
      state: {
        ...room.state,
        play: {
          ...room.state.play,
          personal: {
            ...room.state.play.personal,
            [side]: { ...room.state.play.personal[side], pickList: round1 },
          },
          [roundKey2]: {
            ...(room.state.play as any)[roundKey2],
            [side]: { ...(room.state.play as any)[roundKey2][side], pickList: round2 },
          },
        },
      } as any,
    })
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
    </div>
  )
}

export default PlayerPick
