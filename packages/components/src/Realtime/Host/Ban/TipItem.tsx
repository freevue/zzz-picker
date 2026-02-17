import { pipe, concat, join, isUndefined } from '@fxts/core'
import type { AgentId } from '@zzz-picker/constant'
import { useAgent } from '@zzz-picker/provider/hooks'

type Props = {
  id: AgentId
}

const TipItem: React.FC<Props> = (props) => {
  const agent = useAgent(props.id)

  return isUndefined(agent) ? null : (
    <li
      style={{ backgroundColor: agent.color || 'transparent' }}
      className={pipe(
        ['size-20', 'relative'],
        concat([
          'not-first:before:block',
          'not-first:before:absolute',
          'not-first:before:w-1',
          'not-first:before:h-2/3',
          'not-first:before:rounded-full',
          'not-first:before:bg-netural',
          'not-first:before:left-0',
          'not-first:before:top-1/2',
          'not-first:before:-translate-x-1/2',
          'not-first:before:-translate-y-1/2',
          'not-first:before:z-10',
        ]),
        join(' ')
      )}
    >
      <img
        className="block w-full h-full object-cover"
        src={agent.profile.url}
        alt={agent.nameKo}
      />
    </li>
  )
}

export default TipItem
