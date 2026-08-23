import { Icon } from '..'
import AgentDialog from './AgentDialog'
import EngineDialog from './EngineDialog'
import {
  concat,
  filter,
  isNull,
  isNumber,
  isObject,
  isString,
  join,
  map,
  pipe,
  toArray,
  zipWithIndex,
} from '@fxts/core'
import { useEffect, useMemo, useState } from 'react'
import { useStore } from '~/hooks'
import { agentCost, engineCost } from '~/lib/utils'

type Props = {
  onChange: (cost: number) => void
  key: string
}

const AgentList: React.FC<Props> = (props) => {
  const store = useStore()
  const [activeAgentIndex, setActiveAgentIndex] = useState<number | null>(null)
  const [activeEngineIndex, setActiveEngineIndex] = useState<number | null>(null)
  const [state, setState] = useState({
    agent: [null, null, null] as [number | null, number | null, number | null],
    engine: [null, null, null] as [string | null, string | null, string | null],
    rate: {} as Record<number | string, number>,
  })
  const selectAgent = useMemo(() => {
    if (isNull(activeAgentIndex)) return { agentId: null, rate: 0 }

    return pipe(state.agent[activeAgentIndex], (agentId) => ({
      agentId,
      rate: isNull(agentId) ? 0 : state.rate[agentId],
    }))
  }, [activeAgentIndex, state])
  const selectEngine = useMemo(() => {
    if (isNull(activeEngineIndex)) return { engineId: null, rate: 0 }

    return pipe(state.engine[activeEngineIndex], (engineId) => ({
      engineId,
      rate: isNull(engineId) ? 0 : state.rate[engineId],
    }))
  }, [activeEngineIndex, state])

  const agentTotalCost = useMemo(() => {
    return pipe(
      state.agent,
      filter(isNumber),
      map((agentId) => store.agents.get(agentId)),
      filter(isObject),
      toArray,
      agentCost(state.rate)
    )
  }, [state, store])
  const engineTotalCost = useMemo(() => {
    return pipe(
      state.engine,
      filter(isString),
      map((engineId) => store.engines.get(engineId)),
      filter(isObject),
      toArray,
      engineCost(state.rate)
    )
  }, [state, store])

  const onAgentClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    setActiveAgentIndex(Number(event.currentTarget.value))
  }
  const onEngineClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    setActiveEngineIndex(Number(event.currentTarget.value))
  }
  const onAgentChange = (agentId: number, rate: number) => {
    setState((prev) => {
      if (isNull(activeAgentIndex)) return prev

      prev.agent[activeAgentIndex] = agentId
      prev.rate[agentId] = rate

      return { ...prev }
    })
    setActiveAgentIndex(null)
  }
  const onEngineChange = (engineId: string, rate: number) => {
    setState((prev) => {
      if (isNull(activeEngineIndex)) return prev

      prev.engine[activeEngineIndex] = engineId
      prev.rate[engineId] = rate

      return { ...prev }
    })
    setActiveEngineIndex(null)
  }

  useEffect(() => {
    props.onChange(agentTotalCost + engineTotalCost)
  }, [agentTotalCost, engineTotalCost])

  return (
    <>
      <div className="max-w-lg mx-auto flex flex-col gap-4 card rounded-3xl p-4 pb-8 w-full">
        <ul className="flex w-full flex-wrap gap-4">
          {pipe(
            state.agent,
            zipWithIndex,
            map(([index, agentId]) => ({ index, agentId, engineId: state.engine[index] })),
            map(({ index, agentId, engineId }) => (
              <li className="flex-1 relative" key={index}>
                <p
                  className={pipe(
                    ['ft-ria', 'text-lg', 'text-center', 'tabular-nums'],
                    // concat(isNumber(agentId) ? ['opacity-100'] : ['opacity-0']),
                    join(' ')
                  )}
                >
                  <span className="text-xs">M.</span>
                  <span className="text-primary">
                    {(isNumber(agentId) && state.rate[agentId]) || 0}
                  </span>
                  <span className="mx-1">/</span>
                  <span className="text-xs">W.</span>
                  <span className="text-primary">
                    {(isString(engineId) && state.rate[engineId]) || 0}
                  </span>
                </p>
                <button
                  onClick={onAgentClick}
                  type="button"
                  value={index}
                  className="block w-full aspect-square bg-accent rounded-2xl overflow-hidden cursor-pointer"
                >
                  {isNull(agentId) ? (
                    <Icon.Plus className="scale-75" />
                  ) : (
                    <img
                      style={{
                        backgroundColor: store.agents.get(agentId)!.color || 'transparent',
                      }}
                      src={store.agents.get(agentId)!.profile}
                      alt={store.agents.get(agentId)!.nameKo}
                    />
                  )}
                </button>
                <button
                  type="button"
                  value={index}
                  onClick={onEngineClick}
                  className={pipe(
                    [
                      'absolute',
                      '-right-3',
                      '-bottom-6',
                      'size-14',
                      'flex',
                      'items-center',
                      'justify-center',
                      'text-5xl',
                      'cursor-pointer',
                      'overflow-hidden',
                      'rounded-full',
                      'border-2',
                      'border-solid',
                      'border-content',
                    ],
                    concat(isNull(engineId) ? ['bg-accent'] : ['backdrop-blur-lg']),
                    join(' ')
                  )}
                >
                  {isNull(engineId) ? (
                    <Icon.Plus className="scale-75" />
                  ) : (
                    <img
                      className="relative z-1 rounded-xl block w-full"
                      src={store.engines.get(engineId)!.banner}
                      alt={store.engines.get(engineId)!.nameKo}
                    />
                  )}
                </button>
              </li>
            )),
            toArray
          )}
        </ul>
      </div>
      {isNumber(activeAgentIndex) && (
        <AgentDialog
          agentId={selectAgent.agentId}
          rate={selectAgent.rate}
          onChange={onAgentChange}
          active={isNumber(activeAgentIndex)}
        />
      )}
      {isNumber(activeEngineIndex) && (
        <EngineDialog
          engineId={selectEngine.engineId}
          rate={selectEngine.rate}
          onChange={onEngineChange}
          active={isNumber(activeEngineIndex)}
        />
      )}
    </>
  )
}

export default AgentList
