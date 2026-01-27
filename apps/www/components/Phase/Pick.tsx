import { ROOM_PHASE, type RoomData, type Rols } from './index'
import { pipe, concat, join, isNumber, map, toArray, filter } from '@fxts/core'
import { Icons } from '@zzz-picker/components'
import { Typo, Form, Dialog } from '@zzz-picker/components/v2'
import type { SelectAgent, Side, AgentCostSetting } from '@zzz-picker/constant'
import { useStore, useSetting } from '@zzz-picker/provider/hooks'
import { getTotalCost } from '@zzz-picker/utils'
import { motion, AnimatePresence } from 'motion/react'
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

  // States
  const [detailTarget, setDetailTarget] = useState<{ side: Side; index: number } | null>(null)
  const [bossTarget, setBossTarget] = useState<'common' | { type: 'personal'; side: Side } | null>(
    null
  )
  const [showPIP, setShowPIP] = useState(true)

  // Dialog Helper State
  const [isEnginesOpen, setIsEnginesOpen] = useState(false)

  const isHost = props.role === 'H'
  const mySide = isHost ? 'A' : (props.role as Side)
  const opponentSide = mySide === 'A' ? 'B' : 'A'

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

  // Helpers for Ban Agents
  const banList = props.room.state.ban?.list || []

  // 허용된 에이전트 목록 (Protected - 서버 데이터 기준)
  const protectedAgents = useMemo(() => {
    return pipe(
      agents,
      filter(([, agent]) => agent.isAllow),
      map(([id]) => id),
      toArray
    )
  }, [agents])

  // Computed
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

  const onComplete = () => {
    if (!isHost) return
    props.onUpdate({
      ...props.room,
      state: { ...props.room.state, phase: ROOM_PHASE.DONE },
    })
  }

  // --- Views ---

  const renderHostView = () => {
    const renderHostRound = (round: 1 | 2) => {
      const startIndex = round === 1 ? 0 : 3
      const endIndex = round === 1 ? 3 : 6

      return (
        <div className="flex justify-center items-center gap-10 w-full mb-12">
          {/* A Side */}
          <Form.Party
            size="md"
            reverse={false}
            value={getPickList('A').slice(startIndex, endIndex)}
            cost={getCosts('A').slice(startIndex, endIndex)}
            deleteable={false}
            allowAgents={protectedAgents}
            banAgents={banList}
          />

          {/* Center Boss */}
          <div className="flex flex-col gap-6 items-center -mt-10 w-40">
            {round === 1 ? (
              <div className="flex items-center shadow-lg rounded-2xl bg-content">
                <BossButton
                  active={personalBoss.A}
                  onClick={() => {}}
                  size="sm"
                  className="rounded-l-2xl rounded-r-none border-r-0!"
                />
                <div className="w-px h-10 bg-ink/5" />
                <BossButton
                  active={personalBoss.B}
                  onClick={() => {}}
                  size="sm"
                  className="rounded-r-2xl rounded-l-none border-l-0!"
                />
              </div>
            ) : (
              <div className="shadow-2xl rounded-3xl bg-content">
                <BossButton active={commonBoss} onClick={() => {}} size="md" label="Common" />
              </div>
            )}
          </div>

          {/* B Side */}
          <div className="w-[336px] flex flex-col items-end gap-4 pl-12">
            <Form.Party
              size="md"
              reverse={true}
              value={getPickList('B').slice(startIndex, endIndex)}
              cost={getCosts('B').slice(startIndex, endIndex)}
              deleteable={false}
              allowAgents={settingState.allowAgent}
              banAgents={banList}
            />
          </div>
        </div>
      )
    }

    return (
      <div className="flex flex-col items-center w-full max-w-7xl mx-auto pb-20">
        {/* Host Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex w-full p-4 gap-20 items-center justify-center sticky top-0 z-30 mb-8"
        >
          <div className="w-80">
            <Form.Nickname side="A" value={props.room.names.A} disabled />
            {readyState.A && <div className="text-center text-primary font-bold mt-2">READY</div>}
          </div>
          <Typo.Heading className="heading-3xl text-ink font-black italic">VS</Typo.Heading>
          <div className="w-80">
            <Form.Nickname side="B" value={props.room.names.B} disabled />
            {readyState.B && <div className="text-center text-secondary font-bold mt-2">READY</div>}
          </div>
        </motion.div>
        {renderHostRound(1)}
        <div className="w-full max-w-4xl h-px bg-ink/5 my-12" />
        {renderHostRound(2)}

        <div className="mt-20">
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
        </div>
      </div>
    )
  }

  const renderPlayerView = () => {
    const isMeReady = readyState[mySide]

    // Main Area Renders
    const renderMyRound = (round: 1 | 2) => {
      const startIndex = round === 1 ? 0 : 3
      const endIndex = round === 1 ? 3 : 6
      const pickList = getPickList(mySide).slice(startIndex, endIndex)
      const costList = getCosts(mySide).slice(startIndex, endIndex)
      const canEdit = !isMeReady

      // Boss Logic
      let bossActive: number | null = null
      let onBossClick: (() => void) | undefined = undefined

      if (round === 1) {
        bossActive = personalBoss[mySide]
        onBossClick = !isMeReady
          ? () => setBossTarget({ type: 'personal', side: mySide })
          : undefined
      } else {
        bossActive = commonBoss
        if (mySide === 'B') {
          onBossClick = !isMeReady ? () => setBossTarget('common') : undefined
        } else {
          onBossClick = undefined // A sees B's choice read-only
        }
      }

      return (
        <div className="flex items-center gap-8 w-full justify-center">
          {/* Boss Card (Large) */}
          <div className="flex flex-col items-center gap-2">
            <Typo.Heading className="text-ink/20 heading-md">BOSS</Typo.Heading>
            <BossButton
              active={bossActive}
              onClick={onBossClick}
              size="lg"
              className="shadow-xl"
              label={round === 2 && mySide === 'A' ? 'Opponent Choice' : 'Select'}
            />
          </div>

          {/* SVG Arrow */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            className="text-ink/10 flex-shrink-0"
          >
            <path
              d="M5 12H19M19 12L12 5M19 12L12 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Party Card */}
          <div className="flex flex-col items-center gap-2">
            <Typo.Heading className="text-ink/20 heading-md">PARTY</Typo.Heading>
            <Form.Party
              size="lg"
              value={pickList}
              cost={costList}
              deleteable={canEdit}
              onChange={canEdit ? handlePickChange(mySide, round) : undefined}
              onClick={
                canEdit
                  ? (_id, idx) => {
                      setDetailTarget({ side: mySide, index: startIndex + (idx || 0) })
                    }
                  : undefined
              }
              allowAgents={protectedAgents}
              banAgents={banList}
            />
          </div>
        </div>
      )
    }

    // PIP Area Renders
    const renderOpponentPIP = () => {
      const opPicks = getPickList(opponentSide)
      const opR1 = opPicks.slice(0, 3)
      const opR2 = opPicks.slice(3, 6)

      const opBossR1 = personalBoss[opponentSide]
      const opBossR2 = commonBoss

      return (
        <AnimatePresence>
          {showPIP && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 20 }}
              className="fixed top-24 right-8 w-64 bg-content/80 backdrop-blur-md border border-ink/5 rounded-2xl shadow-2xl overflow-hidden z-40"
            >
              <div className="bg-ink/5 px-4 py-2 flex justify-between items-center">
                <span className="font-bold text-ink/50 text-sm">
                  {props.room.names[opponentSide]}
                </span>
                {readyState[opponentSide] && (
                  <span className="text-[10px] bg-secondary text-content px-2 py-0.5 rounded-full font-bold">
                    READY
                  </span>
                )}
              </div>
              <div className="p-4 flex flex-col gap-4">
                {/* Round 1 */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-ink/30 font-bold">ROUND 1</span>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-ink/5 overflow-hidden flex-shrink-0">
                      {opBossR1 ? (
                        <img
                          src={`/images/boss/${opBossR1}.webp`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] text-ink/20">
                          BOSS
                        </div>
                      )}
                    </div>
                    <div className="w-px h-4 bg-ink/10" />
                    <div className="flex gap-1">
                      {opR1.map((id, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded bg-ink/5 overflow-hidden border border-ink/5"
                        >
                          {isNumber(id) && (
                            <img
                              src={agents.get(id)?.profile?.url}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Round 2 */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-ink/30 font-bold">ROUND 2</span>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-ink/5 overflow-hidden flex-shrink-0">
                      {opBossR2 ? (
                        <img
                          src={`/images/boss/${opBossR2}.webp`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] text-ink/20">
                          BOSS
                        </div>
                      )}
                    </div>
                    <div className="w-px h-4 bg-ink/10" />
                    <div className="flex gap-1">
                      {opR2.map((id, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded bg-ink/5 overflow-hidden border border-ink/5"
                        >
                          {isNumber(id) && (
                            <img
                              src={agents.get(id)?.profile?.url}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )
    }

    return (
      <div className="flex flex-col items-center w-full min-h-[calc(100vh-200px)] relative">
        {/* Toggle PIP Button */}
        <button
          onClick={() => setShowPIP(!showPIP)}
          className="fixed top-24 right-8 z-50 w-8 h-8 rounded-full bg-content border border-ink/10 shadow-lg flex items-center justify-center text-ink/30 hover:text-primary hover:border-primary transition-colors cursor-pointer"
          title="Toggle Opponent View"
        >
          {showPIP ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" />
            </svg>
          )}
        </button>
        <div className="fixed top-24 right-8 z-50 pointer-events-none">
          {/* Position placeholder for button logic, actual button is above */}
        </div>

        {renderOpponentPIP()}

        <div className="w-full max-w-4xl flex flex-col gap-16 mt-10">
          {/* My Header */}
          <div className="flex flex-col items-center gap-2">
            <Form.Nickname
              side={mySide as Side}
              value={props.room.names[mySide as Side]}
              disabled
            />
            {isMeReady ? (
              <span className="text-primary font-bold animate-pulse">WAITING FOR OPPONENT...</span>
            ) : (
              <span className="text-ink/30 text-sm">Please select your boss and party</span>
            )}
          </div>

          {/* Round 1 Main */}
          <div className="relative p-8 rounded-3xl bg-base border border-ink/5 shadow-sm">
            <div className="absolute top-0 left-8 -translate-y-1/2 bg-content px-4 py-1 rounded-full border border-ink/5 text-sm font-bold text-ink/50 shadow-sm">
              ROUND 1 (Personal)
            </div>
            {renderMyRound(1)}
          </div>

          {/* Round 2 Main */}
          <div className="relative p-8 rounded-3xl bg-base border border-ink/5 shadow-sm">
            <div className="absolute top-0 left-8 -translate-y-1/2 bg-content px-4 py-1 rounded-full border border-ink/5 text-sm font-bold text-ink/50 shadow-sm">
              ROUND 2 (Common)
            </div>
            {renderMyRound(2)}
          </div>

          {/* Action */}
          <div className="flex justify-center pb-20">
            <button
              onClick={() => toggleReady(mySide as Side)}
              className={pipe(
                ['px-16', 'py-5', 'rounded-2xl', 'heading-2xl', 'transition-all', 'cursor-pointer'],
                concat(
                  isMeReady
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
              {isMeReady ? '수정하기' : '선택 완료'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // --- Main Render ---

  return (
    <>
      {isHost ? renderHostView() : renderPlayerView()}

      {/* Detail Dialog (Playground Style) */}
      <Dialog
        isOpen={!!detailTarget}
        onClose={() => setDetailTarget(null)}
        className="w-2xl" // Increased width for Playground style
      >
        {detailTarget &&
          (() => {
            const tInfo = picks[detailTarget.side][detailTarget.index]
            const tAgent = agents.get(tInfo.agentId || 0)
            const tEngine = engines.get(tInfo.engineId || 0)
            const totalCost = getTotalCost(costTable, [
              tInfo as unknown as AgentCostSetting,
              tAgent,
              tEngine,
            ])

            if (!tAgent) return null

            return (
              <div className="w-full relative min-h-[480px] flex flex-col">
                <Typo.Heading className="heading-4xl text-primary" heading={2}>
                  {tAgent.fullNameKo} +{totalCost}
                  <span
                    className="absolute -top-2 -right-2 text-9xl font-black block scale-200 opacity-50 italic"
                    style={{ color: tAgent.color || 'var(--color-secondary)' }}
                  >
                    {tAgent.rarity}
                  </span>
                </Typo.Heading>

                <div className="flex mt-8 items-end relative z-10 flex-1 gap-8">
                  {/* Banner Image */}
                  <div className="block w-full relative w-xs h-full flex items-start justify-start">
                    <img className="w-full block" src={tAgent.banner.url} alt={tAgent.nameKo} />
                  </div>

                  {/* Settings Form */}
                  <div className="flex-1 pb-4">
                    <Typo.Heading className="heading-3xl text-primary" heading={3}>
                      Cost 설정
                    </Typo.Heading>
                    <div className="mt-8 flex flex-col gap-8">
                      {/* Agent Rate */}
                      <div>
                        <Typo.Body className="body-xl mb-2">캐릭터 돌파</Typo.Body>
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

                      {/* Engine Selection Toggle */}
                      <div>
                        <Typo.Body className="body-xl mb-2">엔진 종류</Typo.Body>
                        <button
                          type="button"
                          className={pipe(
                            [
                              'block',
                              'aspect-square',
                              'w-40',
                              'mx-auto',
                              'bg-base',
                              'rounded-tr-4xl',
                              'rounded-bl-4xl',
                              'relative',
                            ],
                            concat(['focus:outline-none', 'cursor-pointer', 'group']),
                            concat(tInfo.engineId ? ['bg-transparent'] : ['p-4']),
                            join(' ')
                          )}
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

                      {/* Engine Rate */}
                      <div>
                        <Typo.Body className="body-xl mb-2">엔진 돌파</Typo.Body>
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

                {/* Engine Select Sub-Dialog */}
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
    </>
  )
}

export default Pick
