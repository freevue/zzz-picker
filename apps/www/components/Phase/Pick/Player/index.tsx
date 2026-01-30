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

const DEFAULT_PICK: PickInfo = {
  agentId: null,
  engineId: null,
  agentRate: 0,
  engineRate: 1,
}

const PlayerPick: React.FC<Props> = ({ room, role, onUpdate, onComplete }) => {
  const { agents, engines } = useStore()
  const { costTable } = useSetting()

  const [detailTarget, setDetailTarget] = useState<{ side: Side; index: number } | null>(null)

  // Picks and Rounds Data Mapping
  const picks = room.state.picks || {
    A: Array(6).fill(DEFAULT_PICK),
    B: Array(6).fill(DEFAULT_PICK),
  }
  const personalBoss = room.state.personalBoss || { A: null, B: null }
  const commonBoss = room.state.boss
  const banList = room.state.ban?.list || []

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
    const { roundId, side, picks: newPicks, detail, bossId, isCommon } = updates

    const nextRoom = { ...room }
    const nextState = { ...room.state }

    if (newPicks) {
      const startIndex = roundId === 'personal' ? 0 : 3
      const currentPicks = [...(picks[side as Side] || [])]
      newPicks.forEach((agentId: SelectAgent, i: number) => {
        const targetIndex = startIndex + i
        if (currentPicks[targetIndex]?.agentId !== agentId) {
          currentPicks[targetIndex] = { ...DEFAULT_PICK, agentId }
        }
      })
      nextState.picks = { ...picks, [side as Side]: currentPicks }
    }

    if (detail) {
      setDetailTarget({ side, index: detail.index })
    }

    if (bossId !== undefined) {
      if (isCommon) {
        nextState.boss = bossId
      } else {
        nextState.personalBoss = { ...personalBoss, [side as Side]: bossId }
      }
    }

    if (newPicks || bossId !== undefined) {
      onUpdate({ ...nextRoom, state: nextState })
    }
  }

  const handleDetailUpdate = (updates: Partial<PickInfo>) => {
    if (!detailTarget) return
    const { side, index } = detailTarget
    const currentPicks = [...(picks[side] || [])]
    currentPicks[index] = { ...currentPicks[index], ...updates }

    onUpdate({
      ...room,
      state: { ...room.state, picks: { ...picks, [side]: currentPicks } },
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
          banAgents={banList}
          data={{
            pickList: picks[role].slice(0, 3).map((p: any) => p.agentId),
            costList: getCosts(role).slice(0, 3),
            boss: personalBoss[role],
          }}
          onUpdate={handleUpdate}
        />
        <PlayerRound
          roundId="common"
          title="공용 무대"
          side={role}
          banAgents={banList}
          data={{
            pickList: picks[role].slice(3, 6).map((p: any) => p.agentId),
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
          {room.state.ready?.[role] ? '준비 완료 해제' : '선택 완료'}
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
