import { Context as StoreContext } from './Store'
import { join, filter, map, pipe, when, split, isNull, toArray } from '@fxts/core'
import { DEFAULT_COST_TABLE, DEFAULT, type CostTable } from '@zzz-picker/constant'
import { createContext, useContext, useEffect, useState } from 'react'

const DEFAULT_URL_STATE = {
  banCount: 2,
  totalCost: 24,
  allowAgent: [] as Array<number>,
}
const DEFAULT_ROUND_LIST = ['1라운드', '2라운드']

type Optios = {
  banCount?: number
  totalCost?: number
  allowAgent?: Array<number>
}
type SettingState = {
  banCount: number
  totalCost: number
  allowAgent: Array<number>
}
type Props = {
  children: React.ReactNode
  option: Optios
}
type State = {
  state: SettingState

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
  state: {
    banCount: DEFAULT.BAN_COUNT,
    totalCost: DEFAULT.TOTAL_COST,
    allowAgent: [],
  },
  setting: {
    ...DEFAULT_URL_STATE,
  },
  roundList: DEFAULT_ROUND_LIST,
  costTable: DEFAULT_COST_TABLE,
  setCostTable: () => {},
  setSaveSetting: () => {},
})

const Provider = (props: Props) => {
  const [state, setState] = useState<SettingState>({
    totalCost: DEFAULT.TOTAL_COST,
    banCount: DEFAULT.BAN_COUNT,
    allowAgent: [],
    ...(props.option || {}),
  })

  const [saveSetting, setSaveSetting] = useState(DEFAULT_URL_STATE)
  const [costTable, setCostTable] = useState(DEFAULT_COST_TABLE)

  return (
    <Context.Provider
      value={{
        state,

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
