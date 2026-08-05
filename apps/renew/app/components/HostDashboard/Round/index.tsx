import CardTitle from '../CardTitle'
import AgentList from './AgentList'
import BossButton from './BossButton'
import Score from './Score'
import Timer from './Timer'
import { filter, find, isObject, isUndefined, join, map, pipe, sum } from '@fxts/core'
import { useMemo } from 'react'
import { Phase, Role } from '~/constant'
import { useMatch, useStore } from '~/hooks'

type Props = {
  round: number
}

const Round: React.FC<Props> = (props) => {
  const { play, match } = useMatch()
  const store = useStore()
  const roundCost = useMemo(() => {
    return {
      [Role.A_SIDE]: {
        agentCost: pipe(
          play[Role.A_SIDE].agentSlot[props.round],
          map(({ id, rate }) => ({ agent: store.agents.get(id), rate })),
          filter(({ agent }) => !isUndefined(agent)),
          map(({ rate, agent }) => find((cost) => cost.rate === rate, agent!.cost)),
          filter(isObject),
          map(({ cost }) => cost),
          sum
        ),
        engineCost: pipe(
          play[Role.A_SIDE].engineSlot[props.round],
          map(({ id, rate }) => ({ engine: store.engines.get(id), rate })),
          filter(({ engine }) => !isUndefined(engine)),
          map(({ rate, engine }) => find((cost) => cost.rate === rate, engine!.cost)),
          filter(isObject),
          map(({ cost }) => cost),
          sum
        ),
      },
      [Role.B_SIDE]: {
        agentCost: pipe(
          play[Role.B_SIDE].agentSlot[props.round],
          map(({ id, rate }) => ({ agent: store.agents.get(id), rate })),
          filter(({ agent }) => !isUndefined(agent)),
          map(({ rate, agent }) => find((cost) => cost.rate === rate, agent!.cost)),
          filter(isObject),
          map(({ cost }) => cost),
          sum
        ),
        engineCost: pipe(
          play[Role.B_SIDE].engineSlot[props.round],
          map(({ id, rate }) => ({ engine: store.engines.get(id), rate })),
          filter(({ engine }) => !isUndefined(engine)),
          map(({ rate, engine }) => find((cost) => cost.rate === rate, engine!.cost)),
          filter(isObject),
          map(({ cost }) => cost),
          sum
        ),
      },
    }
  }, [play, props.round, store])

  return (
    <div
      className={pipe(
        [
          'card',
          'p-4',
          'w-full',
          'rounded-3xl',
          'relative',
          'flex-1',
          'flex',
          'flex-col',
          'justify-around',
        ],
        join(' ')
      )}
    >
      <CardTitle className="text-center" active={match.phase === Phase.PICK}>
        {props.round + 1} Round
      </CardTitle>
      <div className="flex justify-between">
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-start gap-4">
            <div className="flex gap-2">
              <Timer round={props.round} role={Role.A_SIDE} id={match.matchId} />
              <Score round={props.round} role={Role.A_SIDE} id={match.matchId} />
            </div>
            <div className="flex-1 flex gap-4 items-start">
              <AgentList
                list={play[Role.A_SIDE].agentSlot[props.round]}
                engines={play[Role.A_SIDE].engineSlot[props.round]}
                role={Role.A_SIDE}
              />
              <div className="mt-auto ml-4">
                <BossButton bossId={play[Role.A_SIDE].boss[props.round]} />
                <p className="ft-pre text-lg mt-4 text-center">
                  <span className="ft-ria text-2xl text-primary">
                    {roundCost[Role.A_SIDE].agentCost + roundCost[Role.A_SIDE].engineCost}
                  </span>
                  <span className="ml-1 font-bold">Co</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-8 flex-row-reverse">
          <div className="flex flex-col items-end gap-4">
            <div className="flex gap-2">
              <Score round={props.round} role={Role.B_SIDE} id={match.matchId} />
              <Timer round={props.round} role={Role.B_SIDE} id={match.matchId} />
            </div>
            <div className="flex-1 flex gap-4 items-start flex-row-reverse">
              <AgentList
                list={play[Role.B_SIDE].agentSlot[props.round]}
                engines={play[Role.B_SIDE].engineSlot[props.round]}
                role={Role.B_SIDE}
              />
              <div className="mt-auto mr-4">
                <BossButton bossId={play[Role.B_SIDE].boss[props.round]} />
                <p className="ft-pre text-lg mt-4 text-center">
                  <span className="ft-ria text-2xl text-primary">
                    {roundCost[Role.B_SIDE].agentCost + roundCost[Role.B_SIDE].engineCost}
                  </span>
                  <span className="ml-1 font-bold">Co</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Round
