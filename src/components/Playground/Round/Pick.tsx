import Agent from './Agent'
import RecordDialog from './RecordDialog'
import { usePlay } from '@/hooks'
import type { SelectAgent, Side, RoundSelectAgentState, AgentCostSetting } from '@/types'
import { join, pipe, map, toArray, zipWithIndex, concat } from '@fxts/core'
import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  side: Side
  round: string
  pickList: {
    [key in Side]: [RoundSelectAgentState, RoundSelectAgentState, RoundSelectAgentState]
  }
}

const Pick: React.FC<Props> = (props) => {
  const { onSelect, onSetting } = usePlay()
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false)
  const skew = useMemo(() => {
    if (props.side === 'A') return 'skew-x-12'
    if (props.side === 'B') return '-skew-x-12'
  }, [props.side])
  const pickList = useMemo(() => {
    return props.pickList?.[props.side] || []
  }, [props.pickList, props.side])
  const onAgentSelected = (index: number) => (agent: SelectAgent) => {
    onSelect(props.round, props.side, index, agent)
  }
  const onSettingChange = (index: number) => (setting: AgentCostSetting) => {
    onSetting(props.round, props.side, index, setting)
  }

  return (
    <>
      <div className="p-4">
        <ul className="flex">
          {pipe(
            pickList,
            zipWithIndex,
            map(([index, { id, setting }]) => (
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
                <Agent
                  id={id}
                  side={props.side}
                  setting={setting}
                  onAgentSelected={onAgentSelected(index)}
                  onSetting={onSettingChange(index)}
                />
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
