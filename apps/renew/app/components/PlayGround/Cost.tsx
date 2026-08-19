import { filter, find, flat, isObject, isUndefined, map, pipe, sum } from '@fxts/core'
import { useMemo } from 'react'
import { useMatch, useStore } from '~/hooks'

const Cost: React.FC = () => {
  const { currentPlay } = useMatch()
  const store = useStore()
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
      <p className="ft-pre text-ink text-xl font-black rounded-full bg-accent h-14 w-full mx-auto max-w-lg text-center leading-15">
        <span className="ft-ria text-primary text-3xl mx-2">
          {totalAgentCost + totalEngineCost}
        </span>
        <span>Co.</span>
      </p>
    </div>
  )
}

export default Cost
