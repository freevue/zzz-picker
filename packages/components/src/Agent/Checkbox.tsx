import { pipe, join, concat } from '@fxts/core'
import type { GQL_Agent } from '@zzz-picker/graphql'

type Props = {
  className?: string
  defaultChecked?: boolean
  disabled?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
} & GQL_Agent

const AgentCard: React.FC<Props> = (props) => {
  return (
    <div className={pipe(['w-full'], concat(props.className || []), join(' '))}>
      <input
        id={`agent-checkbox-${props.id}`}
        disabled={props.disabled}
        value={props.id}
        type="checkbox"
        name={`agent-checkbox-${props.id}`}
        defaultChecked={props.defaultChecked}
        onChange={props.onChange}
        className="appearance-none peer"
      />
      <label
        htmlFor={`agent-checkbox-${props.id}`}
        className={pipe(
          [
            'w-full',
            'block',
            'group',
            'border-2',
            'rounded-bl-2xl',
            'rounded-tr-2xl',
            'overflow-hidden',
            'text-center',
            'group',
          ],
          concat([
            'cursor-pointer',
            'border-transparent',
            'text-foreground',
            'hover:text-secondary',
          ]),
          concat([
            'peer-checked:border-primary!',
            'peer-checked:text-primary!',
            'peer-disabled:grayscale-100',
            'peer-disabled:cursor-not-allowed',
            'peer-disabled:line-through',
            'peer-disabled:text-foreground/30',
            'peer-checked:[&>img]:rounded-bl-none',
          ]),
          join(' ')
        )}
      >
        <img
          src={props.profile.url}
          alt=""
          style={{ backgroundColor: props.color || 'transparent' }}
          className={pipe(
            [
              'w-full',
              'aspect-square',
              'block',
              'object-cover',
              'overflow-hidden',
              'rounded-bl-2xl',
            ],
            concat(['group-hover:rounded-bl-none', 'transition-[border-radius]', 'duration-300']),
            join(' ')
          )}
        />
        <span className="text-sm font-bold mt-1">{props.nameKo}</span>
      </label>
    </div>
  )
}

export default AgentCard
