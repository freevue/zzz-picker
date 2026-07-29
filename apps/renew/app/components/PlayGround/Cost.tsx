import {
  filter,
  flat,
  flatMap,
  groupBy,
  isNumber,
  isObject,
  isString,
  map,
  pipe,
  sort,
  toArray,
  values,
} from '@fxts/core'
import { useMemo } from 'react'
import { useMatchState, useStore } from '~/hooks'
import { agentCost, engineCost } from '~/lib/utils'
import { PlayerRole } from '~/type'

const Cost: React.FC = () => {
  const matchState = useMatchState()
  const store = useStore()
  const rateDate = useMemo(() => {
    return matchState.state.rate[matchState.player!.role as PlayerRole]
  }, [matchState])
  const totalAgentCost = useMemo(() => {
    return pipe(
      matchState.state.agent[matchState.player!.role as PlayerRole],
      values,
      flat,
      filter(isNumber),
      map((agentId) => store.agents.get(agentId)),
      filter(isObject),
      toArray,
      agentCost(matchState.state.rate[matchState.player!.role as PlayerRole].agents)
    )
  }, [store, matchState])
  const totalEngineCost = useMemo(() => {
    return pipe(
      matchState.state.engine[matchState.player!.role as PlayerRole],
      values,
      flat,
      filter(isString),
      map((engineId) => store.engines.get(engineId)),
      filter(isObject),
      toArray,
      engineCost(matchState.state.rate[matchState.player!.role as PlayerRole].engines)
    )
  }, [store, matchState])

  return (
    <div className="fixed bottom-0 right-0 left-0 p-4">
      <p className="ft-ria rounded-full bg-accent h-14 w-full mx-auto max-w-lg text-center text-primary leading-14 text-3xl">
        {totalAgentCost + totalEngineCost}{' '}
        <span className="ft-pre text-ink text-xl font-black">Cost</span>
      </p>
    </div>
  )
}

export default Cost
