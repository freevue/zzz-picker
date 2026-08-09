import { pipe, join } from '@fxts/core'
import { Agent } from '~/type'

type Props = {
  agent: Agent
  className?: string
}

const AgentProfile: React.FC<Props> = (props) => {
  return (
    <img
      style={{ backgroundColor: props.agent.color || 'transparent' }}
      className={pipe(['block', 'aspect-square', 'w-full', props.className || ''], join(' '))}
      src={props.agent.profile}
    />
  )
}

export default AgentProfile
