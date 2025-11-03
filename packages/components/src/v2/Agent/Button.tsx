import { useRoundedSize } from '..'
import Profile from './Profile'
import { pipe, concat, join } from '@fxts/core'

type Props = {
  url?: string
  color?: string
  className?: string
  children?: React.ReactNode
  flat?: boolean
  alt?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  value?: string | number
}

const Button: React.FC<Props> = (props) => {
  const size = useRoundedSize(props.size)

  return (
    <button
      type="button"
      className={pipe(
        ['overflow-hidden', 'flex', 'items-center', 'justify-center', 'cursor-pointer', size],
        concat([props.className || '']),
        concat(props.flat ? ['rounded-none!'] : []),
        concat(['disabled:grayscale-100', 'disabled:cursor-not-allowed']),
        join(' ')
      )}
      style={{ backgroundColor: props.color || 'var(--color-content)' }}
      onClick={props.onClick}
      disabled={props.disabled}
      value={props.value}
    >
      {props.url ? (
        <Profile
          className="size-full"
          url={props.url}
          color={props.disabled ? 'var(--color-content)' : props.color}
          flat
          alt={props.alt}
        />
      ) : (
        props.children
      )}
    </button>
  )
}

export default Button
