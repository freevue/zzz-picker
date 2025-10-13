import Agent from './Agent'
import RecordDialog from './RecordDialog'
import type { SelectAgent, Side } from '@/types'
import { join, pipe, map, toArray, zipWithIndex, concat } from '@fxts/core'
import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

type PickState = {
  id: SelectAgent
  rate: number
  engineRate: number
}
type Props = {
  side: Side
}

const DEFAULT_PICK_STATE = {
  id: null,
  rate: 0,
  engineRate: 0,
}
const DEFAULT_PICK_LIST = new Map<number, PickState>([
  [0, DEFAULT_PICK_STATE],
  [1, DEFAULT_PICK_STATE],
  [2, DEFAULT_PICK_STATE],
])

const Pick: React.FC<Props> = (props) => {
  const [pickList, setPickList] = useState<Map<number, PickState>>(DEFAULT_PICK_LIST)
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false)
  const skew = useMemo(() => {
    if (props.side === 'A') return 'skew-x-12'
    if (props.side === 'B') return '-skew-x-12'
  }, [props.side])
  const onAgentSelected = (index: number) => (agent: SelectAgent) => {
    // setAgentList((prev) => {
    //   const newList = [...prev]
    //   newList[index] = agent
    //   return newList as [SelectAgent, SelectAgent, SelectAgent]
    // })
  }

  return (
    <>
      <div className="p-4">
        <ul className="flex">
          {pipe(
            [1401, 1461, 1031],
            zipWithIndex,
            map(([index, agent]) => (
              <li
                key={index}
                className={pipe(
                  [
                    'border-2',
                    'w-28',
                    'h-32',
                    'overflow-hidden',
                    'border-text-primary',
                    'border-r-0',
                    'last:border-r-2',
                  ],
                  concat([skew]),
                  join(' ')
                )}
              >
                <Agent id={agent} side={props.side} onAgentSelected={onAgentSelected(index)} />
              </li>
            )),
            toArray
          )}
        </ul>
      </div>
      {isRecordDialogOpen &&
        createPortal(
          <RecordDialog onClose={() => setIsRecordDialogOpen(false)} onSubmit={() => {}} />,
          document.body
        )}
    </>
  )
}

export default Pick
