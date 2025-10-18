import { join, concat, pipe } from '@fxts/core'

type Props = {
  name?: string
  type?: string
  defaultValue?: string
  className?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Input: React.FC<Props> = (props) => {
  return (
    <div
      className={pipe(
        ['flex', 'items-center', 'w-full', 'overflow-hidden'],
        concat([props.className || '']),
        join(' ')
      )}
    >
      <input
        name={props.name}
        type={props.type || 'text'}
        className={pipe(
          [
            'w-full',
            'block',
            'px-4',
            'py-2',
            'border-2',
            'border-text-secondary',
            'focus:border-secondary',
            'focus:outline-none',
            'dark:text-text-primary',
            'dark:placeholder:text-text-muted',
          ],
          concat([]),
          join(' ')
        )}
        value={props.defaultValue}
        onChange={props.onChange}
        autoComplete="off"
      />
    </div>
  )
}

export default Input
