import { pipe, join, isUndefined, concat } from '@fxts/core'
import { Icon } from '~/components'
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
          '-right-2',
          'bottom-0',
          'size-14',
          'flex',
          'items-center',
          'justify-center',
          'text-5xl',
          'cursor-pointer',
          'overflow-hidden',
          'rounded-full',
        ],
        concat(isUndefined(props.engine) ? ['bg-accent'] : ['backdrop-blur-2xl']),
        join(' ')
      )}
    >
      {isUndefined(props.engine) ? (
        <Icon.Plus className="scale-75" />
      ) : (
        <img className="block w-full" src={props.engine.icon} />
      )}
    </button>
  )
}

export default EngineButton
