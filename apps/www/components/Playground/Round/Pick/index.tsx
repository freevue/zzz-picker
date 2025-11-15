import CostDialog from '../CostDialog'
import { join, pipe, toArray, concat, when, findIndex, filter, isNumber } from '@fxts/core'
import { Form, Dialog } from '@zzz-picker/components/v2'
import {
  DEFAULT,
  type SelectAgent,
  type RoundId,
  type Side,
  type AgentId,
} from '@zzz-picker/constant'
import { usePlay, useSetting, useCostList } from '@zzz-picker/provider/hooks'
import { useMemo, useState } from 'react'

type Props = {
  side: Side
  roundId: RoundId
}

const Pick: React.FC<Props> = (props) => {
  const { state: settingState } = useSetting()
  const { state, setState } = usePlay()
  const [selectedAgentId, setSelectedAgentId] = useState<SelectAgent>(null)
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
  const costList = useCostList(props.side, pickList)

  const onClick = (agentId: AgentId) => {
    setSelectedAgentId(agentId)
  }
  const onPickChange = (pickList: SelectAgent[]) => {
    setState((prev) =>
      pipe(
        { ...prev[props.roundId] },
        (roundData) => ({
          ...roundData,
          [props.side]: { ...prev[props.roundId][props.side], pickList },
        }),
        (roundData) => ({ ...prev, [props.roundId]: roundData })
      )
    )
  }
  const onTimeChange = (time: number) => {
    setState((prev) =>
      pipe(
        { ...prev[props.roundId] },
        (roundData) => ({
          ...roundData,
          [props.side]: { ...prev[props.roundId][props.side], time },
        }),
        (roundData) => ({ ...prev, [props.roundId]: roundData })
      )
    )
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
      (result) => {
        setState((prev) =>
          pipe(
            { ...prev[props.roundId] },
            (roundData) => ({
              ...roundData,
              [props.side]: { ...prev[props.roundId][props.side], result },
            }),
            (roundData) => ({ ...prev, [props.roundId]: roundData })
          )
        )
      }
    )
  }

  return (
    <>
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
          <Form.Party
            size="md"
            reverse={props.side === 'B'}
            value={pickList}
            cost={costList}
            allowAgents={settingState.allowAgent}
            banAgents={pipe(state.banList, filter(isNumber), toArray)}
            deleteable
            onChange={onPickChange}
            onClick={onClick}
          />
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
              concat(
                props.side === 'A' ? ['rounded-bl-2xl', 'ml-auto', '[&_input]:text-right'] : []
              ),
              concat(
                props.side === 'B' ? ['rounded-br-2xl', 'mr-auto', '[&_input]:text-left'] : []
              ),
              join(' ')
            )}
          />
        </div>
      </div>
      <Dialog isOpen={!!selectedAgentId} onClose={() => setSelectedAgentId(null)}>
        <CostDialog
          roundId={props.roundId}
          side={props.side}
          agentId={Number(selectedAgentId)}
          totalCost={pipe(
            pickList,
            findIndex((id) => id === selectedAgentId),
            (index) => costList[index] || 0
          )}
        />
      </Dialog>
    </>
  )
}

export default Pick
