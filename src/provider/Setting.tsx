import type { AllowAgent, Rarity } from '../types'
import { UI, Agent, RarityTabs } from '@/components'
import { useAgents } from '@/hooks'
import { filter, includes, map, pipe, toArray } from '@fxts/core'
import { createContext, useState, useEffect } from 'react'

type URLState = {
  banCount: number
  totalCost: number
  allowAgent: AllowAgent
}
type SettingContextType = {
  roundList: Array<string>
  onSettingToggle: () => void
} & URLState

const DEFAULT_URL_STATE: URLState = {
  banCount: 2,
  totalCost: 20,
  allowAgent: [],
}

export const SettingContext = createContext<SettingContextType>({
  ...DEFAULT_URL_STATE,
  roundList: ['1라운드', '2라운드'],
  onSettingToggle: () => {},
})

type Props = {
  children: React.ReactNode
}

type AllowAgentProps = {
  allowAgent: AllowAgent
  onClick: (id: number) => void
}

const AllowAgent: React.FC<AllowAgentProps> = (props) => {
  const { agents } = useAgents()
  const [selectRarity, setSelectRarity] = useState<Rarity>('S')

  const onAgentClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    props.onClick(Number(event.currentTarget.value))
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden p-4 gap-4">
      <div className="flex items-center justify-between">
        <UI.Typo.Heading primary>Allow Agent</UI.Typo.Heading>
        <RarityTabs className="flex-1" value={selectRarity} onChange={setSelectRarity} />
      </div>
      <ul className="grid grid-cols-5 gap-4 py-4 flex-1 overflow-y-auto scrollbar-hidden">
        {pipe(
          agents,
          filter((agent) => agent.rarity === selectRarity),
          map((agent) => (
            <li key={agent.id} className="flex items-start justify-center">
              <Agent.Button
                active={includes(agent.id, props.allowAgent)}
                onClick={onAgentClick}
                disabled={agent.isTeaser}
                {...agent.images}
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
  const [urlState, setUrlState] = useState<URLState>(DEFAULT_URL_STATE)

  const [banCount, setBanCount] = useState(2)
  const [totalCost, setTotalCost] = useState(20)
  const [isOpen, setIsOpen] = useState(false)
  const [allowAgent, setAllowAgent] = useState<AllowAgent>([])
  const [roundList] = useState<string[]>(['1라운드', '2라운드'])

  const onBanCountChange = (count: number) => {
    pipe(
      window.location.search,
      (query) => new URLSearchParams(query),
      (data) => {
        setBanCount(count)
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
        setTotalCost(count)
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
    pipe(
      window.location.search,
      (query) => new URLSearchParams(query),
      (data) => {
        data.set('allowAgent', allowAgent.length === 0 ? '' : allowAgent.join(','))

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
        roundList,
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
