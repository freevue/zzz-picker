import { Typo, Tabs } from '../'
import { Cross } from '../../Icons'
import Dialog from './'
import { pipe, map, toArray, filter, includes, join, concat } from '@fxts/core'
import type { EngineId, Engine } from '@zzz-picker/constant'
import type { Rarity } from '@zzz-picker/constant'
import { useStore } from '@zzz-picker/provider/hooks'
import { useState } from 'react'

type Props = {
  isOpen: boolean
  allowEngines?: EngineId[]
  activeEngine?: EngineId[]
  onClose?: () => void
  onSelect?: (event: React.MouseEvent<HTMLButtonElement>) => void
}
type ButtonProps = {
  active?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const Button: React.FC<Engine & ButtonProps> = (props) => {
  return (
    <button
      type="button"
      onClick={props.onClick}
      value={props.id}
      className={pipe(
        ['flex', 'flex-col', 'items-center', 'justify-center', 'cursor-pointer'],
        concat(['focus:outline-none', 'group']),
        join(' ')
      )}
    >
      <div className={pipe(['aspect-square', 'min-w-full'], concat([]), join(' '))}>
        <img
          className={pipe(
            ['block', 'w-full', 'drop-shadow-center'],
            concat(
              props.active
                ? ['drop-shadow-primary']
                : ['drop-shadow-transparent', 'group-hover:drop-shadow-primary']
            ),
            join(' ')
          )}
          src={props.iconUrl}
          alt=""
        />
      </div>
      <span className={pipe(['body-sm'], concat(['text-ink']), join(' '))}>
        {props.nameKo || '-'}
      </span>
    </button>
  )
}
const Engines: React.FC<Props> = (props) => {
  const { engines } = useStore()
  const [rarity, setRarity] = useState<Rarity>('S')

  return (
    <Dialog isOpen={props.isOpen} onClose={props.onClose}>
      {props.allowEngines && props.allowEngines.length > 0 && (
        <div className="mb-8">
          <Typo.Heading className="heading-4xl text-primary">Exclusive Engines</Typo.Heading>
          <div className="grid grid-cols-5 gap-4 w-2xl items-start mt-4">
            {pipe(
              props.allowEngines,
              map((engineId) => engines.get(engineId)!),
              map((engine) => (
                <Button
                  onClick={props.onSelect}
                  active={includes(Number(engine.id), props.activeEngine || [])}
                  {...engine}
                  key={Number(engine.id)}
                />
              )),
              toArray
            )}
          </div>
        </div>
      )}
      <div>
        <Typo.Heading className="heading-4xl text-primary">Engines</Typo.Heading>
        <div className="mt-4 flex">
          <Tabs
            className="w-1/3 ml-auto"
            list={['S', 'A', 'B']}
            value={rarity}
            onChange={(value) => setRarity(value as Rarity)}
          />
        </div>
        <div className="grid grid-cols-5 gap-4 w-2xl items-start mt-8">
          <button
            onClick={props.onSelect}
            className={pipe(
              [
                'flex',
                'flex-col',
                'items-center',
                'justify-center',
                'cursor-pointer',
                'px-4',
                'h-full',
              ],
              concat(['focus:outline-none', 'group']),
              join(' ')
            )}
          >
            <Cross className="size-full stroke-ink group-hover:stroke-primary" />
          </button>
          {pipe(
            engines,
            // filter(([agentId]) => !includes(agentId, props.filterAgents || [])),
            filter(([engineId]) => !includes(engineId, props.allowEngines || [])),
            filter(([, engine]) => engine.rank === rarity),
            map(([engineId, engine]) => (
              <Button
                onClick={props.onSelect}
                active={includes(engineId, props.activeEngine || [])}
                {...engine}
                key={engineId}
              />
            )),
            toArray
          )}
        </div>
      </div>
    </Dialog>
  )
}

export default Engines
