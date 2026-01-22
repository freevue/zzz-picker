import type { Rols, RealtimeState } from '.'
import { pipe, filter, map, toArray, concat, join, isNull } from '@fxts/core'
import { Typo, Form } from '@zzz-picker/components/v2'
import { SOCKET_EVENT, BAN_PHASE, type SelectAgent } from '@zzz-picker/constant'
import { useSocket, useStore } from '@zzz-picker/provider/hooks'
import { useState, useMemo } from 'react'

type Props = {
  role: Rols
  state: RealtimeState
}

const Ban: React.FC<Props> = (props) => {
  const [phase, setPhase] = useState<BAN_PHASE>(BAN_PHASE.A_SELECT)
  const [candidates, setCandidates] = useState<[SelectAgent, SelectAgent]>([null, null])
  const [bannedList, setBannedList] = useState<number[]>([])

  const { agents } = useStore()
  const { send } = useSocket(
    (payload) => {
      if (payload.phase) setPhase(payload.phase)
      if (payload.candidates) setCandidates(payload.candidates)
      if (payload.bannedList) setBannedList(payload.bannedList)
    },
    { event: [SOCKET_EVENT.BAN, SOCKET_EVENT.BAN_CONFIRM] }
  )

  const DEALER_GROUP = [1, 2, 3] // 강공, 명파, 이상 (DB Specialty ID 기준 확인 필요)

  const getAgentGroup = (agentId: number | null) => {
    if (isNull(agentId)) return null
    const specialtyId = agents.get(agentId)?.specialty.id
    return specialtyId && DEALER_GROUP.includes(specialtyId) ? 'DEALER' : 'SUPPORTER'
  }

  const allowAgents = useMemo(() => {
    const list = pipe(
      agents,
      filter(([, agent]) => agent.isAllow && agent.isPickup && agent.rarity === 'S'),
      map(([id]) => id),
      filter((id) => !bannedList.includes(id)),
      toArray
    )

    if (phase === BAN_PHASE.B_SELECT) {
      const lastBannedGroup = getAgentGroup(bannedList[bannedList.length - 1])
      return list.filter((id) => getAgentGroup(id) !== lastBannedGroup)
    }

    return list
  }, [agents, phase, bannedList])

  const onChange =
    (index: number) =>
    ([agent]: SelectAgent[]) => {
      const nextCandidates = [...candidates] as [SelectAgent, SelectAgent]
      nextCandidates[index] = agent
      setCandidates(nextCandidates)
      send(SOCKET_EVENT.BAN, { role: props.role, candidates: nextCandidates, phase })
    }

  const onConfirm = () => {
    let nextPhase = phase
    let nextBannedList = [...bannedList]
    let nextCandidates: [SelectAgent, SelectAgent] = [null, null]

    if (phase === BAN_PHASE.A_SELECT) {
      nextPhase = BAN_PHASE.B_BAN
      nextCandidates = candidates
    } else if (phase === BAN_PHASE.B_BAN) {
      // 캔디데이트 중 하나 밴 (여기선 간단히 첫번째라고 가정, 실제론 클릭 로직 필요)
    } else if (phase === BAN_PHASE.B_SELECT) {
      nextPhase = BAN_PHASE.A_BAN
      nextCandidates = candidates
    }

    send(SOCKET_EVENT.BAN_CONFIRM, {
      role: props.role,
      phase: nextPhase,
      bannedList: nextBannedList,
      candidates: nextCandidates,
    })
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

  return (
    <div className="flex flex-col items-center">
      <Typo.Heading className="heading-4xl text-ink mb-10" heading={1}>
        {getInstruction()}
      </Typo.Heading>

      <div className="flex gap-10">
        {candidates.map((agent, index) => (
          <div key={index} className="relative">
            <Form.Party
              size="xl"
              filterAgents={allowAgents}
              value={[agent]}
              onChange={
                isMyTurn && [BAN_PHASE.A_SELECT, BAN_PHASE.B_SELECT].includes(phase)
                  ? onChange(index)
                  : undefined
              }
              deleteable={isMyTurn}
            />
            {[BAN_PHASE.B_BAN, BAN_PHASE.A_BAN].includes(phase) && isMyTurn && agent && (
              <button
                onClick={() => {
                  const nextBannedList = [...bannedList, agent as number]
                  const nextPhase = phase === BAN_PHASE.B_BAN ? BAN_PHASE.B_SELECT : BAN_PHASE.END
                  send(SOCKET_EVENT.BAN_CONFIRM, {
                    role: props.role,
                    phase: nextPhase,
                    bannedList: nextBannedList,
                    candidates: [null, null],
                  })
                }}
                className="absolute -top-2 -right-2 bg-primary text-white p-2 rounded-full z-20"
              >
                BAN
              </button>
            )}
          </div>
        ))}
      </div>

      {isMyTurn && [BAN_PHASE.A_SELECT, BAN_PHASE.B_SELECT].includes(phase) && (
        <button
          onClick={onConfirm}
          disabled={candidates.includes(null)}
          className={pipe(
            ['px-8', 'py-3', 'rounded-xl', 'mt-10', 'heading-xl'],
            concat(['bg-content', 'text-ink', 'hover:bg-primary', 'hover:text-content']),
            concat(['disabled:opacity-50 disabled:cursor-not-allowed']),
            join(' ')
          )}
        >
          제시 확정
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
