import Pulse from '../Pulse'
import AgentList from './AgentList'
import BossButton from './BossButton'
import { concat, isUndefined, join, map, pipe, toArray, zipWithIndex } from '@fxts/core'
import { useMemo } from 'react'
import { Phase, Role } from '~/constant'
import { useMatchState, useStore } from '~/hooks'

type Props = {
  round: number
}

const Round: React.FC<Props> = (props) => {
  const matchState = useMatchState()
  const store = useStore()
  const roundData = useMemo(() => {
    return {
      [Role.A_SIDE]: {
        agent: matchState.state.agent[Role.A_SIDE][props.round],
        engine: matchState.state.engine[Role.A_SIDE][props.round],
        boss: store.deadlyAssault.get(matchState.state.boss[Role.A_SIDE][props.round] || ''),
      },
      [Role.B_SIDE]: {
        agent: matchState.state.agent[Role.B_SIDE][props.round],
        engine: matchState.state.engine[Role.B_SIDE][props.round],
        boss: store.deadlyAssault.get(matchState.state.boss[Role.B_SIDE][props.round] || ''),
      },
    }
  }, [matchState, props.round, store])

  console.log(roundData)

  return (
    <div className={pipe(['card', 'p-4', 'w-full', 'rounded-3xl', 'relative'], join(' '))}>
      {matchState.phase === Phase.PICK && <Pulse />}
      <h3 className="ft-ria text-primary text-6xl">{props.round + 1} Round</h3>
      <div className="flex gap-4">
        <div className="flex-1 flex gap-4 items-center">
          <AgentList list={roundData[Role.A_SIDE].agent} />
          <BossButton boss={roundData[Role.A_SIDE].boss} />
        </div>
        <div className="flex-1 flex gap-4 items-center flex-row-reverse">
          <AgentList list={roundData[Role.B_SIDE].agent} />
          <BossButton boss={roundData[Role.B_SIDE].boss} />
        </div>
      </div>
    </div>
  )
}

export default Round
