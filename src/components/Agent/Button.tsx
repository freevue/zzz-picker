import type { AgentAvatar } from '../../types'
import Avatar from './Avatar'
import { concat, join, pipe } from '@fxts/core'

export type Props = {
  disabled?: boolean
  active?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  className?: string
} & AgentAvatar

const Button: React.FC<Props> = (props) => {
  return (
    <button
      className={pipe(
        [
          'text-center',
          'flex',
          'flex-col',
          'items-center',
          'gap-1',
          'cursor-pointer',
          'focus:outline-none',
        ],
        concat(['disabled:filter', 'disabled:grayscale', 'disabled:cursor-not-allowed']),
        concat(props.className ? [props.className] : []),
        join(' ')
      )}
      disabled={props.disabled}
      onClick={props.onClick}
      value={props.id}
      type="button"
    >
      <Avatar
        {...props}
        className={pipe(
          ['border-2'],
          concat(props.active ? ['border-primary'] : ['border-transparent']),
          join(' ')
        )}
      />
      <p
        className={pipe(
          ['text-md font-bold', 'dark:text-white'],
          concat(props.disabled ? ['opacity-50'] : ['opacity-80']),
          concat(props.active ? ['text-primary!'] : []),
          join(' ')
        )}
      >
        {props.name_mi18n}
      </p>
    </button>
  )
}

export default Button
