import { Context as RouterContext } from './Router'
import { Context as SettingContext } from './Setting'
import { map, pipe, range, toArray } from '@fxts/core'
import {
  DEFAULT,
  type SelectAgent,
  type SelectBoss,
  type RoundSide,
  type Side,
  type AgentCostSetting,
} from '@zzz-picker/constant'
import { createContext, useContext, useEffect, useState } from 'react'

type PlayState = {
  banList: Array<SelectAgent>
  common: {
    title: string
    boss: SelectBoss
  } & Record<Side, RoundSide>
  personal: {
    title: string
  } & Record<Side, RoundSide & { boss: SelectBoss }>
}

type Props = {
  children: React.ReactNode
}
type State = {
  state: PlayState
  cost: {
    A: Map<number, AgentCostSetting>
    B: Map<number, AgentCostSetting>
  }
  isCounting: boolean
  setCost: React.Dispatch<React.SetStateAction<Record<Side, Map<number, AgentCostSetting>>>>
  setIsCounting: React.Dispatch<React.SetStateAction<boolean>>
  setState: React.Dispatch<React.SetStateAction<PlayState>>
  reset: () => void
}

const DEFAULT_STATE = {
  banList: [],
  common: {
    title: '공용 무대',
    boss: null,
    A: DEFAULT.ROUNDE_SIDE,
    B: DEFAULT.ROUNDE_SIDE,
  },
  personal: {
    title: '개인 무대',
    A: { ...DEFAULT.ROUNDE_SIDE, boss: null },
    B: { ...DEFAULT.ROUNDE_SIDE, boss: null },
  },
}

export const Context = createContext<State>({
  state: DEFAULT_STATE,
  isCounting: false,
  cost: {
    A: new Map(),
    B: new Map(),
  },
  setCost: () => {},
  setIsCounting: () => {},
  setState: () => {},
  reset: () => {},
})

const Provider = (props: Props) => {
  const [state, setState] = useState<PlayState>(DEFAULT_STATE)
  const [cost, setCost] = useState<Record<Side, Map<number, AgentCostSetting>>>({
    A: new Map(),
    B: new Map(),
  })
  const { path } = useContext(RouterContext)
  const { state: settingState } = useContext(SettingContext)
  const [isCounting, setIsCounting] = useState<boolean>(false)

  useEffect(() => {
    pipe(
      settingState.banCount,
      range,
      map(() => null),
      toArray,
      (banList) => setState((prev) => ({ ...prev, banList }))
    )
  }, [settingState.banCount])
  useEffect(() => {
    setIsCounting(false)
  }, [state])
  useEffect(() => {
    const prevItem = window.localStorage.getItem('zzz-picker-play')

    if (!prevItem) return

    const data = JSON.parse(prevItem)[path]

    if (data) {
      setCost({
        A: new Map(data.cost.A),
        B: new Map(data.cost.B),
      })
      setState(data.state)
    }
  }, [path])
  useEffect(() => {
    window.localStorage.setItem(
      'zzz-picker-play',
      JSON.stringify({
        [path]: {
          state,
          cost: { A: [...cost.A.entries()], B: [...cost.B.entries()] },
        },
      })
    )
  }, [path, state, cost])

  return (
    <Context.Provider
      value={{
        state,
        isCounting,
        cost,
        setCost,
        setIsCounting,
        setState,
        reset: () => {
          pipe(
            settingState.banCount,
            range,
            map(() => null),
            toArray,
            (banList) => {
              setState(() => ({ ...DEFAULT_STATE, banList }))
              setCost({
                A: new Map(),
                B: new Map(),
              })

              window.localStorage.removeItem('zzz-picker-play')
            }
          )
        },
      }}
    >
      {props.children}
    </Context.Provider>
  )
}

export default Provider
