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

const DEFAULT_URL_STATE = {
  banCount: 2,
  totalCost: 20,
  allowAgent: [] as Array<number>,
}

type Props = {
  children: React.ReactNode
}
type State = {
  setting: {
    banCount: number
    totalCost: number
    allowAgent: Array<number>
  }
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
  setSaveSetting: () => {},
})

const Provider = (props: Props) => {
  const [saveSetting, setSaveSetting] = useState(DEFAULT_URL_STATE)
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
