import AgentSeleteDialog from './AgentSeleteDialog'
import AgentSettingDialog from './AgentSettingDialog'
import { Plus, Cross } from '@/Icons'
import type { SelectAgent, Side } from '@/types'
import { getAgentSquareImage } from '@/utils'
import { join, concat, pipe, isNumber } from '@fxts/core'
import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  id: SelectAgent
  side: Side
  onAgentSelected: (agent: SelectAgent) => void
}

const Agent: React.FC<Props> = (props) => {
  const [isSelectDialogOpen, setIsSelectDialogOpen] = useState(false)
  const [isAgentSettingDialogOpen, setIsAgentSettingDialogOpen] = useState(false)
  const skew = useMemo(() => {
    if (props.side === 'A') return '-skew-x-12'
    if (props.side === 'B') return 'skew-x-12'
  }, [props.side])

  const onAgentClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    props.onAgentSelected(Number(event.currentTarget.value))
    setIsSelectDialogOpen(false)
  }
  const onCostClick = (event: React.MouseEvent<HTMLParagraphElement>) => {
    event.preventDefault()

    setIsAgentSettingDialogOpen(true)
  }

  return (
    <>
      {props.id && (
        <div
          className={pipe(
            [
              'absolute',
              'left-0',
              'top-0',
              'w-full',
              'z-10',
              'flex',
              'items-center',
              'justify-between',
            ],
            concat(props.side === 'A' ? ['flex-row'] : ['flex-row-reverse']),
            join(' ')
          )}
        >
          <p
            onClick={onCostClick}
            className="bg-bg-content/70 text-xl font-bold text-text-primary h-8 min-w-8 text-center cursor-pointer"
          >
            71
          </p>
          <button className="size-8 group flex cursor-pointer bg-bg-content/70">
            <Cross className="stroke-text-primary group-hover:stroke-secondary w-full h-full" />
          </button>
        </div>
      )}
      <div
        className={pipe(
          ['w-full', 'h-full', 'overflow-hidden', 'relative'],
          concat([skew]),
          join(' ')
        )}
      >
        {props.id ? (
          <>
            <button
              type="button"
              onClick={() => setIsAgentSettingDialogOpen(true)}
              className="w-full h-full flex items-center justify-center cursor-pointer group"
            >
              <div className={`scale-110 flex items-start justify-center`}>
                <img src={getAgentSquareImage(props.id)} className="block w-full" alt="" />
              </div>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setIsSelectDialogOpen(true)}
            className="w-full h-full flex items-center justify-center cursor-pointer group"
          >
            <Plus className="size-14 stroke-text-primary group-hover:stroke-secondary" />
          </button>
        )}
      </div>
      {isSelectDialogOpen &&
        createPortal(
          <AgentSeleteDialog onClose={() => setIsSelectDialogOpen(false)} onClick={onAgentClick} />,
          document.body
        )}
      {isAgentSettingDialogOpen &&
        isNumber(props.id) &&
        createPortal(
          <AgentSettingDialog id={props.id} onClose={() => setIsAgentSettingDialogOpen(false)} />,
          document.body
        )}
    </>
  )
}

export default Agent
