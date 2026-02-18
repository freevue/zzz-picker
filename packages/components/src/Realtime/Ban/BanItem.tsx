import { pipe, concat, join } from '@fxts/core'
import { type SelectAgent } from '@zzz-picker/constant'
import { useAgent } from '@zzz-picker/provider'

type Props = {
  agentId: SelectAgent
}

const BanItem: React.FC<Props> = (props) => {
  const agent = useAgent(props.agentId || 0)

  return (
    <li
      style={{ backgroundColor: agent?.color || 'var(--color-content)' }}
      className={pipe(
        ['card', 'size-24', 'relative'],
        concat(
          agent
            ? [
                'filter',
                'grayscale-100',
                'after:bg-disabled',
                'after:absolute',
                'after:w-2',
                'after:h-full',
                'after:block',
                'after:top-1/2',
                'after:left-1/2',
                'after:-translate-x-1/2',
                'after:-translate-y-1/2',
                'after:-rotate-45',
                'after:rounded-full',
              ]
            : []
        ),
        join(' ')
      )}
    >
      {agent && (
        <img className="size-full block object-cover" src={agent.profile.url} alt={agent.nameKo} />
      )}
    </li>
  )
}

export default BanItem
