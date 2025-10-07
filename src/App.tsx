import { Agent, RineUp, Tabs } from './components'
import Drop from './components/RineUp/Drop'
import { useAgents } from './hooks'
import { filter, map, pipe, toArray } from '@fxts/core'
import { useState } from 'react'

function App() {
  const { agents } = useAgents()
  const [selectRarity, setSelectRarity] = useState<'S' | 'A'>('S')

  const onRarityChange = (value: 'S' | 'A') => {
    setSelectRarity(value)
  }

  return (
    <div className="max-w-[1024px] mx-auto">
      <div className="px-4 mb-8 py-8">
        <div className="flex items-center justify-between">
          <RineUp />
          <div className="">
            <h3 className="dark:text-white text-xl font-bold">Ban</h3>
            <div className="flex gap-2">
              <div className="border-1 border-gray-300 rounded-md overflow-hidden">
                <Drop />
              </div>
              <div className="border-1 border-gray-300 rounded-md overflow-hidden">
                <Drop />
              </div>
            </div>
          </div>
          <RineUp />
        </div>
      </div>
      <div className="px-4">
        <Tabs value={selectRarity} onChange={onRarityChange} />
        <ul className="flex flex-wrap gap-2 mt-2">
          {pipe(
            agents,
            filter((agent) => agent.avatar.rarity === selectRarity),
            map((agent) => (
              <li key={agent.avatar.id}>
                <Agent {...agent.avatar} disabled={agent.is_teaser} />
              </li>
            )),
            toArray
          )}
        </ul>
      </div>
    </div>
  )
}

export default App
