import { type AgentId, BAN_PHASE, type SelectAgent, type Side } from '@zzz-picker/constant'
import { useAgent, useStore } from '@zzz-picker/provider'
import { useMemo, useState } from 'react'

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

type Props = {
  role: Side | 'H'
  banPhase: BAN_PHASE
  banCandidates: AgentId[]
  currentBan: SelectAgent[]
  onSelectAgent?: (agentId: AgentId) => void
  onSubmit?: (selectedBanId: AgentId | null) => void
}

export function useBanLogic(props: Props) {
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

  const onAgentClick = (event: React.MouseEvent<HTMLButtonElement>) => {
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

  const onCandidateClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!active || !isBanPhase) return
    const agentId = Number(event.currentTarget.value)
    setSelectedBanId(agentId)
  }

  const onSubmit = () => {
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

  return {
    agents,
    active,
    allowSpecialty,
    isBanPhase,
    selectedBanId,
    isSubmitDisabled,
    handlers: {
      onAgentClick,
      onCandidateClick,
      onSubmit,
    },
  }
}
