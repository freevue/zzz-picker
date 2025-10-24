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
import { createContext, useContext, useEffect, useState } from 'react'

export type CostWeight = {
  used: number
  rate: number
}
export type CostTable = {
  agent: {
    SPick: CostWeight
    SAlways: CostWeight
    AAlways: CostWeight
  }
  engine: {
    SExclusive: CostWeight
    S: CostWeight
    A: CostWeight
  }
}
export const DEFAULT_COST_TABLE: CostTable = {
  agent: {
    SPick: {
      used: 1,
      rate: 1,
    },
    SAlways: {
      used: 0,
      rate: 0,
    },
    AAlways: {
      used: 0,
      rate: 0,
    },
  },
  engine: {
    SExclusive: {
      used: 1,
      rate: 0.5,
    },
    S: {
      used: 0,
      rate: 1, // 4~5인 경우 1cost
    },
    A: {
      used: 0,
      rate: 0,
    },
  },
}
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
  const { agent } = useContext(StoreContext)

  useEffect(() => {
    if (agent.size === 0) return

    const params = new URLSearchParams(window.location.search)

    pipe(
      params.get('allowAgent'),
      when(isNull, () =>
        pipe(
          agent,
          filter(([, agent]) => agent.isUp),
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
  }, [agent])
  useEffect(() => {
    if (agent.size === 0) return

    const params = new URLSearchParams(window.location.search)

    pipe(
      saveSetting,
      entries,
      each(([key, value]) => {
        if (isArray(value)) {
          params.set(key, join(',', value))
        }
        if (isNumber(value)) {
          params.set(key, `${value}`)
        }
        if (isString(value)) {
          params.set(key, value)
        }
      }),
      () => {
        window.history.replaceState(null, '', `?${params.toString()}`)
      }
    )
  }, [agent, saveSetting])

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
