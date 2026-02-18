import { pipe, map, filter, sort, includes, find, isUndefined, throwIf, toArray } from '@fxts/core'
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
import { useStore } from '@zzz-picker/provider'
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
  disabled?: boolean
}

/**
 * 선택 가능한 빈 슬롯의 인덱스를 반환합니다.
 */
function getNextEmptySlotIndex(pickList: [SelectAgent, SelectAgent, SelectAgent]): number | null {
  const index = pickList.findIndex((id) => id === null)
  return index >= 0 ? index : null
}

export function usePickLogic(props: Props) {
  const { agents, deadlyAssaultList } = useStore()
  const [round, setRound] = useState<string>('personal')
  const [rarity, setRarity] = useState<Rarity>('S')
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null)
  const [isBossDialogOpen, setIsBossDialogOpen] = useState(false)

  const currentRound = round as RoundKey
  const currentPickList = props.pickList[currentRound]
  const currentPickCost = props.pickCost?.[currentRound]
  const currentBoss = props.boss[currentRound]
  const active = props.role !== 'H' && !props.disabled
  const isPersonalRound = currentRound === 'personal'
  const currentSlotCosts = props.slotCosts?.[currentRound] || [0, 0, 0]

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
  const onAgentClick = (event: React.MouseEvent<HTMLButtonElement>) => {
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
  const onPartySlotClick = (index: number) => {
    if (!active) return
    const agentId = currentPickList[index]
    if (agentId !== null) {
      setSelectedSlotIndex(index)
    }
  }

  // 보스 선택 핸들러
  const onBossSelect = (bossId: BossId) => {
    props.onSelectBoss?.(currentRound, bossId)
  }

  // 보스 선택 확정
  const onBossSubmit = () => {
    setIsBossDialogOpen(false)
  }

  // CostDialog에서 설정 변경
  const onCostChange = (setting: AgentCostSetting) => {
    if (selectedSlotIndex !== null) {
      props.onCostChange?.(currentRound, selectedSlotIndex, setting)
    }
  }

  // CostDialog 닫기
  const onCloseCostDialog = () => {
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

  // 필터링된 에이전트 리스트
  const filteredAgents = useMemo(() => {
    return pipe(
      agents,
      map(([, agent]) => agent),
      filter((agent) => agent.rarity === rarity),
      filter((agent) => !agent.isTeaser),
      sort((prev, cur) => prev.nameKo.localeCompare(cur.nameKo)),
      sort((prev) => (prev.isPickup ? 1 : -1)),
      toArray
    )
  }, [agents, rarity])

  return {
    round,
    setRound,
    rarity,
    setRarity,
    isBossDialogOpen,
    setIsBossDialogOpen,
    currentRound,
    currentPickList,
    currentBoss,
    active,
    isPersonalRound,
    currentSlotCosts,
    selectedInCurrent,
    isCurrentRoundFull,
    otherRoundAgents,
    bannedAgents,
    bossList,
    selectedBossIds,
    isSubmitDisabled,
    selectedAgentForDialog,
    selectedCostForDialog,
    filteredAgents,
    handlers: {
      onAgentClick,
      onPartySlotClick,
      onBossSelect,
      onBossSubmit,
      onCostChange,
      onCloseCostDialog,
    },
  }
}
