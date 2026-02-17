import { pipe, map, toArray, filter, sort, concat, join, includes } from '@fxts/core'
import { Tabs, Typo, Form } from '@zzz-picker/components/v2'
import {
  type SelectAgent,
  type SelectBoss,
  type AgentId,
  type BossId,
  type Side,
  type AgentCostSetting,
} from '@zzz-picker/constant'
import { useAgent, useStore } from '@zzz-picker/provider'
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
  onSelectBoss?: (round: RoundKey, bossId: BossId) => void
  onSubmit?: () => void
  disabled?: boolean
}

const ROUND_LIST = [
  { value: 'personal', label: '라운드 1' },
  { value: 'common', label: '라운드 2' },
]

/**
 * 현재 라운드의 pickList에서 이미 선택된 에이전트 ID 목록을 반환합니다.
 */
function getSelectedAgentIds(pickList: Props['pickList'], round: RoundKey): AgentId[] {
  return pickList[round].filter((id): id is AgentId => id !== null)
}

/**
 * 선택 가능한 빈 슬롯의 인덱스를 반환합니다.
 */
function getNextEmptySlotIndex(pickList: [SelectAgent, SelectAgent, SelectAgent]): number | null {
  const index = pickList.findIndex((id) => id === null)
  return index >= 0 ? index : null
}

/**
 * Boss 슬롯 컴포넌트
 */
const BossSlot: React.FC<{
  bossId: SelectBoss
  label: string
  onClick?: () => void
}> = ({ bossId, label, onClick }) => {
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
          'rounded-bl-2xl',
          'rounded-tr-2xl',
          'w-full',
        ],
        concat(
          bossData ? ['bg-netural'] : ['bg-content', 'flex', 'items-center', 'justify-center']
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
        <span className="text-ink/40 heading-lg group-hover:text-primary transition-colors">+</span>
      )}
    </button>
  )
}

const PickPhase: React.FC<Props> = (props) => {
  const { agents } = useStore()
  const [round, setRound] = useState<string>('personal')

  const currentRound = round as RoundKey
  const currentPickList = props.pickList[currentRound]
  const currentBoss = props.boss[currentRound]
  const active = props.role !== 'H' && !props.disabled

  // 현재 라운드에서 선택된 에이전트 ID
  const selectedInCurrent = useMemo(
    () => getSelectedAgentIds(props.pickList, currentRound),
    [props.pickList, currentRound]
  )

  // 양쪽 라운드에서 선택된 모든 에이전트 (중복 선택 방지)
  const allSelectedAgents = useMemo(() => {
    const personal = props.pickList.personal.filter((id): id is AgentId => id !== null)
    const common = props.pickList.common.filter((id): id is AgentId => id !== null)
    return [...personal, ...common]
  }, [props.pickList])

  // Ban된 에이전트
  const bannedAgents = useMemo(
    () => props.banList.filter((id): id is AgentId => id !== null),
    [props.banList]
  )

  // 에이전트 그리드에서 클릭
  const handleAgentClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!active) return
    const agentId = Number(event.currentTarget.value)

    // 이미 선택된 에이전트면 무시
    if (includes(agentId, allSelectedAgents)) return

    // 다음 빈 슬롯에 배치
    const nextSlot = getNextEmptySlotIndex(currentPickList)
    if (nextSlot !== null) {
      props.onSelectAgent?.(currentRound, nextSlot, agentId)
    }
  }

  // 파티 슬롯에서 삭제
  const handlePickChange = (newPicks: SelectAgent[]) => {
    // 변경된 슬롯을 찾아 null로 업데이트
    newPicks.forEach((agentId, index) => {
      if (agentId !== currentPickList[index]) {
        props.onSelectAgent?.(currentRound, index, agentId as AgentId)
      }
    })
  }

  // 선택 완료 버튼 비활성화 조건
  const isSubmitDisabled = useMemo(() => {
    if (!active) return true
    // 양쪽 라운드 모두 3명씩 선택해야 함
    const personalFilled = props.pickList.personal.filter((id) => id !== null).length
    const commonFilled = props.pickList.common.filter((id) => id !== null).length
    return personalFilled < 3 || commonFilled < 3
  }, [active, props.pickList])

  return (
    <div className="size-full flex flex-col gap-4 py-4">
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
        <div className="flex items-center gap-4 justify-center max-w-md mx-auto">
          {/* 캐릭터 3슬롯 */}
          <div className="flex-1">
            <Form.Party
              size="md"
              value={currentPickList}
              deleteable={active}
              banAgents={bannedAgents}
              filterAgents={allSelectedAgents}
              onChange={handlePickChange}
              disabledHover
            />
          </div>
          {/* 보스 슬롯 */}
          <div className="w-20 shrink-0">
            <BossSlot
              bossId={currentBoss}
              label={currentRound === 'personal' ? '개인 무대' : '공용 무대'}
              onClick={() => {
                if (active && currentBoss === null) {
                  // TODO: 보스 선택 다이얼로그 연동
                }
              }}
            />
          </div>
        </div>
        {/* 선택 카운트 표시 */}
        <p className="text-center text-ink/60 body-lg mt-2">{selectedInCurrent.length} / 3</p>
      </div>

      {/* 캐릭터 선택 그리드 */}
      <div className="flex-1 overflow-y-auto">
        <ul className="grid grid-cols-4 gap-2 gap-y-6 p-4 w-full max-w-2xl mx-auto">
          {pipe(
            agents,
            map(([, agent]) => agent),
            filter((agent) => agent.rarity === 'S' || agent.rarity === 'A'),
            filter((agent) => !agent.isTeaser),
            sort((prev, cur) => {
              // S급 우선 정렬, 같은 등급 내 가나다순
              if (prev.rarity !== cur.rarity) {
                return prev.rarity === 'S' ? -1 : 1
              }
              return prev.nameKo.localeCompare(cur.nameKo)
            }),
            map((agent) => {
              const isSelected = includes(agent.id, allSelectedAgents)
              const isBanned = includes(agent.id, bannedAgents)
              const isDisabled = !active || isSelected || isBanned

              return (
                <li key={agent.id}>
                  <button
                    type="button"
                    aria-selected={includes(agent.id, selectedInCurrent)}
                    value={agent.id}
                    onClick={handleAgentClick}
                    className={pipe(
                      ['block', 'mx-auto', 'cursor-pointer', 'group'],
                      concat([
                        'disabled:opacity-50',
                        'disabled:grayscale',
                        'disabled:cursor-not-allowed',
                      ]),
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
                          'max-w-24',
                          'w-full',
                          'aspect-square',
                          'ring-2',
                          'ring-transparent',
                          'transition-all',
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
                    <span className="text-sm font-bold mt-1 text-ink block text-center">
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
    </div>
  )
}

export default PickPhase
