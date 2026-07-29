import CardTitle from '../CardTitle'
import Pulse from '../Pulse'
import AgentList from './AgentList'
import BossButton from './BossButton'
import Score from './Score'
import Timer from './Timer'
import {
  filter,
  flatMap,
  isNumber,
  isObject,
  isUndefined,
  isString,
  join,
  map,
  pipe,
  sum,
  toArray,
} from '@fxts/core'
import { useMemo } from 'react'
import { Phase, Role } from '~/constant'
import { useMatchState, useStore } from '~/hooks'
import { agentCost, engineCost } from '~/lib/utils'

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
        agentCost: pipe(
          matchState.state.agent[Role.A_SIDE][props.round],
          filter(isNumber),
          map((agentId) => store.agents.get(agentId!)),
          filter(isObject),
          toArray,
          agentCost(matchState.state.rate[Role.A_SIDE].agents)
        ),
        engineCost: pipe(
          matchState.state.engine[Role.A_SIDE][props.round],
          filter(isString),
          map((engineId) => store.engines.get(engineId!)),
          filter(isObject),
          toArray,
          engineCost(matchState.state.rate[Role.A_SIDE].engines)
        ),
      },
      [Role.B_SIDE]: {
        agent: matchState.state.agent[Role.B_SIDE][props.round],
        engine: matchState.state.engine[Role.B_SIDE][props.round],
        boss: store.deadlyAssault.get(matchState.state.boss[Role.B_SIDE][props.round] || ''),
        agentCost: pipe(
          matchState.state.agent[Role.B_SIDE][props.round],
          filter(isNumber),
          map((agentId) => store.agents.get(agentId!)),
          filter(isObject),
          toArray,
          agentCost(matchState.state.rate[Role.B_SIDE].agents)
        ),
        engineCost: pipe(
          matchState.state.engine[Role.B_SIDE][props.round],
          filter(isString),
          map((engineId) => store.engines.get(engineId!)),
          filter(isObject),
          toArray,
          engineCost(matchState.state.rate[Role.B_SIDE].engines)
        ),
      },
    }
  }, [matchState, props.round, store])

  return (
    <div className={pipe(['card', 'p-4', 'w-full', 'rounded-3xl', 'relative'], join(' '))}>
      <CardTitle className="text-center" active={matchState.phase === Phase.PICK}>
        {props.round + 1} Round
      </CardTitle>
      <div className="flex justify-between mt-10">
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-start gap-4">
            <Timer />
            <div className="flex-1 flex gap-4 items-start">
              <AgentList
                list={roundData[Role.A_SIDE].agent}
                engines={roundData[Role.A_SIDE].engine}
                role={Role.A_SIDE}
              />
              <BossButton boss={roundData[Role.A_SIDE].boss} />
            </div>
            <Score className="ml-auto mr-24" />
          </div>
          <p className="ft-ria text-2xl">
            {roundData[Role.A_SIDE].agentCost + roundData[Role.A_SIDE].engineCost}
          </p>
        </div>
        <div className="flex items-center gap-8 flex-row-reverse">
          <div className="flex flex-col items-end gap-4">
            <Timer />
            <div className="flex-1 flex gap-4 items-start flex-row-reverse">
              <AgentList
                list={roundData[Role.B_SIDE].agent}
                engines={roundData[Role.B_SIDE].engine}
                role={Role.B_SIDE}
              />
              <BossButton boss={roundData[Role.B_SIDE].boss} />
            </div>
            <Score className="mr-auto ml-24" />
          </div>
          <p className="ft-ria text-2xl">
            {roundData[Role.B_SIDE].agentCost + roundData[Role.B_SIDE].engineCost}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Round
