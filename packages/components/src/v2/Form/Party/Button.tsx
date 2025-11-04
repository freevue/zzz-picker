import { Agent, Dialog, Typo } from '../../'
import { Icons } from '../../../'
import { pipe, concat, join, isNull, isUndefined } from '@fxts/core'
import type { SelectAgent, AgentId } from '@zzz-picker/constant'
import { useState, Activity } from 'react'

type Props = {
  id: SelectAgent
  cost?: number
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  onClick?: (agentId: AgentId) => void
  onSelect?: (agentId: AgentId) => void
  onDelete?: (event: React.MouseEvent<HTMLButtonElement>) => void
  deleteable?: boolean
  allowAgents?: AgentId[]
  banAgents?: AgentId[]
}

const Button: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false)

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (!props.id) setIsOpen(true)
  }
  const onSelect = (event: React.MouseEvent<HTMLButtonElement>) => {
    props.onSelect?.(Number(event.currentTarget.value))
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
          <Icons.Plus className="size-2/4 stroke-ink group-hover/button:stroke-primary" />
        </Agent.Button>
        <Activity mode={isUndefined(props.cost) || isNull(props.id) ? 'hidden' : 'visible'}>
          <Typo.Body
            className={pipe(
              [
                'absolute',
                'left-0',
                'top-0',
                'size-8',
                'bg-content/50',
                'backdrop-blur-sm',
                'text-ink',
                'body-xl',
                'flex',
                'items-center',
                'justify-center',
              ],
              concat([]),
              join(' ')
            )}
          >
            {props.cost}
          </Typo.Body>
        </Activity>
        <Activity mode={props.deleteable && !isNull(props.id) ? 'visible' : 'hidden'}>
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
              concat(['group-hover/wrap:opacity-100', 'focus:outline-none']),
              join(' ')
            )}
          >
            <Icons.Cross className="size-full stroke-ink group-hover/delete:stroke-primary" />
          </button>
        </Activity>
      </div>
      <Dialog.Agents
        isOpen={isOpen}
        onSelect={onSelect}
        onClose={() => setIsOpen(false)}
        allowAgents={props.allowAgents}
        banAgents={props.banAgents}
      />
    </>
  )
}

export default Button
