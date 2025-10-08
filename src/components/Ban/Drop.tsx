import { Plus, Cross } from '@/Icons'
import { AgentDialog } from '@/components'
import { getAgentSquareImage } from '@/utils'
import { pipe, join } from '@fxts/core'
import { useState } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  index: number
  defaultValue?: number | null
  onChange?: (id: number | null, index: number) => void
}

const Drop: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false)

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()

    const agentId = event.dataTransfer.getData('text/plain')

    try {
      props.onChange?.(Number(agentId), props.index)
    } catch {
      props.onChange?.(null, props.index)
    }
  }
  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }
  const onDelete = () => {
    props.onChange?.(null, props.index)
  }
  const onOpenAgentDialog = () => {
    setIsOpen(true)
  }
  const onChange = (id: number) => {
    props.onChange?.(id, props.index)
    setIsOpen(false)
  }

  return (
    <>
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        draggable={false}
        className={pipe(
          [
            'size-32',
            'border-2',
            'border-white',
            'border-r-0',
            'last:border-r-2',
            'overflow-hidden',
          ],
          join(' ')
        )}
      >
        <div
          className={pipe(
            ['w-full', 'h-full', 'flex', 'items-center', 'justify-center'],
            join(' ')
          )}
        >
          {props.defaultValue ? (
            <div className="w-full h-full group relative">
              <img
                draggable={false}
                src={getAgentSquareImage(props.defaultValue)}
                alt=""
                className="block w-full"
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
      </div>
      {isOpen &&
        createPortal(
          <AgentDialog onClose={() => setIsOpen(false)} onChange={onChange} />,
          document.body
        )}
    </>
  )
}

export default Drop
