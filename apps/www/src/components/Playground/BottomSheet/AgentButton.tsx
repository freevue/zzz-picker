import { useAgent } from '@/hooks'
import { pipe, concat, join } from '@fxts/core'
import { Button } from '@zzz-picker/components'
import { PRETTY_AGENT_ID } from '@zzz-picker/constant'

type Props = {
  id: number
  active: boolean
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  disabled: boolean
}

const AgentButton: React.FC<Props> = (props) => {
  const agent = useAgent(props.id)

  if (!agent) return null

  return (
    <Button
      className={pipe(
        [
          'w-full',
          'flex',
          'flex-col',
          'border-2',
          'rounded-bl-2xl',
          'rounded-tr-2xl',
          'overflow-hidden',
          'group',
        ],
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
      <div
        style={{ backgroundColor: agent.color || 'transparent' }}
        className={pipe(
          ['w-full', 'overflow-hidden', 'transition-[border-radius]', 'duration-300'],
          concat(
            props.active ? ['border-primary'] : ['rounded-bl-2xl', 'group-hover:rounded-none']
          ),
          join(' ')
        )}
      >
        <img
          className={pipe(
            ['w-full', 'block', 'origin-bottom', 'transition-transform', 'duration-300'],
            concat(
              props.id === PRETTY_AGENT_ID
                ? ['group-hover:scale-90', 'group-hover:translate-y-3']
                : []
            ),
            join(' ')
          )}
          src={agent.chzzkSquareImage || agent.labSquareImage}
          alt={agent.nameKo}
        />
      </div>
      <span className="text-md font-bold">{agent.nameKo}</span>
    </Button>
  )
}

export default AgentButton
