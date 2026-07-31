import AgentButton from './AgentButton'
import AgentDialog from './AgentDialog'
import EngineButton from './EngineButton'
import EngineDialog from './EngineDialog'
import {
  concat,
  entries,
  filter,
  flat,
  flatMap,
  isNumber,
  isString,
  isUndefined,
  map,
  pipe,
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
      <div className="max-w-lg mx-auto mt-4 flex gap-4">
        <ul className="flex gap-4 w-full">
          {pipe(
            roundData,
            map(({ agent, index, engine }) => (
              <li className="flex-1 relative" key={index}>
                <AgentButton
                  onClick={onAgentSelectorClick}
                  value={index}
                  agent={store.agents.get(agent.id || -1)}
                />
                {isNumber(agent.id) && (
                  <EngineButton
                    onClick={onEngineSelector}
                    value={index}
                    engine={store.engines.get(engine.id || '')}
                  />
                )}
                {isNumber(agent.id) && (
                  <p className="ft-ria text-lg">
                    {agent.rate}/{isString(engine.id) ? engine.rate : 0}
                  </p>
                )}
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
