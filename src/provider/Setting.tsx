import { UI, Agent, RarityTabs } from '@/components'
import { useAgents } from '@/hooks'
import { filter, includes, map, pipe, toArray } from '@fxts/core'
import { createContext, useState, useEffect } from 'react'

type SettingContextType = {
  banCount: number
  totalCost: number
  allowAgent: number[]
  onSettingToggle: () => void
}

export const SettingContext = createContext<SettingContextType>({
  banCount: 2,
  totalCost: 20,
  allowAgent: [],
  onSettingToggle: () => {},
})

type Props = {
  children: React.ReactNode
}

type AllowAgentProps = {
  allowAgent: number[]
  onClick: (id: number) => void
}

const AllowAgent: React.FC<AllowAgentProps> = (props) => {
  const { agents } = useAgents()
  const [selectRarity, setSelectRarity] = useState<'S' | 'A'>('S')

  const onAgentClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    props.onClick(Number(event.currentTarget.value))
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-4 gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl flex-1 font-black dark:text-white italic">Allow Agent</h2>
        <RarityTabs className="flex-1" value={selectRarity} onChange={setSelectRarity} />
      </div>
      <ul className="grid grid-cols-5 gap-4 py-4 flex-1 overflow-y-auto scrollbar-hidden">
        {pipe(
          agents,
          filter((agent) => agent.avatar.rarity === selectRarity),
          map((agent) => (
            <li key={agent.avatar.id} className="flex items-start justify-center">
              <Agent.Button
                active={includes(agent.avatar.id, props.allowAgent)}
                onClick={onAgentClick}
                disabled={agent.is_teaser}
                {...agent.avatar}
              />
            </li>
          )),
          toArray
        )}
      </ul>
    </div>
  )
}

const SettingProvider: React.FC<Props> = (props) => {
  const [banCount, setBanCount] = useState(2)
  const [totalCost, setTotalCost] = useState(20)
  const [isOpen, setIsOpen] = useState(false)
  const [allowAgent, setAllowAgent] = useState<number[]>([])

  const onBanCountChange = (count: number) => {
    pipe(
      window.location.search,
      (query) => new URLSearchParams(query),
      (data) => {
        data.set('banCount', count.toString())

        window.history.replaceState(null, '', `?${data.toString()}`)
      }
    )
  }
  const onTotalCostChange = (count: number) => {
    pipe(
      window.location.search,
      (query) => new URLSearchParams(query),
      (data) => {
        data.set('totalCost', count.toString())

        window.history.replaceState(null, '', `?${data.toString()}`)
      }
    )
  }
  const onAllowAgentClick = (id: number) => {
    setAllowAgent((prev) => {
      if (includes(id, prev)) {
        return pipe(
          prev,
          filter((item) => item !== id),
          toArray
        )
      }

      return [...prev, id]
    })
  }

  useEffect(() => {
    pipe(
      window.location.search,
      (query) => new URLSearchParams(query),
      (data) => {
        setBanCount(Number(data.get('banCount') || 2))
        setTotalCost(Number(data.get('totalCost') || 20))
        data.get('allowAgent') &&
          setAllowAgent(data.get('allowAgent')!.split(',').map(Number) || [])
      }
    )
  }, [])
  useEffect(() => {
    if (allowAgent.length === 0) return

    pipe(
      window.location.search,
      (query) => new URLSearchParams(query),
      (data) => {
        data.set('allowAgent', allowAgent.join(','))

        window.history.replaceState(null, '', `?${data.toString()}`)
      }
    )
  }, [allowAgent])

  return (
    <SettingContext.Provider
      value={{
        banCount,
        totalCost,
        allowAgent,
        onSettingToggle: () => {
          setIsOpen((prev) => !prev)
        },
      }}
    >
      {props.children}
      {isOpen && (
        <UI.Dialog
          onClose={() => setIsOpen(false)}
          className="bg-base p-4 border-1 border-gray-700 rounded-md max-h-3/4 flex flex-col w-2xl"
        >
          <h2 className="text-3xl font-semibold dark:text-white mb-8">설정</h2>
          <div className="flex p-4 mb-4">
            <h2 className="text-2xl flex-1 font-black dark:text-white italic">Total Cost</h2>
            <div className="flex-1">
              <UI.Count min={0} max={30} defaultValue={totalCost} onChange={onTotalCostChange} />
            </div>
          </div>
          <div className="flex p-4 mb-4">
            <h2 className="text-2xl flex-1 font-black dark:text-white italic">Ban Count</h2>
            <div className="flex-1">
              <UI.Count min={0} max={5} defaultValue={banCount} onChange={onBanCountChange} />
            </div>
          </div>
          <AllowAgent allowAgent={allowAgent} onClick={onAllowAgentClick} />
        </UI.Dialog>
      )}
    </SettingContext.Provider>
  )
}

export default SettingProvider
