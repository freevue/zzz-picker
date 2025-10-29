import { pipe, join, concat } from '@fxts/core'
import type { GQL_Agent } from '@zzz-picker/graphql'

type Props = {
  className?: string
  type?: HTMLButtonElement['type']
  active?: boolean
  disabled?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
} & GQL_Agent

const AgentCard: React.FC<Props> = (props) => {
  return (
    <div className={pipe([], concat(props.className || []), join(' '))}>
      <button
        onClick={props.onClick}
        disabled={props.disabled}
        value={props.id}
        className={pipe(
          ['w-28', 'group', 'border-2', 'rounded-bl-2xl', 'rounded-tr-2xl', 'overflow-hidden'],
          concat(
            props.active
              ? ['border-primary', 'text-primary']
              : ['border-transparent', 'hover:text-secondary']
          ),
          concat(
            props.disabled
              ? ['grayscale-100', 'cursor-not-allowed', 'line-through', 'text-foreground0']
              : ['cursor-pointer', 'text-foreground']
          ),
          join(' ')
        )}
        type={props.type}
      >
        <img
          src={props.profile.url}
          alt=""
          style={{ backgroundColor: props.color || 'transparent' }}
          className={pipe(
            [
              'w-full',
              'aspect-square',
              'block',
              'object-cover',
              'overflow-hidden',
              'rounded-bl-2xl',
            ],
            concat(['group-hover:rounded-bl-none', 'transition-[border-radius]', 'duration-300']),
            concat(
              props.active ? ['rounded-bl-none'] : ['rounded-bl-2xl', 'group-hover:rounded-bl-2xl']
            ),
            join(' ')
          )}
        />
        <span className="text-sm font-bold mt-1">{props.nameKo}</span>
      </button>
    </div>
  )
}

export default AgentCard
