import { Context as SettingContext } from './Setting'
import { Context as StoreContext } from './Store'
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
} from '@fxts/core'
import {
  DEFAULT,
  STORAGE_KEY,
  type SelectAgent,
  type Side,
  type AgentCostSetting,
  type CommonRound,
  type PersonalRound,
  type UnlimitedRound,
} from '@zzz-picker/constant'
import { getAgentRarity } from '@zzz-picker/utils'
import { createContext, useContext, useEffect, useMemo, useState, useEffectEvent, use } from 'react'

type PlayState = {
  nickname: {
    A: string
    B: string
  }
  banList: Array<SelectAgent>
  common: CommonRound
  personal: PersonalRound
  unlimited: UnlimitedRound
}
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
  pipe(
    window.localStorage.getItem(STORAGE_KEY),
    when(isNull, () => JSON.stringify({})),
    (data) => JSON.parse(data),
    (prevItem) => ({
      ...prevItem,
      [window.location.pathname]: { state, cost },
    }),
    (newItem) => JSON.stringify(newItem),
    (data) => window.localStorage.setItem(STORAGE_KEY, data)
  )
}

const DEFAULT_STATE = {
  nickname: {
    A: '',
    B: '',
  },
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
  const [state, setState] = useState<PlayState>(() => {
    try {
      return pipe(
        window.localStorage.getItem(STORAGE_KEY),
        throwIf(isNull, () => Error('')),
        (storage) => JSON.parse(storage)[window.location.pathname],
        when(isUndefined, () => ({ state: DEFAULT_STATE })),
        ({ state }) => ({ ...DEFAULT_STATE, ...state })
      )
    } catch {
      return DEFAULT_STATE
    }
  })
  const [cost, setCost] = useState<Record<Side, Map<number, AgentCostSetting>>>(() => {
    try {
      return pipe(
        window.localStorage.getItem(STORAGE_KEY),
        throwIf(isNull, () => Error('')),
        (storage) => JSON.parse(storage)[window.location.pathname],
        when(isUndefined, () => ({
          cost: { A: new Map(), B: new Map() },
        })),
        ({ cost }) => ({ A: new Map(cost.A), B: new Map(cost.B) })
      )
    } catch {
      return { A: new Map(), B: new Map() }
    }
  })
  const { state: settingState } = useContext(SettingContext)
  const [isCounting, setIsCounting] = useState<boolean>(false)
  const allPickList = useMemo(() => {
    const getPickList = (side: Side) =>
      pipe(
        state || DEFAULT_STATE,
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
      (banList) => setState((prev) => (prev ? { ...prev, banList } : DEFAULT_STATE))
    )
  }, [settingState.banCount, loading])
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
        state: state || DEFAULT_STATE,
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
