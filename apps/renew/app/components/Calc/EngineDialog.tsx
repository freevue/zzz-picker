import { Dialog } from '..'
import RateController from './RateController'
import { concat, isNull, join, map, max, min, pipe, toArray } from '@fxts/core'
import { useEffect, useState } from 'react'
import { useStore } from '~/hooks'

type Props = {
  active: boolean
  engineId: string | null
  rate: number
  onChange: (engineId: string, rate: number) => void
}

const ENGINE_MAX_RATE = 5
const EngineDialog: React.FC<Props> = (props) => {
  const store = useStore()

  const [selectRate, setSelectRate] = useState<number>(props.rate)
  const [select, setSelect] = useState<null | string>(props.engineId)

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
    <Dialog active={!!props.active}>
      <div className="max-w-lg mx-auto p-4 w-full h-screen overflow-auto scrollbar-hidden">
        <ul className="grid grid-cols-3 gap-4 content-start mb-64">
          {pipe(
            store.engines,
            map(([id, engine]) => (
              <li key={id} className="aspect-square">
                <button
                  type="button"
                  value={id}
                  onClick={onEngineClick}
                  className={pipe(
                    [
                      'aspect-square w-full rounded-2xl overflow-hidden',
                      'card',
                      'p-2',
                      'cursor-pointer',
                    ],
                    concat(id === select ? ['active'] : []),
                    join(' ')
                  )}
                >
                  <img
                    className="relative z-1 rounded-xl block w-full bg-accent"
                    src={engine.banner}
                    alt={engine.nameKo}
                  />
                </button>
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
