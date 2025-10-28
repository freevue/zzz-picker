import { Context as StoreContext } from './Store'
import {
  join,
  filter,
  map,
  pipe,
  when,
  split,
  isNull,
  toArray,
  entries,
  each,
  isArray,
  isNumber,
  isString,
} from '@fxts/core'
import { DEFAULT_COST_TABLE, type CostTable } from '@zzz-picker/constant'
import { createContext, useContext, useEffect, useState } from 'react'

const DEFAULT_URL_STATE = {
  banCount: 2,
  totalCost: 24,
  allowAgent: [] as Array<number>,
}
const DEFAULT_ROUND_LIST = ['1라운드', '2라운드']

type Props = {
  children: React.ReactNode
}
type State = {
  setting: {
    banCount: number
    totalCost: number
    allowAgent: Array<number>
  }
  roundList: Array<string>
  costTable: CostTable
  setCostTable: (key: string, value: number) => void
  setSaveSetting: (setting: {
    banCount?: number
    totalCost?: number
    allowAgent?: Array<number>
  }) => void
}

export const Context = createContext<State>({
  setting: {
    ...DEFAULT_URL_STATE,
  },
  roundList: DEFAULT_ROUND_LIST,
  costTable: DEFAULT_COST_TABLE,
  setCostTable: () => {},
  setSaveSetting: () => {},
})

const Provider = (props: Props) => {
  const [saveSetting, setSaveSetting] = useState(DEFAULT_URL_STATE)
  const [costTable, setCostTable] = useState(DEFAULT_COST_TABLE)
  const { gqlAgents } = useContext(StoreContext)

  useEffect(() => {
    if (gqlAgents.size === 0) return

    const params = new URLSearchParams(window.location.search)

    pipe(
      params.get('allowAgent'),
      when(isNull, () =>
        pipe(
          gqlAgents,
          filter(([, agent]) => agent.isPickup),
          map(([zzzId]) => zzzId),
          join(',')
        )
      ),
      split(','),
      map(Number),
      toArray,
      (allowAgent) => {
        setSaveSetting((prev) => ({
          banCount: isNull(params.get('banCount')) ? prev.banCount : Number(params.get('banCount')),
          totalCost: isNull(params.get('totalCost'))
            ? prev.totalCost
            : Number(params.get('totalCost')),
          allowAgent,
        }))
      }
    )
  }, [gqlAgents])

  return (
    <Context.Provider
      value={{
        setting: { ...saveSetting },
        roundList: DEFAULT_ROUND_LIST,
        costTable,
        setCostTable: (key, value) => {
          function updateNested<T>(item: T, [first, ...rest]: Array<string>): T {
            return rest.length === 0
              ? { ...item, [first]: value }
              : { ...item, [first]: updateNested(item[first as keyof T], rest) }
          }

          setCostTable((prev) => pipe(key, split('.'), toArray, (list) => updateNested(prev, list)))
        },
        setSaveSetting: (setting) => {
          setSaveSetting((prev) => ({
            ...prev,
            ...setting,
          }))
        },
      }}
    >
      {props.children}
    </Context.Provider>
  )
}

export default Provider
