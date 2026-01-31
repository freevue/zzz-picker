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

const AdminPick: React.FC<Props> = ({ room, onUpdate, onComplete }) => {
  const { agents, engines } = useStore()
  const { costTable } = useSetting()

  const [detailTarget, setDetailTarget] = useState<{ side: Side; index: number } | null>(null)
  const [isEnginesOpen, setIsEnginesOpen] = useState(false)

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

  const handleNicknameChange = (side: Side, value: string) => {
    onUpdate({
      ...room,
      names: { ...room.names, [side]: value },
      state: {
        ...room.state,
        play: {
          ...room.state.play,
          nickname: {
            ...room.state.play.nickname,
            [side]: value,
          },
        },
      } as any,
    })
  }

  return (
    <div className="flex flex-col items-end p-4 gap-10">
      <div>
        {/* Header: Nicknames */}
        <div className="flex p-4 gap-5 items-center bg-base sticky top-0 z-30 justify-center">
          <Form.Nickname
            side="A"
            value={room.state.play.nickname.A}
            placeholder="닉네임을 입력해주세요"
            onChange={(e) => handleNicknameChange('A', e.target.value)}
            className="w-80"
          />
          <Typo.Heading className="heading-3xl text-ink">VS</Typo.Heading>
          <Form.Nickname
            side="B"
            value={room.state.play.nickname.B}
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
            banAgents={banList as any}
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
            banAgents={banList as any}
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
