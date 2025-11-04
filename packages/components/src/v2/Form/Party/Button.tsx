import { Agent, Dialog } from '../../'
import { Icons } from '../../../'
import { pipe, concat, join } from '@fxts/core'
import { useState } from 'react'

type Props = {
  id: number | null
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  onClick?: (agentId: number) => void
  onDelete?: (event: React.MouseEvent<HTMLButtonElement>) => void
  deleteable?: boolean
}

const Button: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false)

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    setIsOpen(true)
  }
  const onSelect = (event: React.MouseEvent<HTMLButtonElement>) => {
    props.onClick?.(Number(event.currentTarget.value))
    setIsOpen(false)
  }

  return (
    <>
      <div
        className={pipe(
          ['group/wrap', 'relative'],
          concat([
            'not-last:after:content-[""]',
            'not-last:after:block',
            'not-last:after:absolute',
            'not-last:after:w-1',
            'not-last:after:rounded-full',
            'not-last:after:h-2/3',
            'not-last:after:bg-netural',
            'not-last:after:right-0',
            'not-last:after:top-1/2',
            'not-last:after:translate-x-1/2',
            'not-last:after:-translate-y-1/2',
            'not-last:after:z-10',
          ]),
          join(' ')
        )}
      >
        <Agent.Button
          onClick={onClick}
          value={props.id || 0}
          className={pipe(
            ['group/button', 'border-none!'],
            concat(['group-not-first/wrap:rounded-bl-none', 'group-not-last/wrap:rounded-tr-none']),
            join(' ')
          )}
          flat
          size={props.size}
          id={props.id || 0}
        >
          <Icons.Plus className="size-2/3 stroke-ink group-hover/button:stroke-primary" />
        </Agent.Button>
        {props.deleteable && props.id !== null && (
          <button
            type="button"
            onClick={props.onDelete}
            value={props.id || 0}
            className={pipe(
              [
                'absolute',
                'right-0',
                'bottom-0',
                'group/delete',
                'size-8',
                'bg-content/50',
                'backdrop-blur-sm',
                'cursor-pointer',
                'opacity-0',
                'transition-opacity',
                'duration-200',
              ],
              concat(['group-hover/wrap:opacity-100']),
              join(' ')
            )}
          >
            <Icons.Cross className="size-full stroke-ink group-hover/delete:stroke-primary" />
          </button>
        )}
      </div>
      <Dialog.Agents isOpen={isOpen} onSelect={onSelect} onClose={() => setIsOpen(false)} />
    </>
  )
}

export default Button
