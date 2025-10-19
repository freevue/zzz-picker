import AgentButton from './AgentButton'
import PickButton from './PickButton'
import Score from './Score'
import Time from './Time'
import type { Side } from '@/types'
import { join, pipe, map, toArray, zipWithIndex, concat } from '@fxts/core'
import type { TypeRound } from '@zzz-picker/provider'
import { useMemo } from 'react'

type Props = {
  side: Side
  round: TypeRound
  roundId: number
}

const Pick: React.FC<Props> = (props) => {
  const pickList = useMemo(() => {
    return props.round[props.side].pickList
  }, [props])

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
              <li key={index} className={pipe(['size-30', 'group/list'], concat([]), join(' '))}>
                {pick.agent ? (
                  <AgentButton roundId={props.roundId} index={index} side={props.side} {...pick} />
                ) : (
                  <PickButton roundId={props.roundId} index={index} side={props.side} />
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
