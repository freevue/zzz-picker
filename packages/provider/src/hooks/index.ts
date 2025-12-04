import { StoreContext, SettingContext, PlayContext } from '../'
import { isNumber, isObject, map, pipe, toArray, when, transpose, sum, flatMap } from '@fxts/core'
import type {
  Side,
  SelectAgent,
  AgentCostSetting,
  Engine,
  AgentInfo,
  PartyData,
} from '@zzz-picker/constant'
import type { HistoryData } from '@zzz-picker/constant'
import { DEFAULT_COST_RATE, DEFAULT } from '@zzz-picker/constant'
import { getTotalCost } from '@zzz-picker/utils'
import { useContext, useMemo } from 'react'

export const useStore = () => {
  return useContext(StoreContext)
}

export const useAgent = (id: number) => {
  const { agents } = useContext(StoreContext)

  return useMemo(() => agents.get(id), [agents, id])
}

export const useEngine = (id: number | null) => {
  const { engines } = useContext(StoreContext)

  return useMemo(() => engines.get(Number(id)), [engines, id])
}

export const useSetting = () => {
  return useContext(SettingContext)
}

export const usePlay = () => {
  return useContext(PlayContext)
}

export const useSelectEngine = (side: Side, selectAgents: SelectAgent[]) => {
  const { cost } = usePlay()
  const { engines } = useStore()

  return useMemo(
    () =>
      pipe(
        selectAgents,
        map(when(isNumber, (agentId) => cost[side].get(agentId)?.engineId || null)),
        map(when(isNumber, (engineId) => engines.get(engineId) || null)),
        toArray
      ),
    [cost, side, selectAgents]
  )
}

type Payload = [AgentCostSetting, AgentInfo | undefined, Engine | undefined]

export const useCostList = (side: Side, selectAgents: SelectAgent[]) => {
  const { cost } = usePlay()
  const { costTable } = useSetting()
  const { agents, engines } = useStore()

  return pipe(
    selectAgents,
    map(when(isNumber, (agentId) => cost[side].get(agentId) || null)),
    map(
      when(
        isObject,
        (cost) => [cost, agents.get(cost.agentId), engines.get(cost.engineId || NaN)] as Payload
      )
    ),
    map(getTotalCost(costTable)),
    toArray
  )
}

export const useResultCalculation = () => {
  const { costTable } = useSetting()
  const { agents, engines } = useStore()

  return {
    getCost: (data: Array<PartyData>) =>
      pipe(
        data,
        flatMap((item) => [item.select_1, item.select_2, item.select_3]),
        map(
          (select) =>
            [select, agents.get(select.agentId), engines.get(select.engineId || NaN)] as [
              AgentCostSetting,
              AgentInfo | undefined,
              Engine | undefined,
            ]
        ),
        map(getTotalCost(costTable)),
        sum
      ),
    getTotalScore: (data: Array<PartyData>) =>
      pipe(
        data,
        map((item) => item.score),
        sum
      ),
    getTotalTime: (data: Array<PartyData>) =>
      pipe(
        data,
        map((item) =>
          180 >= item.elapsedTime && item.elapsedTime > 0 ? 180 - item.elapsedTime : 0
        ),
        sum
      ),
  }
}
export const useHistoryRecord = (data: Array<HistoryData>) => {
  const { state } = useSetting()
  const { getCost, getTotalScore, getTotalTime } = useResultCalculation()
  const list = useMemo(() => {
    return pipe(
      data,
      map(({ playList, matchType, id }) => ({
        id,
        matchType,
        playData: pipe(
          playList,
          map(({ aParty, bParty }) => [aParty, bParty]),
          (list) => transpose(...list),
          toArray
        ) as unknown as [Array<PartyData>, Array<PartyData>],
      })),
      toArray
    )
  }, [data])

  // roundTotalScore.A,
  // settingState.totalCost === Infinity
  //   ? 0
  //   : roundTotalScore.A * (settingState.totalCost - totalCost.A) * DEFAULT_COST_RATE,
  // roundTotalTime.A,

  return pipe(
    list,
    map(({ id, matchType, playData }) => ({
      id,
      matchType,
      ...pipe(
        playData,
        map((playData) => ({
          playData,
          score: getTotalScore(playData),
          totalCost: getCost(playData),
          totalTime: getTotalTime(playData),
          totalScore: sum([
            getTotalScore(playData),
            matchType === 'original'
              ? getTotalScore(playData) * (state.totalCost - getCost(playData)) * DEFAULT_COST_RATE
              : 0,
            getTotalTime(playData) * DEFAULT.TIME_BONUS,
          ]),
        })),
        toArray,
        ([aSide, bSide]) => ({ aSide, bSide })
      ),
    })),
    toArray
  )
}

export { default as useSocket } from './useSocket'
