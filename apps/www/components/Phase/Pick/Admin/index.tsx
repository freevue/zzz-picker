import type { RoomData } from '../../index'
import { AdminRound } from './AdminRound'
import { isNumber } from '@fxts/core'
import { Icons } from '@zzz-picker/components'
import { Typo, Form, Dialog } from '@zzz-picker/components/v2'
import type { SelectAgent, Side, AgentCostSetting } from '@zzz-picker/constant'
import { useStore, useSetting } from '@zzz-picker/provider/hooks'
import { getTotalCost } from '@zzz-picker/utils'
import { useState } from 'react'

type Props = {
  room: RoomData
  onUpdate: (nextRoom: RoomData) => void
  onComplete: () => void
}

type PickInfo = {
  agentId: SelectAgent
  engineId: number | null
  agentRate: number
  engineRate: number
}

const DEFAULT_PICK: PickInfo = {
  agentId: null,
  engineId: null,
  agentRate: 0,
  engineRate: 1,
}

const AdminPick: React.FC<Props> = ({ room, onUpdate, onComplete }) => {
  const { agents, engines } = useStore()
  const { costTable } = useSetting()

  const [detailTarget, setDetailTarget] = useState<{ side: Side; index: number } | null>(null)
  const [isEnginesOpen, setIsEnginesOpen] = useState(false)

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

  const handleNicknameChange = (side: Side, value: string) => {
    onUpdate({
      ...room,
      names: { ...room.names, [side]: value },
    })
  }

  return (
    <div className="flex flex-col items-end p-4 gap-10">
      <div>
        {/* Header: Nicknames */}
        <div className="flex p-4 gap-5 items-center bg-base sticky top-0 z-30 justify-center">
          <Form.Nickname
            side="A"
            value={room.names.A}
            placeholder="닉네임을 입력해주세요"
            onChange={(e) => handleNicknameChange('A', e.target.value)}
            className="w-80"
          />
          <Typo.Heading className="heading-3xl text-ink">VS</Typo.Heading>
          <Form.Nickname
            side="B"
            value={room.names.B}
            placeholder="닉네임을 입력해주세요"
            onChange={(e) => handleNicknameChange('B', e.target.value)}
            className="w-80"
          />
        </div>

        {/* Rows */}
        <div className="flex flex-col p-4 gap-20">
          <AdminRound
            roundId="personal"
            title="개인 무대"
            banAgents={banList}
            data={{
              A: {
                pickList: picks.A.slice(0, 3).map((p: any) => p.agentId),
                costList: getCosts('A').slice(0, 3),
              },
              B: {
                pickList: picks.B.slice(0, 3).map((p: any) => p.agentId),
                costList: getCosts('B').slice(0, 3),
              },
              boss: personalBoss,
            }}
            onUpdate={handleUpdate}
          />

          <AdminRound
            roundId="common"
            title="공용 무대"
            banAgents={banList}
            data={{
              A: {
                pickList: picks.A.slice(3, 6).map((p: any) => p.agentId),
                costList: getCosts('A').slice(3, 6),
              },
              B: {
                pickList: picks.B.slice(3, 6).map((p: any) => p.agentId),
                costList: getCosts('B').slice(3, 6),
              },
              boss: { common: commonBoss },
            }}
            onUpdate={handleUpdate}
          />
        </div>

        {/* Footer / Floating */}
        <div className="flex justify-center mt-10">
          <button
            onClick={onComplete}
            type="button"
            className="px-16 py-5 bg-primary text-content rounded-2xl heading-2xl hover:scale-105 transition-all shadow-xl cursor-pointer"
          >
            모든 선택 완료 및 결과 저장
          </button>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog
        isOpen={!!detailTarget}
        onClose={() => setDetailTarget(null)}
        className="w-full max-w-2xl"
      >
        {detailTarget &&
          (() => {
            const tInfo = picks[detailTarget.side][detailTarget.index]
            const tAgent = agents.get(tInfo.agentId || 0)
            const tEngine = engines.get(tInfo.engineId || 0)
            if (!tAgent) return null

            return (
              <div className="w-full flex flex-col gap-6">
                <Typo.Heading className="heading-2xl text-primary">
                  {tAgent.fullNameKo}
                </Typo.Heading>
                {/* Simplified version for now */}
                <div className="flex gap-10">
                  <div className="w-40 aspect-[3/4] rounded-2xl overflow-hidden bg-netural">
                    <img src={tAgent.banner.url} alt={tAgent.nameKo} />
                  </div>
                  <div className="flex-1 flex flex-col gap-4">
                    <div>
                      <Typo.Body className="mb-2">캐릭터 돌파</Typo.Body>
                      <Form.Count
                        name="agentRate"
                        value={tInfo.agentRate}
                        min={0}
                        max={6}
                        onChange={(v) => handleDetailUpdate({ agentRate: v })}
                      />
                    </div>
                    <div>
                      <Typo.Body className="mb-2">엔진 선택</Typo.Body>
                      <button
                        className="w-20 h-20 bg-content rounded-xl border flex items-center justify-center overflow-hidden"
                        onClick={() => setIsEnginesOpen(true)}
                      >
                        {tEngine ? <img src={tEngine.imageUrl} /> : <Icons.Plus />}
                      </button>
                    </div>
                    <div>
                      <Typo.Body className="mb-2">엔진 돌파</Typo.Body>
                      <Form.Count
                        name="engineRate"
                        value={tInfo.engineRate}
                        min={1}
                        max={5}
                        onChange={(v) => handleDetailUpdate({ engineRate: v })}
                      />
                    </div>
                  </div>
                </div>
                <Dialog.Engines
                  isOpen={isEnginesOpen}
                  allowEngines={Array.from(tAgent.engine).map((e) => e.id)}
                  activeEngine={tInfo.engineId ? [tInfo.engineId] : undefined}
                  onClose={() => setIsEnginesOpen(false)}
                  onSelect={(e) => {
                    handleDetailUpdate({ engineId: Number(e.currentTarget.value) })
                    setIsEnginesOpen(false)
                  }}
                />
              </div>
            )
          })()}
      </Dialog>
    </div>
  )
}

export default AdminPick
