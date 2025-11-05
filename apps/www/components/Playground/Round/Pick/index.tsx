import { usePlay, useSetting } from '@/hooks'
import { join, pipe, map, toArray, concat, when } from '@fxts/core'
import { Form } from '@zzz-picker/components/v2'
import { DEFAULT, type SelectAgent, type RoundId, type Side } from '@zzz-picker/constant'
import { getAgentTotalCost } from '@zzz-picker/utils'
import { useMemo } from 'react'

type Props = {
  side: Side
  roundId: RoundId
}

const Pick: React.FC<Props> = (props) => {
  const { costTable } = useSetting()
  const { state, cost, setState } = usePlay()
  const pickList = useMemo(
    () => state[props.roundId][props.side].pickList,
    [state[props.roundId][props.side].pickList]
  )
  const time = useMemo(
    () => state[props.roundId][props.side].time,
    [state, props.roundId, props.side]
  )
  const score = useMemo(
    () => state[props.roundId][props.side].result,
    [state, props.roundId, props.side]
  )
  const costList = useMemo(() => {
    return pipe(
      pickList,
      map((agentId) => agentId && cost[props.side].get(agentId)),
      map((costSetting) => (costSetting ? getAgentTotalCost(costTable, costSetting) : 0)),
      toArray
    )
  }, [pickList, cost, costTable])

  const onChange = (value: SelectAgent[]) => {
    setState((prev) => {
      const roundData = { ...prev[props.roundId] }

      roundData[props.side].pickList = value as [SelectAgent, SelectAgent, SelectAgent]

      return { ...prev, [props.roundId]: roundData }
    })
  }
  const onTimeChange = (value: number) => {
    setState((prev) => {
      const roundData = { ...prev[props.roundId] }

      roundData[props.side].time = value

      return { ...prev, [props.roundId]: roundData }
    })
  }
  const onScoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    pipe(
      Number(event.target.value),
      when(
        (value) => value > DEFAULT.MAX_SCORE,
        () => DEFAULT.MAX_SCORE
      ),
      when(
        (value) => value < 0,
        () => 0
      ),
      (value) => {
        setState((prev) => {
          const roundData = { ...prev[props.roundId] }

          roundData[props.side].result = value

          return { ...prev, [props.roundId]: roundData }
        })
      }
    )
  }

  return (
    <div className="w-[336px]">
      <div
        className={pipe(
          ['w-full flex flex-col', 'gap-4'],
          concat([props.side === 'A' ? 'items-start' : 'items-end']),
          join(' ')
        )}
      >
        <Form.Time
          value={time}
          onChange={onTimeChange}
          className={pipe(
            ['w-56', 'h-14', 'bg-content'],
            concat(props.side === 'A' ? ['rounded-tr-2xl'] : []),
            concat(props.side === 'B' ? ['rounded-tl-2xl'] : []),
            join(' ')
          )}
        />
        <Form.Party size="md" value={pickList} cost={costList} deleteable onChange={onChange} />
        <Form.Input
          name={`${props.roundId}-${props.side}-score`}
          value={`${score}`}
          max={DEFAULT.MAX_SCORE}
          min={0}
          step={1}
          type="number"
          onChange={onScoreChange}
          className={pipe(
            ['w-56', 'h-14', 'bg-content', '[&_input]:text-3xl', '[&_input]:font-black'],
            concat(props.side === 'A' ? ['rounded-bl-2xl', 'ml-auto', '[&_input]:text-right'] : []),
            concat(props.side === 'B' ? ['rounded-br-2xl', 'mr-auto', '[&_input]:text-left'] : []),
            join(' ')
          )}
        />
      </div>
    </div>
  )
}

export default Pick
