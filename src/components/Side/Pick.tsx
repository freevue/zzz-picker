import type { Side } from '.'
import Drop from './Drop'
import RecordDialog from './RecordDialog'
import { useScore } from '@/hooks'
import { pipe, join, concat, map, toArray, zipWithIndex, findIndex } from '@fxts/core'
import { useState } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  side: Side
  round: string
}

type AgentID = number | null

const Pick: React.FC<Props> = (props) => {
  const { score } = useScore()
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false)
  const [agentList, setAgentList] = useState<[AgentID, AgentID, AgentID]>([null, null, null])
  const { setScore } = useScore()

  const onClose = () => {
    setIsRecordDialogOpen(false)
  }
  const onSubmit = (score: number, time: string) => {
    setScore(props.round, props.side, { score, time })
    setIsRecordDialogOpen(false)
  }
  const onChange = (id: AgentID, index: number) => {
    setAgentList((prev) => {
      const findAgentIndex = pipe(
        prev,
        findIndex((agentId) => agentId === id)
      )
      const newList: [AgentID, AgentID, AgentID] = [...prev]

      if (findAgentIndex !== -1) {
        newList[findAgentIndex] = null
      }

      newList[index] = id

      return newList
    })
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
            agentList,
            zipWithIndex,
            map(([index, agentId]) => (
              <Drop
                key={index}
                {...props}
                index={index}
                defaultValue={agentId}
                onChange={onChange}
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
