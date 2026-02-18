import CostDialog from './CostDialog'
import {
  pipe,
  map,
  toArray,
  filter,
  sort,
  concat,
  join,
  includes,
  find,
  isUndefined,
  throwIf,
} from '@fxts/core'
import { Plus } from '@zzz-picker/components/icons'
import { Tabs, Typo, Dialog } from '@zzz-picker/components/v2'
import {
  type SelectAgent,
  type SelectBoss,
  type AgentId,
  type BossId,
  type Side,
  type AgentCostSetting,
  type Rarity,
  type Boss,
} from '@zzz-picker/constant'
import { useAgent, useStore } from '@zzz-picker/provider'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'

type RoundKey = 'personal' | 'common'

type Props = {
  role: Side | 'H'
  pickList: {
    personal: [SelectAgent, SelectAgent, SelectAgent]
    common: [SelectAgent, SelectAgent, SelectAgent]
  }
  pickCost?: {
    personal: [AgentCostSetting | null, AgentCostSetting | null, AgentCostSetting | null]
    common: [AgentCostSetting | null, AgentCostSetting | null, AgentCostSetting | null]
  }
  boss: {
    personal: SelectBoss
    common: SelectBoss
  }
  banList: SelectAgent[]
  onSelectAgent?: (round: RoundKey, index: number, agentId: AgentId) => void
  onRemoveAgent?: (round: RoundKey, index: number) => void
  onSelectBoss?: (round: RoundKey, bossId: BossId) => void
  onCostChange?: (round: RoundKey, index: number, setting: AgentCostSetting) => void
  slotCosts?: {
    personal: [number, number, number]
    common: [number, number, number]
  }
  onSubmit?: () => void
  disabled?: boolean
}

const ROUND_LIST = [
  { value: 'personal', label: '라운드 1' },
  { value: 'common', label: '라운드 2' },
]

/**
 * 선택 가능한 빈 슬롯의 인덱스를 반환합니다.
 */
function getNextEmptySlotIndex(pickList: [SelectAgent, SelectAgent, SelectAgent]): number | null {
  const index = pickList.findIndex((id) => id === null)
  return index >= 0 ? index : null
}

/**
 * 파티 슬롯 캐릭터 카드
 */
const PartySlotCard: React.FC<{
  agentId: SelectAgent
  index: number
  active: boolean
  cost?: number
  onClick?: () => void
}> = ({ agentId, active, cost, onClick }) => {
  const agent = useAgent(agentId || 0)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={agentId ? onClick : undefined}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          agentId && onClick?.()
        }
      }}
      className={pipe(
        [
          'relative',
          'aspect-square',
          'w-full',
          'overflow-hidden',
          'card-2',
          'inverse',
          'transition-all',
          'duration-200',
          'group/slot',
        ],
        concat(
          agentId
            ? ['cursor-pointer', 'ring-2', 'ring-transparent', 'hover:ring-primary']
            : ['bg-content', 'flex', 'items-center', 'justify-center']
        ),
        join(' ')
      )}
    >
      {agentId && agent ? (
        <>
          <div className="size-full" style={{ backgroundColor: agent.color || 'transparent' }}>
            <img
              src={agent.profile.url}
              alt={agent.nameKo}
              className="block w-full h-full object-cover"
            />
          </div>
          {/* Cost 표시 (좌상단) */}
          {cost !== undefined && cost > 0 && (
            <div
              className={pipe(
                [
                  'absolute',
                  'top-0',
                  'left-0',
                  'bg-base/70',
                  'backdrop-blur-sm',
                  'px-2',
                  'py-0.5',
                  'rounded-br-lg',
                ],
                join(' ')
              )}
            >
              <span className="text-ink text-sm font-black">{cost}</span>
            </div>
          )}
        </>
      ) : (
        <Plus className="size-1/3 stroke-ink/30" />
      )}
    </div>
  )
}

/**
 * Boss 슬롯 컴포넌트
 */
const BossSlot: React.FC<{
  bossId: SelectBoss
  onClick?: () => void
}> = ({ bossId, onClick }) => {
  const { boss } = useStore()
  const bossData = useMemo(() => (bossId === null ? undefined : boss.get(bossId)), [boss, bossId])

  return (
    <button
      type="button"
      onClick={onClick}
      className={pipe(
        [
          'aspect-[3/4]',
          'cursor-pointer',
          'focus:outline-none',
          'group',
          'overflow-hidden',
          'card-2',
          'inverse',
          'w-full',
          'transition-all',
          'duration-200',
        ],
        concat(
          bossData
            ? ['bg-netural', 'ring-2', 'ring-transparent', 'hover:ring-primary']
            : ['bg-content', 'flex', 'items-center', 'justify-center']
        ),
        join(' ')
      )}
    >
      {bossData ? (
        <img
          className="block w-full"
          src={`/images/boss/${bossData.id}.webp`}
          alt={bossData.nameKo}
        />
      ) : (
        <Plus className="size-2/4 stroke-ink/30 group-hover/button:stroke-primary" />
      )}
    </button>
  )
}

const PickPhase: React.FC<Props> = (props) => {
  const { agents, deadlyAssaultList } = useStore()
  const [round, setRound] = useState<string>('personal')
  const [rarity, setRarity] = useState<Rarity>('S')
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null)
  const [isBossDialogOpen, setIsBossDialogOpen] = useState(false)
  const [selectedBossIndex, setSelectedBossIndex] = useState<number | undefined>(undefined)

  const currentRound = round as RoundKey
  const currentPickList = props.pickList[currentRound]
  const currentPickCost = props.pickCost?.[currentRound]
  const currentBoss = props.boss[currentRound]
  const active = props.role !== 'H' && !props.disabled
  const isPersonalRound = currentRound === 'personal'
  const currentSlotCosts = props.slotCosts?.[currentRound] || [0, 0, 0]

  // 양쪽 라운드에서 선택된 모든 에이전트 (중복 선택 방지)
  const allSelectedAgents = useMemo(() => {
    const personal = props.pickList.personal.filter((id): id is AgentId => id !== null)
    const common = props.pickList.common.filter((id): id is AgentId => id !== null)
    return [...personal, ...common]
  }, [props.pickList])

  // 현재 라운드에서 선택된 에이전트
  const selectedInCurrent = useMemo(
    () => currentPickList.filter((id): id is AgentId => id !== null),
    [currentPickList]
  )

  // 현재 라운드 슬롯이 꽉 찼는지
  const isCurrentRoundFull = useMemo(() => selectedInCurrent.length >= 3, [selectedInCurrent])

  // 다른 라운드에서 선택된 에이전트
  const otherRoundAgents = useMemo(() => {
    const otherRound = currentRound === 'personal' ? 'common' : 'personal'
    return props.pickList[otherRound].filter((id): id is AgentId => id !== null)
  }, [props.pickList, currentRound])

  // Ban된 에이전트
  const bannedAgents = useMemo(
    () => props.banList.filter((id): id is AgentId => id !== null),
    [props.banList]
  )

  // 보스 리스트 (deadlyAssaultList 기반, 현재 시점 활성 보스 3개)
  const bossList = useMemo(() => {
    try {
      return pipe(
        deadlyAssaultList,
        sort((prev, curr) => dayjs(curr.open).diff(dayjs(prev.open))),
        find((deadlyAssault) => dayjs(deadlyAssault.open).isBefore(dayjs())),
        throwIf(isUndefined, () => Error('')),
        ({ boss1, boss2, boss3 }) => [boss1, boss2, boss3] as Pick<Boss, 'id' | 'nameKo'>[]
      )
    } catch {
      return [] as Pick<Boss, 'id' | 'nameKo'>[]
    }
  }, [deadlyAssaultList])

  // 양쪽 라운드에서 선택된 보스 ID 목록 (현재 라운드 제외)
  const selectedBossIds = useMemo(() => {
    const otherRound = currentRound === 'personal' ? 'common' : 'personal'
    const otherBoss = props.boss[otherRound]
    return otherBoss !== null ? [otherBoss] : []
  }, [props.boss, currentRound])

  // 에이전트 그리드에서 클릭 (토글 방식)
  const handleAgentClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!active) return
    const agentId = Number(event.currentTarget.value)

    // 현재 라운드에서 선택된 캐릭터면 → 제거
    const indexInCurrent = currentPickList.indexOf(agentId)
    if (indexInCurrent >= 0) {
      props.onRemoveAgent?.(currentRound, indexInCurrent)
      return
    }

    // 다른 라운드에서 선택된 캐릭터면 무시
    if (includes(agentId, otherRoundAgents)) return

    // 다음 빈 슬롯에 배치
    const nextSlot = getNextEmptySlotIndex(currentPickList)
    if (nextSlot !== null) {
      props.onSelectAgent?.(currentRound, nextSlot, agentId)
    }
  }

  // 파티 슬롯에서 캐릭터 클릭 → CostDialog 열기
  const handlePartySlotClick = (index: number) => {
    if (!active) return
    const agentId = currentPickList[index]
    if (agentId !== null) {
      setSelectedSlotIndex(index)
    }
  }

  // 보스 선택 핸들러
  const handleBossSelect = (event: React.MouseEvent<HTMLButtonElement>) => {
    const bossId = Number(event.currentTarget.value)
    props.onSelectBoss?.(currentRound, bossId)
  }

  // 보스 선택 확정
  const handleBossSubmit = () => {
    setIsBossDialogOpen(false)
  }

  // CostDialog에서 설정 변경
  const handleCostChange = (setting: AgentCostSetting) => {
    if (selectedSlotIndex !== null) {
      props.onCostChange?.(currentRound, selectedSlotIndex, setting)
    }
  }

  // CostDialog 닫기
  const closeCostDialog = () => {
    setSelectedSlotIndex(null)
  }

  // 선택 완료 버튼 비활성화 조건
  const isSubmitDisabled = useMemo(() => {
    if (!active) return true
    const personalFilled = props.pickList.personal.filter((id) => id !== null).length
    const commonFilled = props.pickList.common.filter((id) => id !== null).length
    return personalFilled < 3 || commonFilled < 3
  }, [active, props.pickList])

  // 현재 CostDialog에 표시할 에이전트/설정
  const selectedAgentForDialog =
    selectedSlotIndex !== null ? currentPickList[selectedSlotIndex] : null
  const selectedCostForDialog =
    selectedSlotIndex !== null && currentPickCost ? currentPickCost[selectedSlotIndex] : null

  return (
    <div className="size-full flex flex-col gap-3 sm:gap-4 py-4">
      {/* 타이틀 */}
      <div className="px-4">
        <Typo.Heading heading={1} className="heading-4xl text-primary">
          Pick Agents
        </Typo.Heading>
      </div>

      {/* 라운드 탭 */}
      <div className="px-4">
        <Tabs value={round} className="bg-content" list={ROUND_LIST} onChange={setRound} />
      </div>

      {/* 파티 슬롯 + 보스 슬롯 */}
      <div className="px-4">
        <div
          className={pipe(
            ['flex', 'gap-3', 'justify-center', 'max-w-md', 'mx-auto'],
            concat(['flex-col', 'items-center']),
            concat(['sm:flex-row', 'sm:items-start', 'sm:gap-4']),
            join(' ')
          )}
        >
          {/* 캐릭터 3슬롯 */}
          <div className={pipe(['flex', 'gap-2', 'w-full'], concat(['sm:flex-1']), join(' '))}>
            {currentPickList.map((agentId, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-1">
                <PartySlotCard
                  agentId={agentId}
                  index={index}
                  active={active}
                  cost={currentSlotCosts[index]}
                  onClick={() => handlePartySlotClick(index)}
                />
              </div>
            ))}
          </div>

          {/* 보스 슬롯 */}
          <div className={pipe(['shrink-0'], concat(['w-24', 'sm:w-20']), join(' '))}>
            <BossSlot
              bossId={currentBoss}
              onClick={() => {
                if (active && isPersonalRound) {
                  setIsBossDialogOpen(true)
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* 등급 필터 탭 */}
      <div className="px-4">
        <Tabs
          className="bg-content max-w-xs mx-auto"
          list={['S', 'A']}
          value={rarity}
          onChange={(value) => setRarity(value as Rarity)}
        />
      </div>

      {/* 캐릭터 선택 그리드 */}
      <div className="flex-1 overflow-y-auto">
        <ul
          className={pipe(
            ['grid', 'gap-2', 'gap-y-5', 'p-4', 'w-full', 'max-w-2xl', 'mx-auto'],
            concat(['grid-cols-3', 'sm:grid-cols-4']),
            join(' ')
          )}
        >
          {pipe(
            agents,
            map(([, agent]) => agent),
            filter((agent) => agent.rarity === rarity),
            filter((agent) => !agent.isTeaser),
            sort((prev, cur) => prev.nameKo.localeCompare(cur.nameKo)),
            sort((prev) => (prev.isPickup ? 1 : -1)),
            map((agent) => {
              const isSelectedInCurrent = includes(agent.id, selectedInCurrent)
              const isSelectedInOther = includes(agent.id, otherRoundAgents)
              const isBanned = includes(agent.id, bannedAgents)
              // 비활성화 조건: Ban됨 또는 다른 라운드에서 선택됨 또는 (슬롯 꽉 참 && 현재 라운드에서 미선택)
              const isDisabled =
                !active ||
                isBanned ||
                isSelectedInOther ||
                (isCurrentRoundFull && !isSelectedInCurrent)

              return (
                <li key={agent.id}>
                  <button
                    type="button"
                    aria-selected={isSelectedInCurrent}
                    value={agent.id}
                    onClick={handleAgentClick}
                    className={pipe(
                      ['block', 'mx-auto', 'cursor-pointer', 'group', 'w-full'],
                      concat(['disabled:opacity-40', 'disabled:cursor-not-allowed']),
                      join(' ')
                    )}
                    disabled={isDisabled}
                  >
                    <div
                      style={{
                        backgroundColor: agent.color || 'transparent',
                      }}
                      className={pipe(
                        [
                          'card-2',
                          'inverse',
                          'w-full',
                          'max-w-24',
                          'mx-auto',
                          'aspect-square',
                          'ring-2',
                          'ring-transparent',
                          'transition-all',
                          'duration-200',
                        ],
                        concat([
                          'group-aria-selected:ring-primary',
                          'group-aria-selected:scale-105',
                        ]),
                        join(' ')
                      )}
                    >
                      <img src={agent.profile.url} alt={agent.nameKo} />
                    </div>
                    <span className="text-xs sm:text-sm font-bold mt-1 text-ink block text-center truncate">
                      {agent.nameKo}
                    </span>
                  </button>
                </li>
              )
            }),
            toArray
          )}
        </ul>
      </div>

      {/* 선택 완료 버튼 */}
      <div className="px-4 w-full max-w-md mx-auto">
        <button
          type="button"
          disabled={isSubmitDisabled}
          onClick={props.onSubmit}
          className={pipe(
            [
              'card',
              'py-2',
              'heading-xl',
              'full',
              'w-full',
              'block',
              'bg-primary',
              'text-ink',
              'cursor-pointer',
            ],
            concat(['disabled:opacity-50', 'disabled:cursor-not-allowed', 'disabled:bg-content']),
            join(' ')
          )}
        >
          선택 완료
        </button>
      </div>

      {/* CostDialog */}
      <Dialog isOpen={selectedAgentForDialog !== null} onClose={closeCostDialog} closeable>
        {selectedAgentForDialog && (
          <CostDialog
            agentId={selectedAgentForDialog}
            costSetting={
              selectedCostForDialog || {
                agentId: selectedAgentForDialog,
                engineId: null,
                agentRate: 0,
                engineRate: 1,
              }
            }
            onCostChange={handleCostChange}
          />
        )}
      </Dialog>

      {/* 보스 선택 Dialog (개인무대 전용) */}
      <Dialog isOpen={isBossDialogOpen} onClose={() => setIsBossDialogOpen(false)}>
        <div className="w-full max-w-2xl mx-auto py-8">
          <Typo.Heading className="heading-4xl text-primary text-center break-keep">
            Boss Select
          </Typo.Heading>
          <ul className="flex flex-wrap mt-8 gap-6 w-full justify-center">
            {bossList.map((boss, index) => (
              <li key={boss.id} className="mx-auto">
                <button
                  aria-selected={currentBoss === boss.id}
                  disabled={includes(boss.id, selectedBossIds)}
                  className={pipe(
                    [
                      'w-36',
                      'sm:w-52',
                      'aspect-[3/4]',
                      'group',
                      'block',
                      'focus:outline-none',
                      'cursor-pointer',
                    ],
                    concat(['disabled:opacity-40', 'disabled:cursor-not-allowed']),
                    join(' ')
                  )}
                  type="button"
                  value={boss.id}
                  onClick={(e) => {
                    handleBossSelect(e)
                    setSelectedBossIndex(index)
                  }}
                >
                  <div
                    className={pipe(
                      ['w-full', 'card', 'bg-netural', 'border-3', 'border-transparent'],
                      concat(['group-aria-selected:border-primary']),
                      join(' ')
                    )}
                  >
                    <img className="block w-full" src={`/images/boss/${boss.id}.webp`} alt="" />
                  </div>
                  <span
                    className={pipe(
                      [
                        'text-ink',
                        'heading-lg',
                        'mt-4',
                        'block',
                        'w-full',
                        'text-center',
                        'group-hover:text-primary',
                        'break-keep',
                      ],
                      concat(['group-aria-selected:text-primary']),
                      join(' ')
                    )}
                  >
                    {boss.nameKo}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <button
            className={pipe(
              [
                'card',
                'py-2',
                'heading-xl',
                'w-full',
                'block',
                'full',
                'mt-8',
                'bg-primary',
                'text-ink',
                'max-w-xs',
                'mx-auto',
                'cursor-pointer',
              ],
              concat(['disabled:opacity-50', 'disabled:cursor-not-allowed', 'disabled:bg-content']),
              join(' ')
            )}
            onClick={handleBossSubmit}
            disabled={currentBoss === null}
            type="button"
          >
            선택 완료
          </button>
        </div>
      </Dialog>
    </div>
  )
}

export default PickPhase
