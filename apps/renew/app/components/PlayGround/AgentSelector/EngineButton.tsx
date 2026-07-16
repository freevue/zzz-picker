import { pipe, join, isUndefined } from '@fxts/core'
import type { Engine } from '~/type'

type Props = {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  engine?: Engine
  value: number | string
}

const EngineButton: React.FC<Props> = (props) => {
  return (
    <button
      type="button"
      value={props.value}
      onClick={props.onClick}
      className={pipe(
        [
          'absolute',
          '-right-4',
          '-bottom-4',
          'size-10',
          'card',
          'flex',
          'items-center',
          'justify-center',
          'text-5xl',
          'rounded-lg',
          'cursor-pointer',
          'overflow-hidden',
        ],
        join(' ')
      )}
    >
      {isUndefined(props.engine) ? '+' : <img className="block w-full" src={props.engine.icon} />}
    </button>
  )
}

export default EngineButton
