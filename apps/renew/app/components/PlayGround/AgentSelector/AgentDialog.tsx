import RarityTab from './RarityTab'
import RateController from './RateController'
import { Dialog } from '@/components'
import { AgentButton } from '@/components'
import { updateAgent } from '@/lib/DB'
import {
  filter,
  includes,
  map,
  pipe,
  sort,
  isNumber,
  toArray,
  max,
  min,
  isNull,
  values,
  flat,
  concat,
} from '@fxts/core'
import { useMemo, useState } from 'react'
import { BroadcastEvent, Role } from '~/constant'
import { useStore, useMatchState } from '~/hooks'

type Props = {
  index: number | null
  round: number
  disabledList: Array<number>
  onClose: () => void
}

const AGENT_MAX_RATE = 6
const RARITY_LIST = [
  { label: 'S 픽업', value: 'S_PICK' },
  { label: 'S 상시', value: 'S' },
  { label: 'A', value: 'A' },
]
const AgentSelector: React.FC<Props> = (props) => {
  const matchState = useMatchState()
  const [rarity, setRarity] = useState<string>('S_PICK')
  const active = useMemo(() => isNumber(props.index), [props.index])
  const disabled = useMemo(() => {
    return pipe(
      matchState.state.agent,
      (list) => {
        if (matchState.player!.role === Role.HOST) return []

        return list[matchState.player!.role]
      },
      values,
      flat,
      concat(props.disabledList),
      filter(isNumber),
      toArray
    )
  }, [matchState, props.disabledList])
  const selectAgentId = useMemo(() => {
    if (isNull(props.index)) return null

    return matchState.pick.agent[props.round][props.index]
  }, [props.index, props.round, matchState])
  const selectAgentRate = useMemo(() => {
    if (matchState.player!.role === Role.HOST) return 0
    if (isNull(selectAgentId)) return 0

    return matchState.state.rate[matchState.player!.role].agents[selectAgentId] || 0
  }, [selectAgentId, matchState])
  const store = useStore()

  const onAgentClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (isNull(props.index)) return

    matchState.send(BroadcastEvent.AGENT_RATE, {
      role: matchState.player!.role as Role.A_SIDE | Role.B_SIDE,
      rate: 0,
      agentId: Number(event.currentTarget.value),
    })
    matchState.send(BroadcastEvent.AGENT_PICK, {
      role: matchState.player!.role as Role.A_SIDE | Role.B_SIDE,
      round: props.round,
      index: props.index,
      agentId: Number(event.currentTarget.value),
    })
  }
  const onRateChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    pipe(
      Number(event.currentTarget.value),
      (rate) => rate + selectAgentRate,
      (rate) => [rate, 0],
      max,
      (rate) => [rate, AGENT_MAX_RATE],
      min,
      (rate) => {
        if (isNull(selectAgentId)) return

        matchState.send(BroadcastEvent.AGENT_RATE, {
          role: matchState.player!.role as Role.A_SIDE | Role.B_SIDE,
          rate,
          agentId: selectAgentId,
        })
      }
    )
  }
  const onSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (isNull(props.index)) return

    await updateAgent(matchState.player!.id, matchState.pick.agent, matchState.pick.rate)

    props.onClose()
  }

  return (
    <Dialog active={active} className="w-full h-full overflow-auto px-4 scrollbar-hidden">
      <RarityTab list={RARITY_LIST} acitve={rarity} onChange={setRarity} />
      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto content-start my-10">
        {pipe(
          store.agents,
          filter(([, agent]) => {
            if (rarity === 'A') return agent.rarity === 'A'
            if (rarity === 'S') return agent.rarity === 'S' && !agent.isPickup

            return agent.rarity === 'S' && agent.isPickup
          }),
          sort(([, prev], [, cur]) => prev.nameKo.localeCompare(cur.nameKo)),
          map(([, agent]) => (
            <AgentButton
              active={agent.id === selectAgentId}
              onClick={onAgentClick}
              key={agent.id}
              disabled={agent.id !== selectAgentId && includes(agent.id, disabled)}
              {...agent}
            />
          )),
          toArray
        )}
      </div>
      <RateController rate={selectAgentRate} onSubmit={onSubmit} onChange={onRateChange} />
    </Dialog>
  )
}

export default AgentSelector
