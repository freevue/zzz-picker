import AgentButton from './AgentButton'
import PickButton from './PickButton'
import Score from './Score'
import Time from './Time'
import { usePlay } from '@/hooks'
import { join, pipe, map, toArray, zipWithIndex, concat, isNull } from '@fxts/core'
import type { RoundId, Side } from '@zzz-picker/constant'
import { useMemo } from 'react'

type Props = {
  side: Side
  roundId: RoundId
}

const Pick: React.FC<Props> = (props) => {
  const { state } = usePlay()
  const pickList = useMemo(() => {
    return state[props.roundId][props.side].pickList
  }, [state[props.roundId][props.side].pickList, props.roundId, props.side])

  return (
    <div className="flex-1">
      <div
        className={pipe(
          ['w-full flex flex-col', 'gap-4'],
          concat([props.side === 'A' ? 'items-start' : 'items-end']),
          join(' ')
        )}
      >
        <Time roundId={props.roundId} side={props.side} />
        <ul className="flex w-full">
          {pipe(
            pickList,
            zipWithIndex,
            map(([index, pick]) => (
              <li
                key={index}
                className={pipe(['flex-1', 'aspect-square', 'group/list'], concat([]), join(' '))}
              >
                {isNull(pick) ? (
                  <PickButton roundId={props.roundId} index={index} side={props.side} />
                ) : (
                  <AgentButton
                    agentId={pick}
                    roundId={props.roundId}
                    index={index}
                    side={props.side}
                  />
                )}
              </li>
            )),
            toArray
          )}
        </ul>
        <Score roundId={props.roundId} side={props.side} />
      </div>
    </div>
  )
}

export default Pick
