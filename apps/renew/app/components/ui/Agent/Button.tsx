import { Profile } from './'
import { pipe, join, concat, isNull } from '@fxts/core'
import { Plus } from 'lucide-react'
import { Agent } from '~/type'

type Props = {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  agent: Agent | null
  className?: string
  active?: boolean
  disabled?: boolean
}

const AgentButton: React.FC<Props> = (props) => {
  return (
    <button
      type="button"
      onClick={props.onClick}
      disabled={props.disabled}
      className={pipe(
        ['agent', 'bg-accent', 'rounded-2xl', props.className || ''],
        concat(props.active ? ['active'] : []),
        concat(['disabled:grayscale-100']),
        join(' ')
      )}
      value={props.agent?.id}
    >
      {isNull(props.agent) ? <Plus /> : <Profile agent={props.agent} />}
    </button>
  )
}

export default AgentButton
