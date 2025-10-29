import { Context as RouterContext } from './Router'
import {
  join,
  filter,
  map,
  pipe,
  split,
  toArray,
  entries,
  isArray,
  fromEntries,
  isEmpty,
} from '@fxts/core'
import { DEFAULT_COST_TABLE, DEFAULT, type CostTable } from '@zzz-picker/constant'
import { createContext, useContext, useEffect, useState } from 'react'

type Optios = {
  banCount: number
  totalCost: number
  allowAgent: Array<number>
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
  setState: React.Dispatch<React.SetStateAction<SettingState>>
  costTable: CostTable
  setCostTable: (key: string, value: number) => void
}

export const Context = createContext<State>({
  state: {
    banCount: DEFAULT.BAN_COUNT,
    totalCost: DEFAULT.TOTAL_COST,
    allowAgent: [],
  },
  setState: () => {},
  costTable: DEFAULT_COST_TABLE,
  setCostTable: () => {},
})

const Provider = (props: Props) => {
  const { replace } = useContext(RouterContext)
  const [state, setState] = useState<SettingState>(props.option)
  const [costTable, setCostTable] = useState(DEFAULT_COST_TABLE)

  useEffect(() => {
    pipe(
      state,
      entries,
      filter(([, value]) => !isEmpty(value) && !!value),
      map(([key, value]) => {
        if (isArray(value)) return [key, join(',', value)] as const

        return [key, `${value}`] as const
      }),
      fromEntries,
      (searchParams) => replace({ searchParams })
    )
  }, [state])

  return (
    <Context.Provider
      value={{
        state,
        setState,
        costTable,
        setCostTable: (key, value) => {
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
    </Context.Provider>
  )
}

export default Provider
