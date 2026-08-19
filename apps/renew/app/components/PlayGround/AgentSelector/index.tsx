import AgentButton from './AgentButton'
import AgentDialog from './AgentDialog'
import EngineButton from './EngineButton'
import EngineDialog from './EngineDialog'
import {
  concat,
  entries,
  filter,
  find,
  flat,
  flatMap,
  isNumber,
  isObject,
  isString,
  isUndefined,
  join,
  map,
  pipe,
  sum,
  toArray,
  zipWithIndex,
} from '@fxts/core'
import { useMemo, useState } from 'react'
import { useMatch, useStore } from '~/hooks'
import { PlayerRole } from '~/type'

type Props = {
  round: number
  role: PlayerRole
}

const AgentSelector: React.FC<Props> = (props) => {
  const { currentPlay, play } = useMatch()
  const store = useStore()
  const [selectAgentIndex, setSelectAgentIndex] = useState<number | null>(null)
  const [selectEngineindex, setSelectEngineIndex] = useState<number | null>(null)
  const roundData = useMemo(() => {
    if (isUndefined(currentPlay)) return []

    const engineList = currentPlay.engineSlot[props.round]

    return pipe(
      currentPlay.agentSlot[props.round],
      zipWithIndex,
      map(([index, agent]) => ({ index, agent, engine: engineList[index] })),
      toArray
    )
  }, [currentPlay, props.round])
  const selectBan = useMemo(() => {
    return pipe(
      play,
      entries,
      flatMap(([, play]) => play.selectBan),
      toArray
    )
  }, [play])
  const selectAgent = useMemo(() => {
    if (isUndefined(currentPlay)) return []

    return pipe(
      currentPlay.agentSlot,
      flat,
      map((agent) => agent.id),
      toArray
    )
  }, [currentPlay])
  const roundAgentCost = useMemo(() => {
    if (isUndefined(currentPlay)) return 0

    return pipe(
      currentPlay.engineSlot[props.round],
      map(({ id, rate }) => ({ engine: store.engines.get(id), rate })),
      filter(({ engine }) => !isUndefined(engine)),
      map(({ rate, engine }) => find((cost) => cost.rate === rate, engine!.cost)),
      filter(isObject),
      map(({ cost }) => cost),
      sum
    )
  }, [store, currentPlay, props.round])
  const roundEngineCost = useMemo(() => {
    if (isUndefined(currentPlay)) return 0

    return pipe(
      currentPlay.agentSlot[props.round],
      map(({ id, rate }) => ({ agent: store.agents.get(id), rate })),
      filter(({ agent }) => !isUndefined(agent)),
      map(({ rate, agent }) => find((cost) => cost.rate === rate, agent!.cost)),
      filter(isObject),
      map(({ cost }) => cost),
      sum
    )
  }, [store, currentPlay, props.round])

  const onDialogClose = () => {
    setSelectAgentIndex(null)
    setSelectEngineIndex(null)
  }
  const onAgentSelectorClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    setSelectAgentIndex(Number(event.currentTarget.value))
  }
  const onEngineSelector = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    setSelectEngineIndex(Number(event.currentTarget.value))
  }

  return (
    <>
      <div className="max-w-lg mx-auto mt-4 flex flex-col gap-4 card rounded-3xl p-4 pb-8">
        <h2 className="text-2xl font-bold text-primary ft-ria flex items-end">
          <span>Party</span>
          <span className="ml-auto text-lg text-ink">{roundAgentCost + roundEngineCost} Co.</span>
        </h2>
        <ul className="flex gap-4 w-full">
          {pipe(
            roundData,
            map(({ agent, index, engine }) => (
              <li className="flex-1" key={index}>
                <p
                  className={pipe(
                    ['ft-ria', 'text-lg', 'text-center', 'tabular-nums'],
                    concat(isNumber(agent.id) ? ['opacity-100'] : ['opacity-0']),
                    join(' ')
                  )}
                >
                  <span className="text-xs">M.</span>
                  <span className="text-primary">{agent.rate}</span>
                  <span className="mx-1">/</span>
                  <span className="text-xs">W.</span>
                  <span className="text-primary">{isString(engine.id) ? engine.rate : 0}</span>
                </p>
                <div className="relative w-full aspect-square">
                  <AgentButton
                    onClick={onAgentSelectorClick}
                    value={index}
                    agent={store.agents.get(agent.id || -1)}
                  />
                  <EngineButton
                    onClick={onEngineSelector}
                    value={index}
                    engine={store.engines.get(engine.id || '')}
                  />
                </div>
              </li>
            )),
            toArray
          )}
        </ul>
      </div>
      <AgentDialog
        role={props.role}
        disabledList={pipe(selectBan, concat(selectAgent), filter(isNumber), toArray)}
        onClose={onDialogClose}
        index={selectAgentIndex}
        round={props.round}
      />
      <EngineDialog
        role={props.role}
        index={selectEngineindex}
        round={props.round}
        disabledList={[]}
        onClose={onDialogClose}
      />
    </>
  )
}

export default AgentSelector
