import { concat, join, pipe } from '@fxts/core'

type Props = {
  value?: string
  placeholder?: string
  onChange?: (value: string) => void
  className?: string
  name: string
}

const Input: React.FC<Props> = (props) => {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange?.(event.target.value)
  }

  return (
    <div className={pipe(['overflow-hidden'], concat([props.className || '']), join(' '))}>
      <label className="block h-full">
        <input
          className={pipe(
            ['bg-content', 'text-ink', 'py-2', 'px-4', 'h-full'],
            concat(['focus:outline-none']),
            join(' ')
          )}
          name={props.name}
          type="text"
          value={props.value}
          onChange={onChange}
          placeholder={props.placeholder}
        />
      </label>
    </div>
  )
}

export default Input
