import { Agent } from '@/type'
import { pipe, join, isUndefined, concat } from '@fxts/core'
import { Plus } from 'lucide-react'

type Props = {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  agent: Agent
  active?: boolean
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
        concat(props.active ? ['shadow-active'] : []),
        join(' ')
      )}
      value={props.agent.id}
    >
      <img
        style={{ backgroundColor: props.agent.color || 'transparent' }}
        className="block w-full"
        src={props.agent.profile}
      />
    </button>
  )
}

export default AgentButton
