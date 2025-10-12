import AgentDialog from './AgentDialog'
import { Plus } from '@/Icons'
import type { SelectAgent, Side } from '@/types'
import { getAgentSquareImage } from '@/utils'
import { join, concat, pipe } from '@fxts/core'
import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  id: SelectAgent
  side: Side
  onAgentSelected: (agent: SelectAgent) => void
}

const Agent: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false)
  const skew = useMemo(() => {
    if (props.side === 'A') return '-skew-x-12'
    if (props.side === 'B') return 'skew-x-12'
  }, [props.side])

  const onAgentClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    props.onAgentSelected(Number(event.currentTarget.value))
    setIsOpen(false)
  }

  return (
    <>
      <div className={pipe(['w-full', 'h-full', 'overflow-hidden'], concat([skew]), join(' '))}>
        {props.id ? (
          <div className={`scale-110 flex items-start justify-center`}>
            <img src={getAgentSquareImage(props.id)} className="block w-full" alt="" />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="w-full h-full flex items-center justify-center cursor-pointer group"
          >
            <Plus className="size-14 stroke-text-primary group-hover:stroke-secondary" />
          </button>
        )}
      </div>
      {isOpen &&
        createPortal(
          <AgentDialog onClose={() => setIsOpen(false)} onClick={onAgentClick} />,
          document.body
        )}
    </>
  )
}

export default Agent
