import BanItem from './BanItem'
import CandiBanItem from './CandiBanItem'
import { pipe, map, toArray, filter, sort, concat, join, includes, zipWithIndex } from '@fxts/core'
import { Typo } from '@zzz-picker/components/v2'
import { SelectAgent, type AgentId, BAN_PHASE, type Side } from '@zzz-picker/constant'
import { useAgent, useStore } from '@zzz-picker/provider'
import { useMemo, useState } from 'react'

type Props = {
  role: Side | 'H'
  banPhase: BAN_PHASE
  banCandidates: AgentId[]
  currentBan: SelectAgent[]
  onSelectAgent?: (agentId: AgentId) => void
  onSubmit?: (selectedBanId: AgentId | null) => void
}

/**
 * - **딜러**: `강공`, `이상`, `명파`
 * - **서포터**: `지원`, `격파`, `방어`
 */
function filterSpecialty(specialty: number) {
  switch (specialty) {
    case 1: // 이상
      return [1, 2, 3]
    case 2: // 명파
      return [1, 2, 3]
    case 3: // 강공
      return [1, 2, 3]
    case 4: // 지원
      return [4, 5, 6]
    case 5: // 방어
      return [4, 5, 6]
    case 6: // 격파
      return [4, 5, 6]
    default:
      return []
  }
}

/**
 * 현재 role이 활성 상태인지 확인합니다.
 * - A_SELECT → A만 활성
 * - B_BAN → B만 활성
 * - B_SELECT → B만 활성
 * - A_BAN → A만 활성
 */
function isActiveRole(role: Side | 'H', banPhase: BAN_PHASE): boolean {
  if (role === 'H') return false
  switch (banPhase) {
    case BAN_PHASE.A_SELECT:
      return role === 'A'
    case BAN_PHASE.B_BAN:
      return role === 'B'
    case BAN_PHASE.B_SELECT:
      return role === 'B'
    case BAN_PHASE.A_BAN:
      return role === 'A'
    default:
      return false
  }
}

/**
 * 현재 banPhase가 밴 선택(2명 중 1명 밴) 단계인지 확인합니다.
 */
function isBanSelectPhase(banPhase: BAN_PHASE): boolean {
  return banPhase === BAN_PHASE.B_BAN || banPhase === BAN_PHASE.A_BAN
}

const CandiBanList: React.FC<{
  list: AgentId[]
  activeId: AgentId | null
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}> = (props) => {
  return props.list.length === 0 ? null : (
    <ul className="flex gap-2 justify-center my-4">
      {pipe(
        props.list,
        map((agentId) => (
          <CandiBanItem
            active={agentId === props.activeId}
            onClick={props.onClick}
            key={agentId}
            agentId={agentId}
          />
        )),
        toArray
      )}
    </ul>
  )
}

const BanPhase: React.FC<Props> = (props) => {
  const { agents } = useStore()
  const firstBanAgent = useMemo(() => props.currentBan[0], [props.currentBan])
  const agent = useAgent(firstBanAgent || 0)
  const allowSpecialty = useMemo(() => {
    return filterSpecialty(agent?.specialty.id || 0)
  }, [agent])

  const active = isActiveRole(props.role, props.banPhase)
  const isBanPhase = isBanSelectPhase(props.banPhase)

  // 밴 선택 페이즈(B_BAN, A_BAN)에서 사용할 로컬 선택 상태
  const [selectedBanId, setSelectedBanId] = useState<AgentId | null>(null)

  const handleAgentClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!active) return
    const agentId = Number(event.currentTarget.value)
    if (isBanPhase) {
      // 밴 선택 페이즈: 후보 중 하나를 선택
      setSelectedBanId(agentId)
    } else {
      // 후보 제시 페이즈: 상위 콜백으로 전달
      props.onSelectAgent?.(agentId)
    }
  }

  const handleCandidateClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!active || !isBanPhase) return
    const agentId = Number(event.currentTarget.value)
    setSelectedBanId(agentId)
  }

  const handleSubmit = () => {
    if (!active) return
    props.onSubmit?.(selectedBanId)
    setSelectedBanId(null)
  }

  // 선택 완료 버튼 비활성화 조건
  const isSubmitDisabled = useMemo(() => {
    if (!active) return true
    if (isBanPhase) {
      return selectedBanId === null
    }
    return props.banCandidates.length !== 2
  }, [active, isBanPhase, selectedBanId, props.banCandidates])

  // 버튼 텍스트
  const submitLabel = '확인'

  return (
    <div className="size-full flex flex-col gap-4 py-4">
      <div className="px-4">
        <Typo.Heading heading={1} className="heading-4xl text-primary">
          Ban Agents
        </Typo.Heading>
        {/* 현재 Ban이 된 캐릭터들을 보여줍니다. */}
        <ul className="flex gap-2 justify-center my-4">
          {pipe(
            props.currentBan,
            zipWithIndex,
            map(([index, agentId]) => <BanItem key={index} agentId={agentId} />),
            toArray
          )}
        </ul>
      </div>
      {/* 현재 Ban이 가능한 캐릭터들을 리스트업합니다. */}
      <div className="flex-1 overflow-y-auto">
        <ul className="grid grid-cols-4 gap-2 gap-y-6 p-4 w-full max-w-2xl mx-auto">
          {pipe(
            agents,
            map(([, agent]) => agent),
            filter((agent) => agent.rarity === 'S'),
            filter((agent) => agent.isPickup),
            filter((agent) => !agent.isTeaser),
            sort((prev, cur) => prev.nameKo.localeCompare(cur.nameKo)),
            map((agent) => (
              <li key={agent.id}>
                <button
                  type="button"
                  aria-selected={includes(agent.id, props.banCandidates)}
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
                  disabled={
                    !active ||
                    isBanPhase ||
                    agent.isAllow ||
                    (props.banPhase === BAN_PHASE.B_SELECT &&
                      includes(agent.specialty.id, allowSpecialty))
                  }
                >
                  <div
                    style={{ backgroundColor: agent.color || 'transparent' }}
                    className={pipe(
                      ['card-2', 'inverse', 'max-w-24', 'w-full', 'aspect-square', 'ring-2'],
                      concat(['group-aria-selected:ring-primary']),
                      join(' ')
                    )}
                  >
                    <img src={agent.profile.url} alt={agent.nameKo} />
                  </div>
                  <span className="text-sm font-bold mt-1 text-ink">{agent.nameKo}</span>
                </button>
              </li>
            )),
            toArray
          )}
        </ul>
      </div>
      {/*
        선택 완료 버튼입니다.
        페이즈에 따라 아래 2개의 역할을 합니다.
        - 밴을 진행할 캐릭터 2개를 제시
        - 제시받은 캐릭터 2개중 하나를 선택하여, 최종 밴을 진행
      */}
      <div className="px-4 w-full max-w-md mx-auto">
        {isBanPhase && (
          <CandiBanList
            list={props.banCandidates}
            activeId={selectedBanId}
            onClick={handleCandidateClick}
          />
        )}
        <button
          type="button"
          disabled={isSubmitDisabled}
          onClick={handleSubmit}
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
          {submitLabel}
        </button>
      </div>
    </div>
  )
}

export default BanPhase
