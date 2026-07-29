import { Dialog } from '..'
import RateController from './RateController'
import { concat, filter, isNull, join, map, max, min, pipe, sort, toArray } from '@fxts/core'
import { useState } from 'react'
import { useStore } from '~/hooks'

type Props = {
  active: boolean
  rate: number
  agentId: null | number
  onChange: (agentId: number, rate: number) => void
}

const RARITY_LIST = [
  { label: 'S 픽업', value: 'S_PICK' },
  { label: 'S 상시', value: 'S' },
  { label: 'A', value: 'A' },
]
const AGENT_MAX_RATE = 6
const AgentDialog: React.FC<Props> = (props) => {
  const store = useStore()

  const [rarity, setRarity] = useState<string>('S_PICK')
  const [selectRate, setSelectRate] = useState<number>(props.rate)
  const [select, setSelect] = useState<null | number>(props.agentId)

  const onRarityClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    setRarity(event.currentTarget.value)
  }
  const onAgentClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    setSelect(Number(event.currentTarget.value))
  }
  const onAgentSubmit = () => {
    if (isNull(select)) return

    props.onChange(select, selectRate)
  }
  const onRateChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    pipe(
      Number(event.currentTarget.value),
      (rate) => rate + selectRate,
      (rate) => [rate, 0],
      max,
      (rate) => [rate, AGENT_MAX_RATE],
      min,
      (rate) => {
        setSelectRate(rate)
      }
    )
  }

  return (
    <Dialog active={!!props.active}>
      <div className="max-w-lg mx-auto p-4 w-full h-screen overflow-auto scrollbar-hidden">
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
                    ['w-full h-full cursor-pointer', 'text-xl', 'ft-ria'],
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
        <ul className="grid grid-cols-3 gap-4 content-start mb-44">
          {pipe(
            store.agents,
            filter(([, agent]) => {
              if (rarity === 'S_PICK') return agent.rarity === 'S' && agent.isPickup
              if (rarity === 'S') return agent.rarity === 'S' && !agent.isPickup

              return agent.rarity === 'A'
            }),
            sort(([, prev], [, cur]) => prev.nameKo.localeCompare(cur.nameKo)),
            map(([id, agent]) => (
              <li key={id}>
                <button
                  type="button"
                  value={id}
                  onClick={onAgentClick}
                  className={pipe(
                    ['aspect-square rounded-2xl overflow-hidden', 'card', 'p-2'],
                    concat(id === select ? ['active'] : []),
                    join(' ')
                  )}
                >
                  <img
                    className="relative z-1 aspect-square rounded-xl block w-full"
                    style={{ backgroundColor: agent.color || 'transparent' }}
                    src={agent.profile}
                    alt={agent.nameKo}
                  />
                </button>
              </li>
            )),
            toArray
          )}
        </ul>
        <RateController onChange={onRateChange} onSubmit={onAgentSubmit} rate={selectRate} />
      </div>
    </Dialog>
  )
}

export default AgentDialog
