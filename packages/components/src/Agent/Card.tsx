import { pipe, join, concat } from '@fxts/core'
import type { GQL_Agent } from '@zzz-picker/graphql'

type Props = {
  className?: string
  type?: HTMLButtonElement['type']
  active?: boolean
} & GQL_Agent

const AgentCard: React.FC<Props> = (props) => {
  return (
    <div className={pipe([], concat(props.className || []), join(' '))}>
      <button className="w-28 group cursor-pointer" type={props.type}>
        <img
          src={props.profile.url}
          alt=""
          style={{ backgroundColor: props.color || 'transparent' }}
          className={pipe(
            ['size-28', 'block', 'object-cover', , 'rounded-tr-2xl', 'overflow-hidden'],
            concat(['group-hover:rounded-bl-none', 'transition-[border-radius]', 'duration-300']),
            concat(props.active ? [''] : ['rounded-bl-2xl']),
            join(' ')
          )}
        />
        <span>{props.nameKo}</span>
      </button>
    </div>
  )
}

export default AgentCard
