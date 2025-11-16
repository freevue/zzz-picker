import { StoreContext, SettingContext, PlayContext } from '../'
import { isNumber, isObject, map, pipe, toArray, when } from '@fxts/core'
import type {
  Side,
  SelectAgent,
  AgentCostSetting,
  EngineInfo,
  AgentInfo,
} from '@zzz-picker/constant'
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

type Payload = [AgentCostSetting, AgentInfo | undefined, EngineInfo | undefined]

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

export { default as useSocket } from './useSocket'
