import type { Rols, RoomData } from '.'
import { ROOM_PHASE } from '.'
import { pipe, filter, map, toArray, concat, join, isNull } from '@fxts/core'
import { Typo, Form } from '@zzz-picker/components/v2'
import { BAN_PHASE, type SelectAgent } from '@zzz-picker/constant'
import { useStore } from '@zzz-picker/provider/hooks'
import { useMemo, useState } from 'react'

type Props = {
  role: Rols
  room: RoomData
  onUpdate: (nextRoom: RoomData) => void
}

const Ban: React.FC<Props> = (props) => {
  const { agents } = useStore()
  const [selectedToBan, setSelectedToBan] = useState<number | null>(null)

  const banState = props.room.state.ban
  const phase = banState.phase as BAN_PHASE
  const candidates = banState.candidates as [SelectAgent, SelectAgent]
  const bannedList = banState.list as number[]

  const getAgentPosition = (agentId: number | null) => {
    if (isNull(agentId)) return null
    return agents.get(agentId)?.specialty.id
  }

  // 포지션 그룹 정의 (DB Specialty ID 기준)
  // 딜러: 이상(1), 명파(2), 강공(3)
  const DEALER_IDS = [1, 2, 3]
  // 서포터: 지원(4), 방어(5), 격파(6)
  const SUPPORTER_IDS = [4, 5, 6]

  const getAgentGroup = (specialtyId?: number) => {
    if (!specialtyId) return null
    if (DEALER_IDS.includes(specialtyId)) return 'DEALER'
    if (SUPPORTER_IDS.includes(specialtyId)) return 'SUPPORTER'
    return null
  }

  // 허용된 에이전트 목록 (Protected - 서버 데이터 기준)
  const protectedAgents = useMemo(() => {
    return pipe(
      agents,
      filter(([, agent]) => agent.isAllow),
      map(([id]) => id),
      toArray
    )
  }, [agents])

  // 전체 선택 가능한 풀 (S급 픽업 & Allow Agent 제외)
  const pool = useMemo(() => {
    return pipe(
      agents,
      filter(([, agent]) => agent.isPickup && agent.rarity === 'S'),
      map(([id]) => id),
      // Rule: 허용된 에이전트는 밴 목록에서 아예 제외 (보이지 않음)
      filter((id) => !protectedAgents.includes(id)),
      toArray
    )
  }, [agents, protectedAgents])

  // 비활성화 목록 계산 (Disabled Logic - Position Rule Only)
  const disabledAgents = useMemo(() => {
    // 1. 이미 밴 리스트에 포함된 캐릭터 (중복 선택 불가)
    const list = [...bannedList]

    // 2. 룰: B선수가 선택한(밴한) 캐릭터와 *같은 포지션 그룹*의 캐릭터 선택 불가
    // 딜러(강공, 이상, 명파) <-> 서포터(격파, 지원, 방어)
    if (phase === BAN_PHASE.B_SELECT) {
      const lastBannedId = bannedList[bannedList.length - 1]
      const lastBannedSpecialty = getAgentPosition(lastBannedId)
      const lastBannedGroup = getAgentGroup(lastBannedSpecialty)

      // 풀 전체를 순회하며 그룹이 같은지 확인
      const sameGroupAgents = pool.filter((id) => {
        const agentSpecialty = getAgentPosition(id)
        return getAgentGroup(agentSpecialty) === lastBannedGroup
      })
      list.push(...sameGroupAgents)
    }

    return list
  }, [pool, phase, bannedList, agents])

  const onChange =
    (index: number) =>
    ([agent]: SelectAgent[]) => {
      const nextCandidates = [...candidates] as [SelectAgent, SelectAgent]
      nextCandidates[index] = agent

      props.onUpdate({
        ...props.room,
        state: {
          ...props.room.state,
          ban: { ...banState, candidates: nextCandidates },
        },
      })
    }

  const updateBanState = (nextPhase: BAN_PHASE, nextBannedList: number[], nextCandidates: any) => {
    const isEnd = nextPhase === BAN_PHASE.END
    props.onUpdate({
      ...props.room,
      state: {
        ...props.room.state,
        phase: isEnd ? ROOM_PHASE.PICK : props.room.state.phase,
        ban: {
          ...banState,
          phase: nextPhase,
          list: nextBannedList,
          candidates: nextCandidates,
        },
      },
    })
    setSelectedToBan(null) // 밴 확정 후 초기화
  }

  const onConfirm = () => {
    let nextPhase = phase
    let nextCandidates = candidates

    if (phase === BAN_PHASE.A_SELECT) {
      nextPhase = BAN_PHASE.B_BAN
    } else if (phase === BAN_PHASE.B_SELECT) {
      nextPhase = BAN_PHASE.A_BAN
    }

    updateBanState(nextPhase, bannedList, nextCandidates)
  }

  const onBanConfirm = () => {
    if (!selectedToBan) return
    const nextBannedList = [...bannedList, selectedToBan]
    const nextPhase = phase === BAN_PHASE.B_BAN ? BAN_PHASE.B_SELECT : BAN_PHASE.END
    updateBanState(nextPhase, nextBannedList, [null, null])
  }

  const isMyTurn = useMemo(() => {
    if (props.role === 'A') return [BAN_PHASE.A_SELECT, BAN_PHASE.A_BAN].includes(phase)
    if (props.role === 'B') return [BAN_PHASE.B_BAN, BAN_PHASE.B_SELECT].includes(phase)
    return false
  }, [props.role, phase])

  const getInstruction = () => {
    switch (phase) {
      case BAN_PHASE.A_SELECT:
        return props.role === 'A' ? 'A님, 밴 후보 2명을 선택해주세요.' : 'A님이 선택 중입니다...'
      case BAN_PHASE.B_BAN:
        return props.role === 'B' ? 'B님, A의 후보 중 1명을 밴하세요.' : 'B님이 밴 선택 중입니다...'
      case BAN_PHASE.B_SELECT:
        return props.role === 'B'
          ? 'B님, 다른 군집의 후보 2명을 선택해주세요.'
          : 'B님이 선택 중입니다...'
      case BAN_PHASE.A_BAN:
        return props.role === 'A' ? 'A님, B의 후보 중 1명을 밴하세요.' : 'A님이 밴 선택 중입니다...'
      default:
        return '밴픽이 종료되었습니다.'
    }
  }

  const isSelectionPhase = [BAN_PHASE.A_SELECT, BAN_PHASE.B_SELECT].includes(phase)
  const isBanActionPhase = [BAN_PHASE.B_BAN, BAN_PHASE.A_BAN].includes(phase)

  return (
    <div className="flex flex-col items-center">
      <Typo.Heading className="heading-4xl text-ink mb-2" heading={1}>
        {getInstruction()}
      </Typo.Heading>

      {/* Allow Agents Display */}
      {protectedAgents.length > 0 && (
        <div className="mb-8 flex flex-col items-center gap-4">
          <span className="text-xs font-bold text-primary uppercase tracking-widest border border-primary px-2 py-0.5 rounded-full">
            Allow
          </span>
          <Form.Party
            size="md"
            value={protectedAgents}
            deleteable={false}
            cost={undefined} // Cost 표시 안 함
          />
        </div>
      )}

      <div className="flex gap-10 mt-4">
        {candidates.map((agent, index) => (
          <div
            key={index}
            className={pipe(
              ['relative', 'rounded-3xl', 'border-4', 'transition-all'],
              concat(
                selectedToBan === agent && agent !== null
                  ? ['border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]']
                  : ['border-transparent']
              ),
              join(' ')
            )}
          >
            <Form.Party
              size="xl"
              banAgents={disabledAgents}
              filterAgents={protectedAgents}
              value={[agent]}
              onChange={isMyTurn && isSelectionPhase ? onChange(index) : undefined}
              onClick={
                isMyTurn && isBanActionPhase && agent ? (id) => setSelectedToBan(id) : undefined
              }
              deleteable={isMyTurn && isSelectionPhase}
            />
          </div>
        ))}
      </div>

      {isMyTurn && isSelectionPhase && (
        <button
          onClick={onConfirm}
          disabled={candidates.includes(null)}
          className={pipe(
            ['px-12', 'py-4', 'rounded-2xl', 'mt-10', 'heading-2xl'],
            concat(['bg-content', 'text-ink', 'hover:bg-primary', 'hover:text-content']),
            concat(['disabled:opacity-50 disabled:cursor-not-allowed', 'cursor-pointer']),
            join(' ')
          )}
        >
          제시 확정
        </button>
      )}

      {isMyTurn && isBanActionPhase && (
        <button
          onClick={onBanConfirm}
          disabled={!selectedToBan}
          className={pipe(
            ['px-12', 'py-4', 'rounded-2xl', 'mt-10', 'heading-2xl'],
            concat(['bg-primary', 'text-content', 'hover:scale-105']),
            concat(['disabled:opacity-50 disabled:cursor-not-allowed', 'cursor-pointer']),
            join(' ')
          )}
        >
          밴 확정
        </button>
      )}

      <div className="mt-20 w-full max-w-2xl">
        <Typo.Heading className="heading-2xl text-secondary mb-4">현재 밴 목록</Typo.Heading>
        <div className="flex gap-4 flex-wrap">
          {bannedList.map((id) => (
            <div key={id} className="relative group">
              <img
                src={agents.get(id)?.profile.url}
                alt={agents.get(id)?.nameKo}
                className="w-16 h-16 rounded-lg grayscale border-2 border-primary/50"
              />
              <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-bold">BANNED</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Ban
