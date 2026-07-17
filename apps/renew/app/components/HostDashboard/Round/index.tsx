import CardTitle from '../CardTitle'
import Pulse from '../Pulse'
import AgentList from './AgentList'
import BossButton from './BossButton'
import Score from './Score'
import Timer from './Timer'
import { join, pipe } from '@fxts/core'
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

  return (
    <div
      className={pipe(['card', 'p-4', 'w-full', 'rounded-3xl', 'relative', 'flex-1'], join(' '))}
    >
      {matchState.phase === Phase.PICK && <Pulse />}
      <CardTitle className="text-center">{props.round + 1} Round</CardTitle>
      <div className="flex justify-between mt-10">
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-start gap-4">
            <Timer />
            <div className="flex-1 flex gap-4 items-end">
              <AgentList
                list={roundData[Role.A_SIDE].agent}
                engines={roundData[Role.A_SIDE].engine}
              />
              <BossButton boss={roundData[Role.A_SIDE].boss} />
            </div>
            <Score className="ml-auto mr-24" />
          </div>
          <p className="ft-ria text-2xl">10</p>
        </div>
        <div className="flex items-center gap-8 flex-row-reverse">
          <div className="flex flex-col items-end gap-4">
            <Timer />
            <div className="flex-1 flex gap-4 items-end flex-row-reverse">
              <AgentList
                list={roundData[Role.B_SIDE].agent}
                engines={roundData[Role.B_SIDE].engine}
              />
              <BossButton boss={roundData[Role.B_SIDE].boss} />
            </div>
            <Score className="mr-auto ml-24" />
          </div>
          <p className="ft-ria text-2xl">10</p>
        </div>
      </div>
    </div>
  )
}

export default Round
