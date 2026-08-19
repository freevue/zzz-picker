import {
  filter,
  find,
  flat,
  isNumber,
  isObject,
  isUndefined,
  map,
  pipe,
  sum,
  when,
} from '@fxts/core'
import { useContext, useMemo } from 'react'
import { Role } from '~/constant'
import { StoreContext, MatchContext } from '~/provider'

export const useStore = () => {
  return useContext(StoreContext)
}

export const useMatch = () => {
  return useContext(MatchContext)
}

export const useCost = (round?: number) => {
  const { play } = useContext(MatchContext)
  const store = useContext(StoreContext)

  return useMemo(() => {
    return {
      [Role.A_SIDE]: {
        agentCost: pipe(
          play[Role.A_SIDE].agentSlot,
          when(
            () => isNumber(round),
            (list) => list[round!]
          ),
          flat,
          map(({ id, rate }) => ({ agent: store.agents.get(id), rate })),
          filter(({ agent }) => !isUndefined(agent)),
          map(({ rate, agent }) => find((cost) => cost.rate === rate, agent!.cost)),
          filter(isObject),
          map(({ cost }) => cost),
          sum
        ),
        engineCost: pipe(
          play[Role.A_SIDE].engineSlot,
          when(
            () => isNumber(round),
            (list) => list[round!]
          ),
          flat,
          map(({ id, rate }) => ({ engine: store.engines.get(id), rate })),
          filter(({ engine }) => !isUndefined(engine)),
          map(({ rate, engine }) => find((cost) => cost.rate === rate, engine!.cost)),
          filter(isObject),
          map(({ cost }) => cost),
          sum
        ),
      },
      [Role.B_SIDE]: {
        agentCost: pipe(
          play[Role.B_SIDE].agentSlot,
          when(
            () => isNumber(round),
            (list) => list[round!]
          ),
          flat,
          map(({ id, rate }) => ({ agent: store.agents.get(id), rate })),
          filter(({ agent }) => !isUndefined(agent)),
          map(({ rate, agent }) => find((cost) => cost.rate === rate, agent!.cost)),
          filter(isObject),
          map(({ cost }) => cost),
          sum
        ),
        engineCost: pipe(
          play[Role.B_SIDE].engineSlot,
          when(
            () => isNumber(round),
            (list) => list[round!]
          ),
          flat,
          map(({ id, rate }) => ({ engine: store.engines.get(id), rate })),
          filter(({ engine }) => !isUndefined(engine)),
          map(({ rate, engine }) => find((cost) => cost.rate === rate, engine!.cost)),
          filter(isObject),
          map(({ cost }) => cost),
          sum
        ),
      },
    }
  }, [play, store, round])
}
