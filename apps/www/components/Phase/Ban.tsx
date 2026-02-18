import { filter, isNumber, toArray, pipe, includes } from '@fxts/core'
import { BanPhase } from '@zzz-picker/components/realtime'
import {
  type RoomState,
  type Side,
  type AgentId,
  BAN_PHASE,
  SOCKET_EVENT,
} from '@zzz-picker/constant'
import { useSocket } from '@zzz-picker/provider/hooks'
import { useMemo } from 'react'

type Props = {
  role: Side | 'H'
  room: RoomState
  onUpdate: (data: RoomState) => void
}

/**
 * BAN_PHASE 전환 매핑
 * - A_SELECT → B_BAN (A가 2명 제시 → B가 1명 밴)
 * - B_BAN → B_SELECT (B가 밴 완료 → B가 2명 제시, 포지션 제한)
 * - B_SELECT → A_BAN (B가 2명 제시 → A가 1명 밴)
 * - A_BAN → END (A가 밴 완료 → 밴 종료)
 */
function getNextBanPhase(current: BAN_PHASE): BAN_PHASE {
  switch (current) {
    case BAN_PHASE.A_SELECT:
      return BAN_PHASE.B_BAN
    case BAN_PHASE.B_BAN:
      return BAN_PHASE.B_SELECT
    case BAN_PHASE.B_SELECT:
      return BAN_PHASE.A_BAN
    case BAN_PHASE.A_BAN:
      return BAN_PHASE.END
    default:
      return BAN_PHASE.END
  }
}

/**
 * 현재 banPhase가 밴 확정(2명 중 1명 밴) 단계인지 확인합니다.
 */
function isBanConfirmPhase(banPhase: BAN_PHASE): boolean {
  return banPhase === BAN_PHASE.B_BAN || banPhase === BAN_PHASE.A_BAN
}

const Ban: React.FC<Props> = (props) => {
  const { send } = useSocket()

  const banCandidates = useMemo(() => {
    return pipe(props.room.realtime.banCandidates, filter(isNumber), toArray)
  }, [props.room.realtime.banCandidates])

  const handleSelectAgent = (agentId: AgentId) => {
    // 후보 제시 페이즈 (A_SELECT, B_SELECT): banCandidates 업데이트
    const current = [...props.room.realtime.banCandidates]
    let nextCandidates = [...current]

    // 이미 선택되어 있으면 해제
    if (includes(agentId, current)) {
      nextCandidates = current.map((id) => (id === agentId ? null : id))
    } else {
      // 빈 슬롯에 추가
      const emptyIndex = current.findIndex((id) => id === null)
      if (emptyIndex !== -1) {
        nextCandidates[emptyIndex] = agentId
      }
    }

    // Optimistic Update
    props.onUpdate({
      ...props.room,
      realtime: {
        ...props.room.realtime,
        banCandidates: nextCandidates,
      },
    })

    send(SOCKET_EVENT.BAN, { banCandidates: nextCandidates })
  }

  const handleSubmit = (selectedBanId: AgentId | null) => {
    const currentPhase = props.room.realtime.banPhase
    const nextPhase = getNextBanPhase(currentPhase)

    if (isBanConfirmPhase(currentPhase)) {
      // 밴 확정 페이즈 (B_BAN, A_BAN): 선택된 캐릭터를 최종 밴
      if (!selectedBanId) return

      // Optimistic Update
      const nextBanList = [...props.room.play.banList]
      // Replace first null
      const emptyIndex = nextBanList.findIndex((item) => item === null)
      if (emptyIndex !== -1) {
        nextBanList[emptyIndex] = selectedBanId
      }

      props.onUpdate({
        ...props.room,
        play: {
          ...props.room.play,
          banList: nextBanList,
        },
        realtime: {
          ...props.room.realtime,
          banCandidates: [null, null],
          banPhase: nextPhase,
        },
      })
      console.log('[Ban] Optimistic Update (Confirm):', { nextBanList, nextPhase })

      send(SOCKET_EVENT.BAN, {
        confirm: true,
        agentId: selectedBanId,
        nextPhase,
      })
    } else {
      // 후보 제시 페이즈 (A_SELECT, B_SELECT): 후보 2명 확정, 페이즈 전환
      // Optimistic Update
      props.onUpdate({
        ...props.room,
        realtime: {
          ...props.room.realtime,
          banPhase: nextPhase,
        },
      })

      send(SOCKET_EVENT.BAN, {
        confirm: true,
        nextPhase,
      })
    }
  }

  return (
    <BanPhase
      role={props.role}
      banPhase={props.room.realtime.banPhase}
      banCandidates={banCandidates}
      currentBan={props.room.play.banList}
      onSelectAgent={handleSelectAgent}
      onSubmit={handleSubmit}
    />
  )
}

export default Ban
