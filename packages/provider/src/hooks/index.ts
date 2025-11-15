import { StoreContext, SettingContext, PlayContext } from '../'
import { isNull, isUndefined, map, pipe, toArray, when } from '@fxts/core'
import type { Side, SelectAgent } from '@zzz-picker/constant'
import { getAgentCost, getEngineCost } from '@zzz-picker/utils'
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

export const useCostList = (side: Side, selectAgents: SelectAgent[]) => {
  const { cost } = usePlay()
  const { costTable } = useSetting()
  const { agents, engines } = useStore()

  return useMemo(() => {
    return pipe(
      selectAgents,
      map((agentId) => (isNull(agentId) ? undefined : cost[side].get(agentId))),
      map((cost) => {
        if (isUndefined(cost)) return 0

        const engineCost = getEngineCost(costTable, {
          engine: engines.get(Number(cost.engineId))!,
          engineRate: cost.engineRate,
          agentId: Number(cost.agentId),
        })

        return pipe(
          agents.get(cost.agentId),
          when(
            (agent) => !isUndefined(agent),
            ({ rarity, isPickup }) => ({ rarity, isPickup })
          ),
          (agent) => ({ agent, agentRate: cost.agentRate }),
          getAgentCost(costTable),
          (agentCost) => agentCost + engineCost
        )
      }),
      toArray
    )
  }, [cost, side, selectAgents, agents, engines])
}

export { default as useSocket } from './useSocket'
