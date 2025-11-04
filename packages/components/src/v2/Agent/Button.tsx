import { useRoundedSize } from '..'
import Profile from './Profile'
import { pipe, concat, join } from '@fxts/core'
import { useAgent } from '@zzz-picker/provider/hooks'

type Props = {
  className?: string
  children?: React.ReactNode
  flat?: boolean
  id: number | null
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  value?: string | number
  naming?: boolean
  hover?: boolean
  active?: boolean
}

const Button: React.FC<Props> = (props) => {
  const size = useRoundedSize(props.size)
  const agent = useAgent(props.id || 0)

  return (
    <button
      type="button"
      onClick={props.onClick}
      disabled={props.disabled}
      value={props.value || props.id || undefined}
      className={pipe(
        [
          'overflow-hidden',
          'group',
          'flex',
          'flex-col',
          'items-center',
          'gap-1',
          'cursor-pointer',
          'justify-center',
          'border-2',
          'h-auto!',
          size,
        ],
        concat([props.className || '']),
        concat(props.flat ? ['rounded-none!'] : []),
        concat(props.active ? ['border-primary', 'text-primary'] : ['border-transparent']),
        concat(props.naming ? ['pb-1'] : []),
        concat(['focus:outline-none']),
        join(' ')
      )}
    >
      <div
        className={pipe(
          [
            'overflow-hidden',
            'transition-all',
            'duration-200',
            'flex',
            'items-center',
            'justify-center',
            size,
          ],
          concat([props.className || '']),
          concat(props.flat ? ['rounded-none!'] : []),
          concat(props.hover ? ['group-hover:rounded-bl-none!'] : []),
          concat(props.active ? ['rounded-bl-none!'] : []),
          concat(['group-disabled:grayscale-100', 'group-disabled:cursor-not-allowed']),
          join(' ')
        )}
        style={{ backgroundColor: agent?.color || 'var(--color-content)' }}
      >
        {agent ? (
          <>
            <Profile
              className={pipe(
                ['size-full', 'transition-transform', 'duration-200'],
                concat(props.hover ? ['group-hover:scale-105'] : []),
                join(' ')
              )}
              id={Number(agent.id)}
              flat
            />
          </>
        ) : (
          props.children
        )}
      </div>
      {props.naming && agent && (
        <span className="block text-base font-bold text-ink break-keep group-disabled:opacity-50">
          {agent.nameKo}
        </span>
      )}
    </button>
  )
}

export default Button
