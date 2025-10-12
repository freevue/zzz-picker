import AgentCard from './AgentCard'
import RecordDialog from './RecordDialog'
import { useScore, usePick } from '@/hooks'
import type { Side, AgentPick, Pick as PickType } from '@/types'
import { pipe, join, concat, map, toArray, zipWithIndex, findIndex } from '@fxts/core'
import { useState } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  side: Side
  round: string
}

const Pick: React.FC<Props> = (props) => {
  const { score } = useScore()
  const { pickList, onPickChange } = usePick()
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false)
  const { setScore } = useScore()

  const onClose = () => {
    setIsRecordDialogOpen(false)
  }
  const onSubmit = (score: number, time: string) => {
    setScore(props.round, props.side, { score, time })
    setIsRecordDialogOpen(false)
  }
  const onChange = (index: number, pick: PickType) => {
    const currentAgentIndex = pipe(
      pickList[props.round][props.side],
      map(({ agent }) => agent),
      findIndex((agent) => agent === pick.agent)
    )

    pipe(
      [...pickList[props.round][props.side]] as AgentPick,
      (list) => {
        list[index] = pick

        if (currentAgentIndex === index) {
          return list
        }
        if (currentAgentIndex !== -1) {
          list[index] = { ...pickList[props.round][props.side][currentAgentIndex] }
          list[currentAgentIndex] = { agent: null, cost: 0 }

          return list
        }

        return list
      },
      (list) => {
        onPickChange(props.round, props.side, list)
      }
    )
  }
  const onCostChange = (index: number, cost: number) => {
    pipe(
      [...pickList[props.round][props.side]] as AgentPick,
      (list) => {
        list[index] = { ...list[index], cost }

        return list
      },
      (list) => {
        onPickChange(props.round, props.side, list)
      }
    )
  }
  const onEditClick = () => {
    setIsRecordDialogOpen(true)
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <div
          className={pipe(['flex'], concat(props.side === 'A' ? ['pl-4'] : ['pr-4']), join(' '))}
        >
          {pipe(
            pickList?.[props.round]?.[props.side] || [],
            zipWithIndex,
            map(([index, { agent, cost }]) => (
              <AgentCard
                key={index}
                index={index}
                id={agent}
                cost={cost}
                onChange={onChange}
                onCostChange={onCostChange}
                {...props}
              />
            )),
            toArray
          )}
        </div>
        <div
          className={pipe(
            ['flex', 'items-center', 'gap-3', 'justify-start'],
            concat(props.side === 'A' ? ['flex-row-reverse'] : []),
            join(' ')
          )}
        >
          <button
            className={pipe(
              [
                'text-md',
                'font-medium',
                'text-center',
                'dark:text-white/70',
                'flex',
                'gap-2',
                'cursor-pointer',
                'hover:text-primary',
              ],
              concat(props.side === 'A' ? ['text-right', 'flex-row-reverse'] : ['text-left']),
              join(' ')
            )}
            type="button"
            onClick={onEditClick}
          >
            <span>{score[props.round]?.[props.side]?.score} 점</span>
            <span>/</span>
            <span>{score[props.round]?.[props.side]?.time}</span>
          </button>
        </div>
      </div>
      {isRecordDialogOpen &&
        createPortal(<RecordDialog onClose={onClose} onSubmit={onSubmit} />, document.body)}
    </>
  )
}

export default Pick
