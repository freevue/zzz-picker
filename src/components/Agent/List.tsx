import Agent from '.'
import Tabs from './Tabs'
import { useAgents, useBan } from '@/hooks'
import { filter, map, pipe, toArray, includes } from '@fxts/core'
import { useState } from 'react'

export type Props = {
  onClick?: (id: number) => void
}

const List: React.FC<Props> = (props) => {
  const { agents } = useAgents()
  const { banList } = useBan()
  const [selectRarity, setSelectRarity] = useState<'S' | 'A'>('S')

  const onRarityChange = (value: 'S' | 'A') => {
    setSelectRarity(value)
  }

  return (
    <div className="p-4 flex flex-col gap-4 h-full">
      <Tabs value={selectRarity} onChange={onRarityChange} />
      <ul className="grid grid-cols-3 gap-2 overflow-y-auto overflow-x-hidden scrollbar-hidden">
        {pipe(
          agents,
          filter((agent) => agent.avatar.rarity === selectRarity),
          map((agent) => (
            <li key={agent.avatar.id}>
              <Agent
                {...agent.avatar}
                disabled={agent.is_teaser || pipe(banList, includes(agent.avatar.id))}
                onClick={props.onClick}
              />
            </li>
          )),
          toArray
        )}
      </ul>
    </div>
  )
}

export default List
