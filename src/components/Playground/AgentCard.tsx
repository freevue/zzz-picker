import AgentDialog from './AgentDialog'
import { Plus, Cross } from '@/Icons'
import { UI } from '@/components'
import { useSetting } from '@/hooks'
import type { Side, Pick } from '@/types'
import { getAgentSquareImage } from '@/utils'
import { pipe, join, concat } from '@fxts/core'
import { useState } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  side: Side
  index: number
  id: number | null
  cost: number
  onChange?: (index: number, pick: Pick) => void
  onCostChange?: (index: number, cost: number) => void
}

const AgentCard: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false)
  const { totalCost } = useSetting()

  const onDrop = (value: string) => {
    try {
      props.onChange?.(props.index, { agent: Number(value), cost: 0 })
    } catch {
      props.onChange?.(props.index, { agent: null, cost: 0 })
    }
  }
  const onDelete = () => {
    props.onChange?.(props.index, { agent: null, cost: 0 })
  }
  const onOpenAgentDialog = () => {
    setIsOpen(true)
  }
  const onAgentClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    props.onChange?.(props.index, { agent: Number(event.currentTarget.value), cost: 0 })
    setIsOpen(false)
  }
  const onCostChange = (cost: number) => {
    props.onCostChange?.(props.index, cost)
  }

  return (
    <>
      <UI.Drop
        onDrop={onDrop}
        className={pipe(
          [
            'w-24',
            'h-36',
            'border-2',
            'border-white',
            'border-r-0',
            'last:border-r-2',
            'overflow-hidden',
            'pb-10',
          ],
          concat(props.side === 'A' ? ['skew-x-12'] : ['-skew-x-12']),
          join(' ')
        )}
      >
        <div
          className={pipe(
            ['w-full', 'h-full', 'flex', 'items-center', 'justify-center'],
            concat(props.side === 'A' ? ['-skew-x-12'] : ['skew-x-12']),
            join(' ')
          )}
        >
          {props.id ? (
            <div className="w-full h-full group relative">
              <img
                draggable={false}
                src={getAgentSquareImage(props.id)}
                alt=""
                className="block w-full scale-125"
              />
              <button
                type="button"
                onClick={onDelete}
                className="absolute left-0 top-0 w-full h-full flex items-center justify-center cursor-pointer backdrop-blur-sm scale-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150"
              >
                <Cross className="block size-8 stroke-white" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="size-8 cursor-pointer focus:outline-none"
              onClick={onOpenAgentDialog}
            >
              <Plus className="block w-full stroke-white" />
            </button>
          )}
        </div>
        <div className="absolute bottom-0 left-0 w-full bg-base">
          <UI.Count min={0} max={totalCost} defaultValue={props.cost} onChange={onCostChange} />
        </div>
      </UI.Drop>
      {isOpen &&
        createPortal(
          <AgentDialog onClose={() => setIsOpen(false)} onClick={onAgentClick} />,
          document.body
        )}
    </>
  )
}

export default AgentCard
