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
  isUndefined,
  find,
  fromEntries,
} from '@fxts/core'
import { useMemo, useState } from 'react'
import { BroadcastEvent } from '~/constant'
import { useStore, useMatch } from '~/hooks'
import type { Player, PlayerRole } from '~/type'

type Props = {
  index: number | null
  round: number
  disabledList: Array<number>
  onClose: () => void
  role: PlayerRole
}

const AGENT_MAX_RATE = 6
const RARITY_LIST = [
  { label: 'S 픽업', value: 'S_PICK' },
  { label: 'S 상시', value: 'S' },
  { label: 'A', value: 'A' },
]
const AgentSelector: React.FC<Props> = (props) => {
  const { currentPlay, send, play } = useMatch()
  const [rarity, setRarity] = useState<string>('S_PICK')
  const active = useMemo(() => isNumber(props.index), [props.index])
  const disabled = useMemo(() => {
    return props.disabledList
  }, [currentPlay, props.disabledList])
  const selectAgentId = useMemo(() => {
    if (isNull(props.index)) return null
    if (isUndefined(currentPlay)) return null

    return currentPlay.agentSlot[props.round][props.index].id
  }, [props.index, props.round, currentPlay])
  const selectAgentRate = useMemo(() => {
    if (isNull(selectAgentId)) return 0
    if (isUndefined(currentPlay)) return 0

    return pipe(
      currentPlay.agentSlot[props.round],
      find((agent) => agent.id === selectAgentId),
      (agent) => agent?.rate || 0
    )
  }, [selectAgentId, currentPlay, props.round])
  const store = useStore()

  const onAgentClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (isUndefined(currentPlay)) return

    pipe(
      currentPlay.agentSlot,
      (slots) => {
        if (isNull(props.index)) return slots

        slots[props.round][props.index] = {
          id: Number(event.currentTarget.value),
          rate: 0,
        }

        return slots
      },
      (agentSlot) => {
        send(BroadcastEvent.AGENT_PICK, {
          ...play,
          [props.role]: { ...currentPlay, agentSlot },
        })
      }
    )
  }
  const onRateChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    const rate = pipe(
      Number(event.currentTarget.value),
      (rate) => rate + selectAgentRate,
      (rate) => [rate, 0],
      max,
      (rate) => [rate, AGENT_MAX_RATE],
      min
    )

    if (isNull(selectAgentId)) return
    if (isUndefined(currentPlay)) return

    pipe(
      currentPlay.agentSlot,
      (slots) => {
        if (isNull(props.index)) return slots

        slots[props.round][props.index] = {
          ...slots[props.round][props.index],
          rate,
        }

        return slots
      },
      (agentSlot) => {
        send(BroadcastEvent.AGENT_PICK, {
          ...play,
          [props.role]: { ...currentPlay, agentSlot },
        })
      }
    )
  }
  const onSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (isUndefined(currentPlay)) return

    send(
      BroadcastEvent.AGENT_PICK,
      await pipe(
        currentPlay.agentSlot,
        updateAgent(currentPlay.id),
        map((play) => [play.role, play] as [PlayerRole, Player]),
        fromEntries
      )
    )

    props.onClose()
  }

  return (
    <Dialog active={active} className="w-full h-full overflow-auto px-4 scrollbar-hidden">
      <RarityTab list={RARITY_LIST} acitve={rarity} onChange={setRarity} />
      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto content-start my-10">
        {pipe(
          store.agents,
          filter(([, agent]) => !agent.isTeaser),
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
