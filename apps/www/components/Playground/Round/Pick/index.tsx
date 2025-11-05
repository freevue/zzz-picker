// import AgentButton from './AgentButton'
import PickButton from './PickButton'
import Score from './Score'
import Time from './Time'
import { usePlay } from '@/hooks'
import { join, pipe, map, toArray, zipWithIndex, concat, isNull } from '@fxts/core'
import { Form } from '@zzz-picker/components/v2'
import type { SelectAgent, RoundId, Side } from '@zzz-picker/constant'
import { useMemo } from 'react'

type Props = {
  side: Side
  roundId: RoundId
}

const Pick: React.FC<Props> = (props) => {
  const { state, setState } = usePlay()
  const pickList = useMemo(
    () => state[props.roundId][props.side].pickList,
    [state[props.roundId][props.side].pickList, props.roundId, props.side]
  )

  const onChange = (value: SelectAgent[]) => {
    setState((prev) => {
      const roundData = { ...prev[props.roundId] }

      roundData[props.side].pickList = value as [SelectAgent, SelectAgent, SelectAgent]

      return {
        ...prev,
        [props.roundId]: roundData,
      }
    })
  }

  return (
    <div className="flex-1">
      <div
        className={pipe(
          ['w-full flex flex-col', 'gap-4'],
          concat([props.side === 'A' ? 'items-start' : 'items-end']),
          join(' ')
        )}
      >
        <Form.Time
          value={0}
          onChange={() => {}}
          className={pipe(
            ['w-56', 'h-14', 'bg-content'],
            concat(props.side === 'A' ? ['rounded-tr-2xl'] : []),
            concat(props.side === 'B' ? ['rounded-tl-2xl'] : []),
            join(' ')
          )}
        />
        <Form.Party value={pickList} onChange={onChange} />
        <Score roundId={props.roundId} side={props.side} />
      </div>
    </div>
  )
}

export default Pick
