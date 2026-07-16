import RarityTab from './RarityTab'
import RateController from './RateController'
import { Dialog } from '@/components'
import { AgentButton } from '@/components'
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
  join,
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
  { label: 'B', value: 'B' },
]
const EngineSelector: React.FC<Props> = (props) => {
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
  const selectEngineId = useMemo(() => {
    if (isNull(props.index)) return null

    return matchState.pick.engine[props.round][props.index]
  }, [props.index, props.round, matchState])
  const selectAgentRate = useMemo(() => {
    if (matchState.player!.role === Role.HOST) return 1
    if (isNull(selectEngineId)) return null

    return matchState.state.rate[matchState.player!.role].engines[selectEngineId] || 1
  }, [selectEngineId, matchState])
  const store = useStore()

  const onEngineClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (isNull(props.index)) return

    matchState.send(BroadcastEvent.ENGINE_PICK, {
      role: matchState.player!.role as Role.A_SIDE | Role.B_SIDE,
      round: props.round,
      index: props.index,
      engineId: event.currentTarget.value,
    })
  }
  const onRateChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (isNull(selectAgentRate)) return

    pipe(
      Number(event.currentTarget.value),
      (rate) => rate + selectAgentRate,
      (rate) => [rate, 0],
      max,
      (rate) => [rate, AGENT_MAX_RATE],
      min,
      (rate) => {
        if (isNull(selectEngineId)) return

        matchState.send(BroadcastEvent.ENGINE_RATE, {
          role: matchState.player!.role as Role.A_SIDE | Role.B_SIDE,
          rate,
          engineId: selectEngineId,
        })
      }
    )
  }
  const onSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    props.onClose()
  }

  return (
    <Dialog active={active} className="w-full h-full overflow-auto px-4 scrollbar-hidden">
      <RarityTab list={RARITY_LIST} acitve={rarity} onChange={setRarity} />
      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto content-start my-10">
        {pipe(
          store.engines,
          filter(([, engine]) => {
            if (rarity === 'B') return engine.rank === 'B'
            if (rarity === 'A') return engine.rank === 'A'
            if (rarity === 'S') return engine.rank === 'S' && !engine.isPickup

            return engine.rank === 'S' && engine.isPickup
          }),
          sort(([, prev], [, cur]) => prev.nameKo.localeCompare(cur.nameKo)),
          map(([, engine]) => (
            <button
              className={pipe(
                ['card', 'aspect-square', 'p-2', 'rounded-2xl', 'overflow-hidden'],
                concat(selectEngineId === engine.id ? ['active'] : []),
                join(' ')
              )}
              onClick={onEngineClick}
              key={engine.id}
              value={engine.id}
            >
              <img
                className="block w-full bg-accent rounded-xl"
                src={engine.banner}
                alt={engine.nameKo}
              />
            </button>
          )),
          toArray
        )}
      </div>
      <RateController rate={selectAgentRate} onSubmit={onSubmit} onChange={onRateChange} />
    </Dialog>
  )
}

export default EngineSelector
