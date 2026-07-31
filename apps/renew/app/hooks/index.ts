import { filter, isNumber, isObject, isString, map, pipe, toArray } from '@fxts/core'
import { useContext, useMemo } from 'react'
import { Role } from '~/constant'
import { agentCost, engineCost } from '~/lib/utils'
import { StoreContext, MatchStateContext, ScoreContext } from '~/provider'

export const useStore = () => {
  return useContext(StoreContext)
}

export const useMatchState = () => {
  return useContext(MatchStateContext)
}

export const useScore = () => {
  return useContext(ScoreContext)
}

export const useCost = (round: number) => {
  const matchState = useContext(MatchStateContext)
  const store = useContext(StoreContext)

  return useMemo(() => {
    return {
      [Role.A_SIDE]: {
        agentCost: pipe(
          matchState.state.agent[Role.A_SIDE][round],
          filter(isNumber),
          map((agentId) => store.agents.get(agentId!)),
          filter(isObject),
          toArray,
          agentCost(matchState.state.rate[Role.A_SIDE].agents)
        ),
        engineCost: pipe(
          matchState.state.engine[Role.A_SIDE][round],
          filter(isString),
          map((engineId) => store.engines.get(engineId!)),
          filter(isObject),
          toArray,
          engineCost(matchState.state.rate[Role.A_SIDE].engines)
        ),
      },
      [Role.B_SIDE]: {
        agentCost: pipe(
          matchState.state.agent[Role.B_SIDE][round],
          filter(isNumber),
          map((agentId) => store.agents.get(agentId!)),
          filter(isObject),
          toArray,
          agentCost(matchState.state.rate[Role.B_SIDE].agents)
        ),
        engineCost: pipe(
          matchState.state.engine[Role.B_SIDE][round],
          filter(isString),
          map((engineId) => store.engines.get(engineId!)),
          filter(isObject),
          toArray,
          engineCost(matchState.state.rate[Role.B_SIDE].engines)
        ),
      },
    }
  }, [matchState, store])
}
