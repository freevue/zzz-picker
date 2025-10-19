import AgentDialog from '../AgentDialog'
import { Plus } from '@/Icons'
import { usePlay } from '@/hooks'
import type { Side } from '@/types'
import { concat, join, pipe } from '@fxts/core'
import { Button, Dialog } from '@zzz-picker/components'
import { useState } from 'react'

type Props = {
  side: Side
  index: number
  roundId: number
}

const PickButton: React.FC<Props> = (props) => {
  const { setRoundPick } = usePlay()
  const [isOpen, setIsOpen] = useState(false)

  const onAgentClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    setIsOpen(false)
    setRoundPick(props.roundId, props.side, props.index, Number(event.currentTarget.value))
  }

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        className={pipe(
          [
            'w-full',
            'h-full',
            'flex',
            'border-2',
            'border-gray-50',
            'items-center',
            'justify-center',
            'group/button',
            'border-r-1',
            'border-l-1',
            'group-first/list:border-l-2',
            'group-last/list:border-r-2',
          ],
          concat(
            props.side === 'A'
              ? ['group-first/list:rounded-bl-2xl', 'group-last/list:rounded-tr-2xl']
              : ['group-last/list:rounded-br-2xl', 'group-first/list:rounded-tl-2xl']
          ),
          join(' ')
        )}
      >
        <Plus className="size-12 stroke-gray-50 group-hover/button:stroke-secondary" />
      </Button>
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <AgentDialog onClick={onAgentClick} />
      </Dialog>
    </>
  )
}

export default PickButton
