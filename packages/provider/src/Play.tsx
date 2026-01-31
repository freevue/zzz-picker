import { Context as SettingContext } from './Setting'
import {
  map,
  pipe,
  range,
  toArray,
  flatMap,
  filter,
  isNull,
  throwIf,
  when,
  isUndefined,
  split,
} from '@fxts/core'
import {
  DEFAULT,
  STORAGE_KEY,
  DEFAULT_PLAY_STATE,
  type SelectAgent,
  type Side,
  type AgentCostSetting,
  type PlayState,
} from '@zzz-picker/constant'
import { createContext, useContext, useEffect, useMemo, useState, useEffectEvent } from 'react'

type Cost = {
  A: Map<number, AgentCostSetting>
  B: Map<number, AgentCostSetting>
}

type Props = {
  children: React.ReactNode
}
type State = {
  state: PlayState
  cost: Cost
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

const saveData = (
  state: PlayState,
  cost: {
    A: [number, AgentCostSetting][]
    B: [number, AgentCostSetting][]
  }
) => {
  const [gameType] = pipe(
    window.location.pathname,
    split('/'),
    filter((item) => item !== ''),
    filter((item) => item !== 'realtime'),
    toArray
  )

  pipe(
    window.localStorage.getItem(STORAGE_KEY),
    when(isNull, () => JSON.stringify({})),
    (data) => JSON.parse(data),
    (prevItem) => ({
      ...prevItem,
      [gameType]: { state, cost },
    }),
    (newItem) => JSON.stringify(newItem),
    (data) => window.localStorage.setItem(STORAGE_KEY, data)
  )
}

export const Context = createContext<State>({
  state: DEFAULT_PLAY_STATE,
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
  const [state, setState] = useState<PlayState>(DEFAULT_PLAY_STATE)
  const [cost, setCost] = useState<Record<Side, Map<number, AgentCostSetting>>>({
    A: new Map(),
    B: new Map(),
  })

  useEffect(() => {
    try {
      pipe(
        window.localStorage.getItem(STORAGE_KEY),
        throwIf(isNull, () => Error('')),
        (storage) => JSON.parse(storage)[window.location.pathname],
        when(isUndefined, () => ({
          state: DEFAULT_PLAY_STATE,
          cost: { A: new Map(), B: new Map() },
        })),
        ({ state, cost }) => {
          setState((prev) => ({ ...prev, ...state }))
          setCost({ A: new Map(cost.A), B: new Map(cost.B) })
        }
      )
    } catch {
      setState(DEFAULT_PLAY_STATE)
      setCost({ A: new Map(), B: new Map() })
    }
  }, [])

  const { state: settingState } = useContext(SettingContext)
  const [isCounting, setIsCounting] = useState<boolean>(false)
  const allPickList = useMemo(() => {
    const getPickList = (side: Side) =>
      pipe(
        state || DEFAULT_PLAY_STATE,
        (state) => [state.common[side], state.personal[side], state.unlimited[side]],
        flatMap((item) => item.pickList),
        filter((agentId) => !isNull(agentId)),
        toArray
      )

    return {
      A: getPickList('A'),
      B: getPickList('B'),
    }
  }, [state])

  const updateCost = useEffectEvent((side: Side, agentId: SelectAgent) => {
    if (isNull(agentId)) return
    if (cost[side].has(agentId)) return

    setCost((prev) => {
      const newCost = { ...prev }

      newCost[side].set(agentId, {
        agentId,
        engineId: null,
        agentRate: 0,
        engineRate: 1,
      })

      return newCost
    })
  })

  useEffect(() => {
    pipe(
      (settingState.banCount || DEFAULT.BAN_COUNT) - state.banList.length,
      range,
      map(() => null),
      toArray,
      (banList) =>
        setState((prev) =>
          prev ? { ...prev, banList: [...prev.banList, ...banList] } : DEFAULT_PLAY_STATE
        )
    )
  }, [settingState.banCount])
  useEffect(() => {
    setIsCounting(false)
  }, [state])
  useEffect(() => {
    saveData(state, { A: [...cost.A.entries()], B: [...cost.B.entries()] })
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
        state: state || DEFAULT_PLAY_STATE,
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
              setState(() => ({ ...DEFAULT_PLAY_STATE, banList }))
              setCost({
                A: new Map(),
                B: new Map(),
              })
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
