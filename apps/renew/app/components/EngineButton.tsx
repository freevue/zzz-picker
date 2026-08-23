import { Engine } from '@/type'
import { pipe, join, concat } from '@fxts/core'

type Props = {
  className?: string
  active?: boolean
  disabled?: boolean
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
} & Engine

const EngineButton: React.FC<Props> = (props) => {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={pipe(
        [
          'bg-accent',
          'block',
          'w-full',
          'aspect-square',
          'text-7xl',
          'rounded-2xl',
          'cursor-pointer',
          'overflow-hidden',
          props.className || '',
        ],
        concat(['disabled:grayscale-100', 'disabled:cursor-not-allowed']),
        concat(props.active ? ['shadow-active'] : []),
        join(' ')
      )}
      disabled={props.disabled}
      value={props.id}
    >
      <img className="block w-full" src={props.banner} alt={props.nameKo} />
    </button>
  )
}

export default EngineButton
