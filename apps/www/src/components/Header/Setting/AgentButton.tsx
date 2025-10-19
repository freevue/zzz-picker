import { PRETTY_AGENT_ID } from '@/constant'
import { useAgent } from '@/hooks'
import { pipe, concat, join } from '@fxts/core'
import { Button } from '@zzz-picker/components'

type Props = {
  id: number
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  disabled: boolean
  active: boolean
}

const AgentButton: React.FC<Props> = (props) => {
  const agent = useAgent(props.id)

  if (!agent) return null

  return (
    <Button
      className={pipe(
        ['w-full', 'flex', 'flex-col', 'border-2', 'rounded-lg', 'overflow-hidden'],
        concat(
          props.active
            ? ['border-primary', 'text-primary']
            : ['border-transparent', 'hover:border-secondary', 'hover:text-secondary']
        ),
        join(' ')
      )}
      onClick={props.onClick}
      disabled={props.disabled}
      value={props.id}
    >
      <img
        style={{ backgroundColor: agent.color || 'transparent' }}
        className={pipe(
          ['w-full', 'block'],
          concat(
            props.id === PRETTY_AGENT_ID
              ? ['animate-[twinkles_2s_infinite_linear]', 'shadow-xl/50', 'shadow-primary']
              : []
          ),
          join(' ')
        )}
        src={agent.chzzkSquareImage || agent.labSquareImage}
        alt={agent.nameKo}
      />
      <span className="text-md font-bold">{agent.nameKo}</span>
    </Button>
  )
}

export default AgentButton
