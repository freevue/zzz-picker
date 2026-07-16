import { concat, join, pipe } from '@fxts/core'
import type { Agent } from '~/type'

type Props = {
  className?: string
  active?: boolean
  disabled?: boolean
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
} & Agent

const AgentButton: React.FC<Props> = (props) => {
  return (
    <button
      disabled={props.disabled}
      className={pipe(
        [
          'w-full',
          'block',
          'cursor-pointer',
          'aspect-square',
          'overflow-hidden',
          'rounded-2xl',
          'p-2',
          'card',
          'relative',
          props.className || '',
        ],
        concat(['active:outline-0', 'focus:outline-0']),
        concat(['disabled:grayscale-100', 'disabled:cursor-not-allowed']),
        concat(props.active ? ['active'] : []),
        join(' ')
      )}
      value={props.id}
      onClick={props.onClick}
    >
      <img
        className="block w-full rounded-xl"
        style={{ backgroundColor: props.color || 'transparent' }}
        src={props.profile}
        alt={props.nameKo}
      />
    </button>
  )
}

export default AgentButton
