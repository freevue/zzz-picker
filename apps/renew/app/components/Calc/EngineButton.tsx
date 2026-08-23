import { Engine } from '@/type'
import { pipe, join, concat } from '@fxts/core'

type Props = {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  engine: Engine
  active?: boolean
}

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
        ],
        concat(props.active ? ['shadow-active'] : []),
        join(' ')
      )}
      value={props.engine.id}
    >
      <img className="block w-full" src={props.engine.banner} />
    </button>
  )
}

export default EngineButton
