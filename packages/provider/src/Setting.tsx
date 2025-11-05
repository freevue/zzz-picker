import { pipe, split, toArray } from '@fxts/core'
import { DEFAULT, type CostTable } from '@zzz-picker/constant'
import { createContext, useEffect, useState, useContext } from 'react'

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
  costTable: DEFAULT.COST_TABLE,
  setCostTable: () => {},
})

const Provider = (props: Props) => {
  const [state, setState] = useState<SettingState>({
    banCount: DEFAULT.BAN_COUNT,
    totalCost: DEFAULT.TOTAL_COST,
    allowAgent: [],
  })
  const [costTable, setCostTable] = useState(DEFAULT.COST_TABLE)

  useEffect(() => {
    setState((prev) => ({ ...prev, ...props.option }))
  }, [props.option])

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
