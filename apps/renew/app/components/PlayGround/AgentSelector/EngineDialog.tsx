import RarityTab from './RarityTab'
import RateController from './RateController'
import { Dialog } from '@/components'
import {
  filter,
  map,
  pipe,
  sort,
  isNumber,
  toArray,
  max,
  min,
  isNull,
  concat,
  join,
  isUndefined,
  find,
  fromEntries,
} from '@fxts/core'
import { useMemo, useState } from 'react'
import { BroadcastEvent } from '~/constant'
import { useStore, useMatch } from '~/hooks'
import { updateEngine } from '~/lib/DB'
import type { Player, PlayerRole } from '~/type'

type Props = {
  index: number | null
  round: number
  role: PlayerRole
  disabledList: Array<number>
  onClose: () => void
}

const ENGINE_MAX_RATE = 5
const RARITY_LIST = [
  { label: 'S 픽업', value: 'S_PICK' },
  { label: 'S 상시', value: 'S' },
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
]
const EngineSelector: React.FC<Props> = (props) => {
  const { currentPlay, send, play } = useMatch()
  const [rarity, setRarity] = useState<string>('S_PICK')
  const active = useMemo(() => isNumber(props.index), [props.index])
  const selectAgentId = useMemo(() => {
    if (isNull(props.index)) return null
    if (isUndefined(currentPlay)) return null

    return currentPlay.agentSlot[props.round][props.index].id
  }, [props.index, props.round, currentPlay])
  const selectEngineId = useMemo(() => {
    if (isNull(props.index)) return null
    if (isUndefined(currentPlay)) return null

    return currentPlay.engineSlot[props.round][props.index].id
  }, [props.index, props.round, currentPlay])
  const selectAgentRate = useMemo(() => {
    if (isUndefined(currentPlay)) return null

    return pipe(
      currentPlay.engineSlot[props.round],
      (list) => list[props.index || -1],
      (data) => (isUndefined(data) ? null : data.rate)
    )
  }, [currentPlay, props.round, props.index])
  const store = useStore()

  const onEngineClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (isUndefined(currentPlay)) return

    pipe(
      currentPlay.engineSlot,
      (slots) => {
        if (isNull(props.index)) return slots

        slots[props.round][props.index] = {
          id: event.currentTarget.value,
          rate: 1,
        }

        return slots
      },
      (engineSlot) => {
        send(BroadcastEvent.ENGINE_PICK, {
          ...play,
          [props.role]: { ...currentPlay, engineSlot },
        })
      }
    )
  }
  const onRateChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (isNull(selectAgentRate)) return

    const rate = pipe(
      Number(event.currentTarget.value),
      (rate) => rate + selectAgentRate,
      (rate) => [rate, 1],
      max,
      (rate) => [rate, ENGINE_MAX_RATE],
      min
    )

    if (isNull(selectEngineId)) return
    if (isUndefined(currentPlay)) return

    pipe(
      currentPlay.engineSlot,
      (slots) => {
        if (isNull(props.index)) return slots

        slots[props.round][props.index] = {
          ...slots[props.round][props.index],
          rate,
        }

        return slots
      },
      (engineSlot) => {
        send(BroadcastEvent.ENGINE_PICK, {
          ...play,
          [props.role]: { ...currentPlay, engineSlot },
        })
      }
    )
  }
  const onSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (isUndefined(currentPlay)) return

    send(
      BroadcastEvent.ENGINE_PICK,
      await pipe(
        currentPlay.engineSlot,
        updateEngine(currentPlay.id),
        map((play) => [play.role, play] as [PlayerRole, Player]),
        fromEntries
      )
    )

    props.onClose()
  }

  return (
    <Dialog active={active} className="w-full h-full overflow-auto scrollbar-hidden">
      <div className="px-4 w-dvw max-w-lg mx-auto">
        <RarityTab list={RARITY_LIST} acitve={rarity} onChange={setRarity} />
        <div className="grid grid-cols-3 gap-4 content-start my-10">
          {pipe(
            store.engines,
            filter(([, engine]) => {
              if (rarity === 'B') return engine.rank === 'B'
              if (rarity === 'A') return engine.rank === 'A'
              if (rarity === 'S') return engine.rank === 'S' && !engine.isPickup

              return engine.rank === 'S' && engine.isPickup
            }),
            sort(([, prev], [, cur]) => prev.nameKo.localeCompare(cur.nameKo)),
            sort(([, prev]) => (prev.exclusiveAgentId === selectAgentId ? -999 : 1)),
            map(([, engine]) => (
              <button
                className={pipe(
                  [
                    'card',
                    'block',
                    'aspect-square',
                    'w-full',
                    'p-2',
                    'rounded-2xl',
                    'overflow-hidden',
                  ],
                  concat(selectEngineId === engine.id ? ['active'] : []),
                  join(' ')
                )}
                onClick={onEngineClick}
                key={engine.id}
                value={engine.id}
              >
                <img
                  className="block w-full bg-accent aspect-square rounded-xl relative z-1"
                  src={engine.banner}
                  alt={engine.nameKo}
                />
              </button>
            )),
            toArray
          )}
        </div>
        <RateController rate={selectAgentRate} onSubmit={onSubmit} onChange={onRateChange} />
      </div>
    </Dialog>
  )
}

export default EngineSelector
