import { Dialog } from '..'
import EngineButton from './EngineButton'
import RateController from './RateController'
import { concat, filter, isNull, join, map, max, min, pipe, sort, toArray } from '@fxts/core'
import { useState } from 'react'
import { useStore } from '~/hooks'

type Props = {
  active: boolean
  engineId: string | null
  rate: number
  onChange: (engineId: string, rate: number) => void
}

const ENGINE_MAX_RATE = 5
const RARITY_LIST = [
  { label: 'S 픽업', value: 'S_PICK' },
  { label: 'S 상시', value: 'S' },
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
]
const EngineDialog: React.FC<Props> = (props) => {
  const store = useStore()

  const [rarity, setRarity] = useState<string>('S_PICK')
  const [selectRate, setSelectRate] = useState<number>(props.rate)
  const [select, setSelect] = useState<null | string>(props.engineId)

  const onRarityClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    setRarity(event.currentTarget.value)
  }
  const onEngineClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    setSelect(event.currentTarget.value)
  }
  const onEngineSubmit = () => {
    if (isNull(select)) return

    props.onChange(select, selectRate)
  }
  const onRateChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    pipe(
      Number(event.currentTarget.value),
      (rate) => rate + selectRate,
      (rate) => [rate, 1],
      max,
      (rate) => [rate, ENGINE_MAX_RATE],
      min,
      (rate) => {
        setSelectRate(rate)
      }
    )
  }

  return (
    <Dialog
      active={!!props.active}
      className="w-full h-full overflow-auto scrollbar-hidden"
      onClose={onEngineSubmit}
    >
      <div className="max-w-lg mx-auto p-4 w-dvw h-dvh overflow-auto scrollbar-hidden">
        <ul className="sticky top-2 z-10 flex rounded-full mb-8 h-14 overflow-hidden">
          {pipe(
            RARITY_LIST,
            map(({ label, value }) => (
              <li key={value} className="flex-1 bg-accent">
                <button
                  onClick={onRarityClick}
                  value={value}
                  type="button"
                  className={pipe(
                    ['w-full h-full cursor-pointer', 'text-xl', 'ft-ria', 'cursor-pointer'],
                    concat(rarity === value ? ['bg-primary', 'text-content'] : []),
                    join(' ')
                  )}
                >
                  {label}
                </button>
              </li>
            )),
            toArray
          )}
        </ul>
        <ul className="grid grid-cols-3 gap-4 content-start mb-36">
          {pipe(
            store.engines,
            filter(([, engine]) => {
              if (rarity === 'S_PICK') return engine.rank === 'S' && engine.isPickup
              if (rarity === 'S') return engine.rank === 'S' && !engine.isPickup

              return engine.rank === rarity
            }),
            sort(([, prev], [, cur]) => prev.nameKo.localeCompare(cur.nameKo)),
            map(([id, engine]) => (
              <li key={id} className="aspect-square w-full">
                <EngineButton engine={engine} active={id === select} onClick={onEngineClick} />
              </li>
            )),
            toArray
          )}
        </ul>
        <RateController onChange={onRateChange} onSubmit={onEngineSubmit} rate={selectRate} />
      </div>
    </Dialog>
  )
}

export default EngineDialog
