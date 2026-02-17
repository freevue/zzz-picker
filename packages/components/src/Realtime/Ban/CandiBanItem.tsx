import { pipe, concat, join } from '@fxts/core'
import { type AgentId } from '@zzz-picker/constant'
import { useAgent } from '@zzz-picker/provider'

type Props = {
  agentId: AgentId
  active: boolean
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const CandiBanItem: React.FC<Props> = (props) => {
  const agent = useAgent(props.agentId)!

  return (
    <li
      style={{ backgroundColor: agent.color }}
      className={pipe(
        ['card', 'size-24', 'relative'],
        concat(props.active ? ['ring-2', 'ring-primary'] : []),
        join(' ')
      )}
    >
      <button
        onClick={props.onClick}
        className="block size-full"
        type="button"
        value={props.agentId}
      >
        <img className="size-full block object-cover" src={agent.profile.url} alt={agent.nameKo} />
      </button>
    </li>
  )
}

export default CandiBanItem
