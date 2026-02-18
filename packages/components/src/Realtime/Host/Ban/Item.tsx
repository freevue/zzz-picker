import { pipe, concat, join, isUndefined } from '@fxts/core'
import { Plus } from '@zzz-picker/components/icons'
import type { SelectAgent } from '@zzz-picker/constant'
import { useAgent } from '@zzz-picker/provider/hooks'

type Props = {
  id?: SelectAgent
}

const Item: React.FC<Props> = (props) => {
  const agent = useAgent(props.id || 0)

  return (
    <li
      style={{ backgroundColor: agent?.color || 'transparent' }}
      className={pipe(
        ['size-24', 'relative'],
        concat(isUndefined(agent) ? ['flex', 'items-center', 'justify-center'] : []),
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
      {isUndefined(agent) ? (
        <Plus className="size-2/4 stroke-ink group-hover/button:stroke-primary" />
      ) : (
        <img
          className="block w-full h-full object-cover"
          src={agent.profile.url}
          alt={agent.nameKo}
        />
      )}
    </li>
  )
}

export default Item
