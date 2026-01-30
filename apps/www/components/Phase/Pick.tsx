import AdminPick from './Pick/Admin'
import PlayerPick from './Pick/Player'
import { ROOM_PHASE, type RoomData, type Rols } from './index'
import { pipe, concat, join, isNumber, map, toArray, filter } from '@fxts/core'
import { Icons } from '@zzz-picker/components'
import { Typo, Form, Dialog } from '@zzz-picker/components/v2'
import type { SelectAgent, Side, AgentCostSetting } from '@zzz-picker/constant'
import { useStore, useSetting } from '@zzz-picker/provider/hooks'
import { getTotalCost } from '@zzz-picker/utils'
import { motion } from 'motion/react'
import { useState, useMemo } from 'react'
import { BossDialog } from '~/components'

type Props = {
  role: Rols
  room: RoomData
  onUpdate: (nextRoom: RoomData) => void
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

// ----------------------------------------------------------------------------
// Sub Components
// ----------------------------------------------------------------------------

const BossButton = ({
  active,
  onClick,
  label,
  size = 'md',
  className,
}: {
  active: number | null
  onClick?: () => void
  label?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) => {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={pipe(
        ['relative', 'group', 'overflow-hidden', 'focus:outline-none', 'transition-all'],
        concat(
          active ? ['bg-netural'] : ['bg-content', 'border-2', 'border-dashed', 'border-ink/10']
        ),
        concat(
          size === 'lg'
            ? ['w-40', 'aspect-[3/4]', 'rounded-3xl']
            : size === 'md'
              ? ['w-32', 'aspect-[3/4]', 'rounded-2xl']
              : ['w-20', 'aspect-[3/4]', 'rounded-xl']
        ),
        concat(onClick ? ['cursor-pointer', 'hover:border-primary/50'] : ['cursor-default']),
        concat(className ? [className] : []),
        join(' ')
      )}
    >
      {active ? (
        <img
          src={`/images/boss/${active}.webp`}
          className="w-full h-full object-cover transition-transform group-hover:scale-110"
          alt="Boss"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <Icons.Plus
            className={pipe(
              ['text-ink/20', 'transition-colors'],
              concat(onClick ? ['group-hover:text-primary'] : []),
              concat(
                size === 'lg' ? ['w-12', 'h-12'] : size === 'md' ? ['w-8', 'h-8'] : ['w-6', 'h-6']
              ),
              join(' ')
            )}
          />
        </div>
      )}
      {label && !active && (
        <span className="absolute bottom-2 left-0 w-full text-center text-[10px] text-ink/30 uppercase font-bold tracking-widest">
          {label}
        </span>
      )}
    </button>
  )
}

// ----------------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------------

const Pick: React.FC<Props> = (props) => {
  const { agents, engines } = useStore()
  const { costTable, state: settingState } = useSetting()

  const [detailTarget, setDetailTarget] = useState<{ side: Side; index: number } | null>(null)
  const [bossTarget, setBossTarget] = useState<'common' | { type: 'personal'; side: Side } | null>(
    null
  )
  const [isEnginesOpen, setIsEnginesOpen] = useState(false)

  const isHost = props.role === 'H'

  // Ensure we have 6 slots for Default
  const defaultPicks = Array(6).fill(DEFAULT_PICK)
  const picks = props.room.state.picks || {
    A: [...defaultPicks],
    B: [...defaultPicks],
  }

  if (picks.A.length < 6) picks.A = [...picks.A, ...Array(6 - picks.A.length).fill(DEFAULT_PICK)]
  if (picks.B.length < 6) picks.B = [...picks.B, ...Array(6 - picks.B.length).fill(DEFAULT_PICK)]

  const personalBoss = props.room.state.personalBoss || { A: null, B: null }
  const commonBoss = props.room.state.boss
  const readyState = props.room.state.ready || { A: false, B: false }
  const banList = props.room.state.ban?.list || []

  // Helpers for Ban Agents
  const onComplete = () => {
    if (!isHost) return
    props.onUpdate({
      ...props.room,
      state: { ...props.room.state, phase: ROOM_PHASE.DONE },
    })
  }

  // --- Rendering Admin View ---
  if (isHost) {
    return <AdminPick room={props.room} onUpdate={props.onUpdate} onComplete={onComplete} />
  }

  const toggleReady = (side: Side) => {
    const nextReady = !readyState[side]
    props.onUpdate({
      ...props.room,
      state: {
        ...props.room.state,
        ready: { ...readyState, [side]: nextReady },
      },
    })
  }

  if (props.role === 'A' || props.role === 'B') {
    return (
      <PlayerPick
        room={props.room}
        role={props.role}
        onUpdate={props.onUpdate}
        onComplete={() => toggleReady(props.role as Side)}
      />
    )
  }

  // --- Rendering Player View (Existing code) ---
  const protectedAgents = useMemo(() => {
    return pipe(
      agents,
      filter(([, agent]) => agent.isAllow),
      map(([id]) => id),
      toArray
    )
  }, [agents])

  // ... rest of the existing code ...  // Computed
  const getPickList = (side: Side): SelectAgent[] => picks[side].map((p: PickInfo) => p.agentId)

  const getCosts = (side: Side) => {
    return picks[side].map((p: PickInfo) => {
      if (!isNumber(p.agentId)) return 0
      const agent = agents.get(p.agentId)
      const engine = engines.get(p.engineId || 0)
      return getTotalCost(costTable, [p as unknown as AgentCostSetting, agent, engine])
    })
  }

  // Handlers
  const handlePickChange = (side: Side, round: 1 | 2) => (newAgents: SelectAgent[]) => {
    if (readyState[side]) return

    const currentPicks = [...picks[side]]
    const startIndex = round === 1 ? 0 : 3

    newAgents.forEach((agentId, i) => {
      const targetIndex = startIndex + i
      const oldAgentId = currentPicks[targetIndex].agentId

      if (oldAgentId !== agentId) {
        currentPicks[targetIndex] = { ...DEFAULT_PICK, agentId }
      }
    })

    props.onUpdate({
      ...props.room,
      state: {
        ...props.room.state,
        picks: { ...picks, [side]: currentPicks },
      },
    })
  }

  const handleDetailUpdate = (updates: Partial<PickInfo>) => {
    if (!detailTarget) return
    const { side, index } = detailTarget

    if (readyState[side]) return

    const currentInfo = picks[side][index]
    const nextInfo = { ...currentInfo, ...updates }

    const nextPicks = { ...picks }
    nextPicks[side] = [...nextPicks[side]]
    nextPicks[side][index] = nextInfo

    props.onUpdate({
      ...props.room,
      state: { ...props.room.state, picks: nextPicks },
    })
  }

  const handleBossUpdate = (bossId: number) => {
    if (!bossTarget) return

    const side = bossTarget === 'common' ? 'B' : bossTarget.side
    if (readyState[side]) {
      setBossTarget(null)
      return
    }

    if (bossTarget === 'common') {
      props.onUpdate({
        ...props.room,
        state: { ...props.room.state, boss: bossId },
      })
    } else {
      const { side } = bossTarget
      props.onUpdate({
        ...props.room,
        state: {
          ...props.room.state,
          personalBoss: { ...personalBoss, [side]: bossId },
        },
      })
    }
    setBossTarget(null)
  }


  // --- Views ---

  // --- Unified Rendering ---

  const renderRound = (round: 1 | 2) => {
    const startIndex = round === 1 ? 0 : 3
    const endIndex = round === 1 ? 3 : 6

    const isMeA = props.role === 'A'
    const isMeB = props.role === 'B'
    const canEditA = isMeA && !readyState.A
    const canEditB = isMeB && !readyState.B

    // Boss Click Permissions
    const onBossClickA =
      round === 1 && canEditA ? () => setBossTarget({ type: 'personal', side: 'A' }) : undefined

    const onBossClickB = canEditB
      ? round === 1
        ? () => setBossTarget({ type: 'personal', side: 'B' })
        : () => setBossTarget('common')
      : undefined

    return (
      <div className="flex flex-col items-center w-full mb-16 last:mb-0 px-4">
        {/* Management Labels for Host / Simple Labels for Players */}
        <Typo.Heading className="text-ink/40 heading-sm mb-8 font-black tracking-[0.4em] uppercase text-center">
          {isHost
            ? round === 1
              ? 'Personal Stage (R1)'
              : 'Common Stage (R2)'
            : round === 1
              ? '개인 무대'
              : '공용 무대'}
        </Typo.Heading>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-10 w-full mb-4">
          {/* A Side */}
          <div
            className={pipe(
              ['flex', 'flex-col', 'items-center', 'gap-4', 'p-4', 'rounded-3xl', 'transition-all'],
              concat(
                isHost
                  ? ['bg-netural/5', 'border', 'border-ink/5']
                  : isMeA
                    ? ['bg-primary/5', 'border', 'border-primary/20', 'shadow-lg']
                    : ['opacity-70', 'grayscale-[0.5]']
              ),
              join(' ')
            )}
          >
            {isMeA && !isHost && (
              <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-widest mb-1">
                My Team
              </span>
            )}
            <Form.Party
              size="md"
              reverse={false}
              value={getPickList('A').slice(startIndex, endIndex)}
              cost={getCosts('A').slice(startIndex, endIndex)}
              deleteable={canEditA || isHost}
              onChange={canEditA || isHost ? handlePickChange('A', round) : undefined}
              onClick={
                canEditA || isHost
                  ? (_id, idx) => setDetailTarget({ side: 'A', index: startIndex + (idx || 0) })
                  : undefined
              }
              allowAgents={protectedAgents}
              banAgents={banList}
            />
          </div>

          {/* Center Boss Selection */}
          <div className="flex flex-col gap-6 items-center w-full sm:w-48 my-4 sm:my-0">
            {round === 1 ? (
              <div className="flex items-center gap-4 p-2 rounded-3xl bg-netural/5 border border-ink/5 shadow-inner">
                <div className="flex flex-col items-center gap-2">
                  <BossButton
                    active={personalBoss.A}
                    onClick={isHost || isMeA ? onBossClickA : undefined}
                    size="sm"
                    className={pipe(
                      ['rounded-2xl'],
                      concat(isMeA && !isHost ? ['ring-2 ring-primary/50'] : []),
                      join(' ')
                    )}
                  />
                  {isMeA && !isHost && (
                    <span className="text-[8px] font-bold text-primary italic">YOU</span>
                  )}
                </div>
                <Icons.Plus className="text-ink/20 w-4 h-4 flex-shrink-0" />
                <div className="flex flex-col items-center gap-2">
                  <BossButton
                    active={personalBoss.B}
                    onClick={isHost || isMeB ? onBossClickB : undefined}
                    size="sm"
                    className={pipe(
                      ['rounded-2xl'],
                      concat(isMeB && !isHost ? ['ring-2 ring-secondary/50'] : []),
                      join(' ')
                    )}
                  />
                  {isMeB && !isHost && (
                    <span className="text-[8px] font-bold text-secondary italic">YOU</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-2 rounded-3xl bg-netural/5 border border-ink/5 shadow-inner">
                <BossButton
                  active={commonBoss}
                  onClick={isHost || isMeB ? onBossClickB : undefined}
                  size="md"
                  className={pipe(
                    ['rounded-2xl', 'shadow-2xl'],
                    concat(isMeB && !isHost ? ['ring-2 ring-secondary/50'] : []),
                    join(' ')
                  )}
                  label={isHost ? undefined : props.role === 'A' ? 'Waiting' : 'Select'}
                />
              </div>
            )}
          </div>

          {/* B Side */}
          <div
            className={pipe(
              ['flex', 'flex-col', 'items-center', 'gap-4', 'p-4', 'rounded-3xl', 'transition-all'],
              concat(
                isHost
                  ? ['bg-netural/5', 'border', 'border-ink/5']
                  : isMeB
                    ? ['bg-secondary/5', 'border', 'border-secondary/20', 'shadow-lg']
                    : ['opacity-70', 'grayscale-[0.5]']
              ),
              join(' ')
            )}
          >
            {isMeB && !isHost && (
              <span className="text-[10px] font-black text-secondary bg-secondary/10 px-2 py-0.5 rounded-full uppercase tracking-widest mb-1">
                My Team
              </span>
            )}
            <Form.Party
              size="md"
              reverse={true}
              value={getPickList('B').slice(startIndex, endIndex)}
              cost={getCosts('B').slice(startIndex, endIndex)}
              deleteable={canEditB || isHost}
              onChange={canEditB || isHost ? handlePickChange('B', round) : undefined}
              onClick={
                canEditB || isHost
                  ? (_id, idx) => setDetailTarget({ side: 'B', index: startIndex + (idx || 0) })
                  : undefined
              }
              allowAgents={settingState.allowAgent}
              banAgents={banList}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center w-full max-w-7xl mx-auto pb-40">
      {/* Universal Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex w-full max-w-5xl px-8 py-6 gap-6 items-center justify-center bg-netural/5 border border-ink/5 rounded-3xl backdrop-blur-sm z-30 mb-20 shadow-2xl"
      >
        <div className="flex-1">
          <div
            className={pipe(
              [
                'bg-netural/10',
                'px-6',
                'py-4',
                'rounded-2xl',
                'border',
                'shadow-inner',
                'overflow-hidden',
              ],
              concat(props.role === 'A' ? ['border-primary/50 bg-primary/5'] : ['border-ink/10']),
              join(' ')
            )}
          >
            <Form.Nickname
              side="A"
              value={props.room.names.A}
              disabled
              className="!p-0 !bg-transparent text-center"
            />
          </div>
          {readyState.A && (
            <div className="text-center text-primary text-xs font-black tracking-widest mt-2 animate-pulse">
              READY
            </div>
          )}
        </div>

        <div className="flex flex-col items-center">
          <div className="px-4 py-1 bg-primary/20 rounded-full border border-primary/30">
            <span className="text-sm font-black italic text-primary tracking-tighter">VS</span>
          </div>
        </div>

        <div className="flex-1">
          <div
            className={pipe(
              [
                'bg-netural/10',
                'px-6',
                'py-4',
                'rounded-2xl',
                'border',
                'shadow-inner',
                'overflow-hidden',
              ],
              concat(
                props.role === 'B' ? ['border-secondary/50 bg-secondary/5'] : ['border-ink/10']
              ),
              join(' ')
            )}
          >
            <Form.Nickname
              side="B"
              value={props.room.names.B}
              disabled
              className="!p-0 !bg-transparent text-center"
            />
          </div>
          {readyState.B && (
            <div className="text-center text-secondary text-xs font-black tracking-widest mt-2 animate-pulse">
              READY
            </div>
          )}
        </div>
      </motion.div>

      {/* Rounds */}
      {renderRound(1)}
      <div className="w-full max-w-4xl h-px bg-ink/5 my-12" />
      {renderRound(2)}

      {/* Action Area */}
      <div className="mt-24">
        {props.role === 'H' ? (
          <button
            onClick={onComplete}
            disabled={!readyState.A || !readyState.B}
            className={pipe(
              ['px-12', 'py-4', 'rounded-2xl', 'heading-2xl', 'transition-all'],
              concat(
                readyState.A && readyState.B
                  ? [
                      'bg-primary',
                      'text-content',
                      'hover:scale-105',
                      'shadow-xl',
                      'shadow-primary/20',
                      'cursor-pointer',
                    ]
                  : ['bg-ink/10', 'text-ink/30', 'cursor-not-allowed']
              ),
              join(' ')
            )}
          >
            모든 선택 완료 및 종료
          </button>
        ) : (
          <button
            onClick={() => toggleReady(props.role as Side)}
            className={pipe(
              ['px-16', 'py-5', 'rounded-2xl', 'heading-2xl', 'transition-all', 'cursor-pointer'],
              concat(
                readyState[props.role as Side]
                  ? ['bg-ink/10', 'text-ink/50']
                  : [
                      'bg-primary',
                      'text-content',
                      'hover:scale-105',
                      'shadow-2xl',
                      'shadow-primary/30',
                    ]
              ),
              join(' ')
            )}
          >
            {readyState[props.role as Side] ? '수정하기' : '선택 완료'}
          </button>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog
        isOpen={!!detailTarget}
        onClose={() => setDetailTarget(null)}
        className="w-full max-w-2xl mx-4"
      >
        {detailTarget &&
          (() => {
            const tInfo = picks[detailTarget.side][detailTarget.index]
            const tAgent = agents.get(tInfo.agentId || 0)
            const tEngine = engines.get(tInfo.engineId || 0)
            if (!tAgent) return null

            const totalCost = getTotalCost(costTable, [
              tInfo as unknown as AgentCostSetting,
              tAgent,
              tEngine,
            ])

            return (
              <div className="w-full relative min-h-[480px] flex flex-col p-2 sm:p-0">
                <Typo.Heading className="heading-2xl sm:heading-4xl text-primary" heading={2}>
                  {tAgent.fullNameKo} +{totalCost}
                  <span
                    className="absolute -top-2 -right-2 text-6xl sm:text-9xl font-black block scale-150 sm:scale-200 opacity-5 shadow-sm italic"
                    style={{ color: tAgent.color || 'var(--color-secondary)' }}
                  >
                    {tAgent.rarity}
                  </span>
                </Typo.Heading>

                <div className="flex flex-col sm:flex-row mt-6 sm:mt-8 items-center sm:items-end relative z-10 flex-1 gap-6 sm:gap-8">
                  {/* Banner Image */}
                  <div className="relative w-40 sm:w-xs aspect-[3/4] sm:h-full flex items-start justify-start flex-shrink-0">
                    <img className="w-full block" src={tAgent.banner.url} alt={tAgent.nameKo} />
                  </div>

                  <div className="flex-1 w-full pb-4">
                    <Typo.Heading
                      className="heading-xl sm:heading-3xl text-primary mb-4 sm:mb-8"
                      heading={3}
                    >
                      Cost 설정
                    </Typo.Heading>
                    <div className="flex flex-col gap-6 sm:gap-8">
                      <div>
                        <Typo.Body className="body-md sm:body-xl mb-2">캐릭터 돌파</Typo.Body>
                        <Form.Count
                          min={0}
                          max={6}
                          step={1}
                          name="agentRate"
                          value={tInfo.agentRate}
                          className="bg-base/70"
                          onChange={(v) => handleDetailUpdate({ agentRate: v })}
                        />
                      </div>
                      <div className="flex flex-col items-center sm:items-start">
                        <Typo.Body className="body-md sm:body-xl mb-2 w-full text-left">
                          엔진 종류
                        </Typo.Body>
                        <button
                          type="button"
                          className="block aspect-square w-32 sm:w-40 bg-base rounded-tr-4xl rounded-bl-4xl relative focus:outline-none cursor-pointer group shadow-xl"
                          onClick={() => setIsEnginesOpen(true)}
                        >
                          {tEngine ? (
                            <img
                              className="block w-full relative"
                              src={tEngine.imageUrl}
                              alt={tEngine.nameKo}
                            />
                          ) : (
                            <Icons.Plus className="stroke-ink size-full group-hover:stroke-primary" />
                          )}
                        </button>
                      </div>
                      <div>
                        <Typo.Body className="body-md sm:body-xl mb-2">엔진 돌파</Typo.Body>
                        <Form.Count
                          min={1}
                          max={5}
                          step={1}
                          name="engineRate"
                          className="bg-base/70"
                          value={tInfo.engineRate}
                          onChange={(v) => handleDetailUpdate({ engineRate: v })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Dialog.Engines
                  isOpen={isEnginesOpen}
                  allowEngines={pipe(
                    tAgent.engine,
                    map((e) => e.id),
                    toArray
                  )}
                  activeEngine={tInfo.engineId ? [tInfo.engineId] : undefined}
                  onClose={() => setIsEnginesOpen(false)}
                  onSelect={(e) => {
                    const eid = Number(e.currentTarget.value)
                    handleDetailUpdate({ engineId: isNaN(eid) ? null : eid })
                    setIsEnginesOpen(false)
                  }}
                />
              </div>
            )
          })()}
      </Dialog>

      {/* Boss Dialog */}
      <Dialog isOpen={!!bossTarget} onClose={() => setBossTarget(null)}>
        <BossDialog
          active={
            bossTarget === 'common' ? commonBoss : bossTarget ? personalBoss[bossTarget.side] : null
          }
          onClick={(e) => handleBossUpdate(Number(e.currentTarget.value))}
        />
      </Dialog>
    </div>
  )
}

export default Pick
