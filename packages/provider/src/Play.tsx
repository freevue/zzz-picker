import { Context as SettingContext } from './Setting'
import { Context as StoreContext } from './Store'
import { map, pipe, range, toArray, flatMap, filter, isNull } from '@fxts/core'
import {
  DEFAULT,
  type SelectAgent,
  type Side,
  type AgentCostSetting,
  type CommonRound,
  type PersonalRound,
  type UnlimitedRound,
} from '@zzz-picker/constant'
import { getAgentRarity } from '@zzz-picker/utils'
import { createContext, useContext, useEffect, useMemo, useState, useEffectEvent } from 'react'

type PlayState = {
  banList: Array<SelectAgent>
  common: CommonRound
  personal: PersonalRound
  unlimited: UnlimitedRound
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
  allPickList: {
    A: SelectAgent[]
    B: SelectAgent[]
  }
  isCounting: boolean
  setCost: React.Dispatch<React.SetStateAction<Record<Side, Map<number, AgentCostSetting>>>>
  setIsCounting: React.Dispatch<React.SetStateAction<boolean>>
  setState: React.Dispatch<React.SetStateAction<PlayState>>
  reset: () => void
}

const DEFAULT_STATE = {
  banList: pipe(
    DEFAULT.BAN_COUNT,
    range,
    map(() => null),
    toArray
  ),
  common: {
    key: 'common',
    title: '공용 무대',
    boss: null,
    A: DEFAULT.ROUNDE_SIDE,
    B: DEFAULT.ROUNDE_SIDE,
  } as CommonRound,
  personal: {
    key: 'personal',
    title: '개인 무대',
    A: { ...DEFAULT.ROUNDE_SIDE, boss: null },
    B: { ...DEFAULT.ROUNDE_SIDE, boss: null },
  } as PersonalRound,
  unlimited: {
    key: 'unlimited',
    title: '개인 무대',
    A: { ...DEFAULT.ROUNDE_SIDE, boss: null },
    B: { ...DEFAULT.ROUNDE_SIDE, boss: null },
  } as UnlimitedRound,
}

export const Context = createContext<State>({
  state: DEFAULT_STATE,
  isCounting: false,
  allPickList: {
    A: [],
    B: [],
  },
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
  const { agents, loading } = useContext(StoreContext)
  const [state, setState] = useState<PlayState>(DEFAULT_STATE)
  const [cost, setCost] = useState<Record<Side, Map<number, AgentCostSetting>>>({
    A: new Map(),
    B: new Map(),
  })
  const { state: settingState } = useContext(SettingContext)
  const [isCounting, setIsCounting] = useState<boolean>(false)
  const allPickList = useMemo(() => {
    const getPickList = (side: Side) =>
      pipe(
        [state.common[side], state.personal[side], state.unlimited[side]],
        flatMap((item) => item.pickList),
        filter((agentId) => !isNull(agentId)),
        toArray
      )

    return {
      A: getPickList('A'),
      B: getPickList('B'),
    }
  }, [state.common, state.personal, state.unlimited])

  const updateCost = useEffectEvent((side: Side, agentId: SelectAgent) => {
    if (isNull(agentId)) return
    if (cost[side].has(agentId)) return

    pipe(
      agents.get(agentId)!,
      getAgentRarity,
      (rarity) => ({
        rarity,
        agentRate: 0,
        engineType: null,
        engineRate: 1,
      }),
      (agentSetting) => {
        setCost((prev) => {
          const newCost = { ...prev }
          newCost[side].set(agentId, agentSetting)
          return newCost
        })
      }
    )
  })

  useEffect(() => {
    if (loading) return

    pipe(
      settingState.banCount || DEFAULT.BAN_COUNT,
      range,
      map(() => null),
      toArray,
      (banList) => setState((prev) => ({ ...prev, banList }))
    )
  }, [settingState.banCount, loading])
  useEffect(() => {
    setIsCounting(false)
  }, [state])
  useEffect(() => {
    const prevItem = window.localStorage.getItem('zzz-picker-play')

    if (!prevItem) return

    const data = JSON.parse(prevItem)[window.location.pathname]

    if (data) {
      setCost({
        A: new Map(data.cost.A),
        B: new Map(data.cost.B),
      })
      setState(data.state)
    }
  }, [])
  useEffect(() => {
    window.localStorage.setItem(
      'zzz-picker-play',
      JSON.stringify({
        [window.location.pathname]: {
          state,
          cost: { A: [...cost.A.entries()], B: [...cost.B.entries()] },
        },
      })
    )
  }, [state, cost])
  useEffect(() => {
    for (const agentId of allPickList.A) {
      updateCost('A', agentId)
    }
    for (const agentId of allPickList.B) {
      updateCost('B', agentId)
    }
  }, [allPickList])

  return (
    <Context.Provider
      value={{
        state,
        isCounting,
        cost,
        allPickList,
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
