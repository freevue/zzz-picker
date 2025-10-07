import Agent from '.'
import { useAgents, useBan } from '../../hooks'
import Tabs from './Tabs'
import { filter, map, pipe, toArray, includes } from '@fxts/core'
import { useState } from 'react'

type Props = {}

const List: React.FC<Props> = () => {
  const { agents } = useAgents()
  const { banList } = useBan()
  const [selectRarity, setSelectRarity] = useState<'S' | 'A'>('S')

  const onRarityChange = (value: 'S' | 'A') => {
    setSelectRarity(value)
  }

  console.log(banList)

  return (
    <div className="p-4 flex flex-col gap-2 h-full">
      <Tabs value={selectRarity} onChange={onRarityChange} />
      <ul className="grid grid-cols-3 gap-2 overflow-auto">
        {pipe(
          agents,
          filter((agent) => agent.avatar.rarity === selectRarity),
          map((agent) => (
            <li key={agent.avatar.id}>
              <Agent
                {...agent.avatar}
                disabled={agent.is_teaser || pipe(banList, includes(agent.avatar.id))}
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
