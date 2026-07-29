import { pipe, join, isUndefined } from '@fxts/core'
import { Icon } from '~/components'
import { Agent } from '~/type'

type Props = {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  value: string | number
  agent?: Agent
}

const AgentButton: React.FC<Props> = (props) => {
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
        join(' ')
      )}
      value={props.value}
    >
      {isUndefined(props.agent) ? (
        <Icon.Plus className="scale-75" />
      ) : (
        <img
          style={{ backgroundColor: props.agent.color || 'transparent' }}
          className="block w-full"
          src={props.agent.profile}
        />
      )}
    </button>
  )
}

export default AgentButton
