import AgentButton from './AgentButton'
import AgentDialog from './AgentDialog'
import EngineButton from './EngineButton'
import EngineDialog from './EngineDialog'
import { concat, filter, isNumber, map, pipe, toArray, zipWithIndex } from '@fxts/core'
import { useMemo, useState } from 'react'
import { Role } from '~/constant'
import { useMatchState, useStore } from '~/hooks'

type Props = {
  round: number
}

const AgentSelector: React.FC<Props> = (props) => {
  const matchState = useMatchState()
  const store = useStore()
  const [selectAgentIndex, setSelectAgentIndex] = useState<number | null>(null)
  const [selectEngineindex, setSelectEngineIndex] = useState<number | null>(null)
  const roundData = useMemo(() => {
    const engineList = matchState.pick.engine[props.round]

    return pipe(
      matchState.pick.agent[props.round],
      zipWithIndex,
      map(([index, agentId]) => ({ index, agentId, engineId: engineList[index] })),
      toArray
    )
  }, [matchState, props.round])

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
            map(({ agentId, index, engineId }) => (
              <li className="flex-1 relative" key={index}>
                <AgentButton
                  onClick={onAgentSelectorClick}
                  value={index}
                  agent={store.agents.get(agentId || -1)}
                />
                {isNumber(agentId) && (
                  <EngineButton
                    onClick={onEngineSelector}
                    value={index}
                    engine={store.engines.get(engineId || '')}
                  />
                )}
              </li>
            )),
            toArray
          )}
        </ul>
      </div>
      <AgentDialog
        disabledList={pipe(
          matchState.state.selectBan[Role.A_SIDE],
          concat(matchState.state.selectBan[Role.B_SIDE]),
          concat(matchState.state.agent[Role.A_SIDE][0]),
          concat(matchState.state.agent[Role.B_SIDE][1]),
          filter(isNumber),
          toArray
        )}
        onClose={onDialogClose}
        index={selectAgentIndex}
        round={props.round}
      />
      <EngineDialog
        index={selectEngineindex}
        round={props.round}
        disabledList={[]}
        onClose={onDialogClose}
      />
    </>
  )
}

export default AgentSelector
