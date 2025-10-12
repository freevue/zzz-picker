import type { AllowAgent, Rarity, CostTable, URLState } from '../types'
import { UI, Agent, RarityTabs } from '@/components'
import { DEFAULT_COST_TABLE, DEFAULT_URL_STATE } from '@/constant'
import { useAgents } from '@/hooks'
import { each, entries, filter, includes, map, pipe, split, toArray } from '@fxts/core'
import { createContext, useState, useEffect } from 'react'

type DispatchSetting = {
  banCount?: number
  totalCost?: number
  allowAgent?: AllowAgent
}
type Context = {
  roundList: Array<string>
  costTable: CostTable
  state: URLState
  onSettingToggle: () => void
  onCostChange: (key: string, value: number) => void
  onSettingChange: (value: DispatchSetting) => void
}

export const SettingContext = createContext<Context>({
  roundList: ['1라운드', '2라운드'],
  costTable: DEFAULT_COST_TABLE,
  state: DEFAULT_URL_STATE,
  onSettingToggle: () => {},
  onCostChange: () => {},
  onSettingChange: () => {},
})

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
    <div className="flex-1 flex flex-col overflow-hidden gap-4 mt-10">
      <div className="flex items-center justify-between gap-16">
        <UI.Typo.Heading primary>Allow Agent</UI.Typo.Heading>
        <RarityTabs className="flex-1" value={selectRarity} onChange={setSelectRarity} />
      </div>
      <ul className="grid grid-cols-5 gap-4 py-4 flex-1">
        {pipe(
          agents,
          filter((agent) => agent.rarity === selectRarity),
          map((agent) => (
            <li key={agent.id} className="flex items-start justify-center">
              <Agent.Button
                active={includes(agent.id, props.allowAgent)}
                onClick={onAgentClick}
                disabled={agent.isTeaser}
                {...agent}
              />
            </li>
          )),
          toArray
        )}
      </ul>
    </div>
  )
}

type Props = {
  children: React.ReactNode
}

const SettingProvider: React.FC<Props> = (props) => {
  const { agents } = useAgents()
  const [settingState, setSettingState] = useState<URLState>(DEFAULT_URL_STATE)
  const [costTable, setCostTable] = useState<CostTable>(DEFAULT_COST_TABLE)

  const [isOpen, setIsOpen] = useState(false)
  const [roundList] = useState<string[]>(['1라운드', '2라운드'])

  const onInputChange = (value: number, name: string) => {
    setSettingState((prev) => ({ ...prev, [name]: value }))
  }
  const onAllowAgentClick = (id: number) => {
    setSettingState((prev) => {
      return {
        ...prev,
        allowAgent: prev.allowAgent.includes(id)
          ? prev.allowAgent.filter((value) => value !== id)
          : [...prev.allowAgent, id],
      }
    })
  }

  useEffect(() => {
    pipe(
      window.location.search,
      (query) => new URLSearchParams(query),
      (data) => {
        for (const [key, value] of data.entries()) {
          if (key === 'allowAgent') {
            setSettingState((prev) => ({ ...prev, allowAgent: value.split(',').map(Number) }))
          } else {
            setSettingState((prev) => ({ ...prev, [key]: Number(value) }))
          }
        }
      }
    )
  }, [])

  useEffect(() => {
    setSettingState((prev) => ({
      ...prev,
      allowAgent: pipe(
        agents,
        filter((agent) => agent.isUp),
        map((agent) => agent.id),
        toArray
      ),
    }))
  }, [agents])
  useEffect(() => {
    const searchParams = new URLSearchParams()

    pipe(
      settingState,
      entries,
      each(([key, value]) => {
        if (key === 'allowAgent') {
          value.length > 0 ? searchParams.set(key, value.join(',')) : searchParams.delete(key)
        } else {
          searchParams.set(key, value.toString())
        }
      }),
      () => window.history.replaceState(null, '', `?${searchParams.toString()}`)
    )
  }, [settingState])

  return (
    <SettingContext.Provider
      value={{
        state: settingState,
        costTable,
        roundList,
        onSettingToggle: () => {
          setIsOpen((prev) => !prev)
        },
        onSettingChange: (value) => {
          setSettingState((prev) => ({ ...prev, ...value }))
        },
        onCostChange: (key, value) => {
          function updateNested<T>(item: T, [first, ...rest]: Array<string>): T {
            return rest.length === 0
              ? { ...item, [first]: value }
              : { ...item, [first]: updateNested(item[first as keyof T], rest) }
          }

          setCostTable((prev) => pipe(key, split('.'), toArray, (list) => updateNested(prev, list)))
        },
      }}
    >
      {props.children}
      {isOpen && (
        <UI.Dialog
          onClose={() => setIsOpen(false)}
          className="bg-bg-content p-4 border-1 border-secondary flex flex-col w-2xl"
        >
          <UI.Typo.Heading primary>설정</UI.Typo.Heading>
          <div className="flex flex-col gap-4 mt-10">
            <div className="flex mb-4">
              <h2 className="text-2xl flex-1 font-black dark:text-white">Total Cost</h2>
              <div className="flex-1">
                <UI.Count
                  min={0}
                  max={30}
                  defaultValue={settingState.totalCost}
                  name="totalCost"
                  onChange={onInputChange}
                />
              </div>
            </div>
            <div className="flex mb-4">
              <h2 className="text-2xl flex-1 font-black dark:text-white">Ban Count</h2>
              <div className="flex-1">
                <UI.Count
                  min={0}
                  max={5}
                  defaultValue={settingState.banCount}
                  name="banCount"
                  onChange={onInputChange}
                />
              </div>
            </div>
          </div>
          <AllowAgent allowAgent={settingState.allowAgent} onClick={onAllowAgentClick} />
        </UI.Dialog>
      )}
    </SettingContext.Provider>
  )
}

export default SettingProvider
