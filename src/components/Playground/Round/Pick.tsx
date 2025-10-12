import Agent from './Agent'
import RecordDialog from './RecordDialog'
import type { SelectAgent, Side } from '@/types'
import { join, pipe, map, toArray, zipWithIndex, concat } from '@fxts/core'
import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  side: Side
}

const Pick: React.FC<Props> = (props) => {
  const [agentList, setAgentList] = useState<[SelectAgent, SelectAgent, SelectAgent]>([
    null,
    null,
    null,
  ])
  const skew = useMemo(() => {
    if (props.side === 'A') return 'skew-x-12'
    if (props.side === 'B') return '-skew-x-12'
  }, [props.side])
  const onAgentSelected = (index: number) => (agent: SelectAgent) => {
    setAgentList((prev) => {
      const newList = [...prev]

      newList[index] = agent

      return newList as [SelectAgent, SelectAgent, SelectAgent]
    })
  }

  return (
    <>
      <div className="p-4">
        <ul className="flex">
          {pipe(
            agentList,
            zipWithIndex,
            map(([index, agent]) => (
              <li
                key={index}
                className={pipe(
                  [
                    'border-2',
                    'size-28',
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
      {createPortal(<RecordDialog onClose={() => {}} onSubmit={() => {}} />, document.body)}
    </>
  )
}

export default Pick
