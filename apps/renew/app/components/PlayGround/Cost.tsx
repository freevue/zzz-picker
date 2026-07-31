import {
  filter,
  find,
  flat,
  flatMap,
  groupBy,
  isNumber,
  isObject,
  isString,
  isUndefined,
  map,
  pipe,
  sort,
  sum,
  toArray,
  values,
} from '@fxts/core'
import { useMemo } from 'react'
import { useMatch, useStore } from '~/hooks'
import { agentCost, engineCost } from '~/lib/utils'
import { PlayerRole } from '~/type'

const Cost: React.FC = () => {
  const { currentPlay } = useMatch()
  const store = useStore()
  // const rateDate = useMemo(() => {
  //   return matchState.state.rate[matchState.player!.role as PlayerRole]
  // }, [matchState])
  const totalAgentCost = useMemo(() => {
    if (isUndefined(currentPlay)) return 0

    return pipe(
      currentPlay.agentSlot,
      flat,
      map(({ id, rate }) => ({ agent: store.agents.get(id), rate })),
      filter(({ agent }) => !isUndefined(agent)),
      map(({ rate, agent }) => find((cost) => cost.rate === rate, agent!.cost)),
      filter(isObject),
      map(({ cost }) => cost),
      sum
    )
  }, [store, currentPlay])
  const totalEngineCost = useMemo(() => {
    if (isUndefined(currentPlay)) return 0

    return pipe(
      currentPlay.engineSlot,
      flat,
      map(({ id, rate }) => ({ engine: store.engines.get(id), rate })),
      filter(({ engine }) => !isUndefined(engine)),
      map(({ rate, engine }) => find((cost) => cost.rate === rate, engine!.cost)),
      filter(isObject),
      map(({ cost }) => cost),
      sum
    )
  }, [store, currentPlay])

  return (
    <div className="fixed bottom-0 right-0 left-0 p-4">
      <p className="ft-pre text-ink text-xl font-black rounded-full bg-accent h-14 w-full mx-auto max-w-lg text-center leading-14">
        <span>총</span>
        <span className="ft-ria text-primary text-3xl mx-2">
          {totalAgentCost + totalEngineCost}
        </span>
        <span>Ct</span>
      </p>
    </div>
  )
}

export default Cost
