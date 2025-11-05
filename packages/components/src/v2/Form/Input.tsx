import { concat, join, pipe } from '@fxts/core'

type Props = {
  value?: string | number
  placeholder?: string
  onChange?: (value: React.ChangeEvent<HTMLInputElement>) => void
  onFocus?: (value: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (value: React.FocusEvent<HTMLInputElement>) => void
  onWheel?: (value: React.WheelEvent<HTMLInputElement>) => void
  onKeyDown?: (value: React.KeyboardEvent<HTMLInputElement>) => void
  className?: string
  name: string
  type: React.HTMLInputTypeAttribute
  max?: number
  min?: number
  step?: number
}

const Input: React.FC<Props> = (props) => {
  return (
    <div className={pipe(['overflow-hidden'], concat([props.className || '']), join(' '))}>
      <label className="block h-full">
        <input
          className={pipe(
            ['bg-content', 'text-ink', 'py-2', 'px-4', 'size-full'],
            concat(['focus:outline-none']),
            join(' ')
          )}
          max={props.max}
          min={props.min}
          step={props.step}
          name={props.name}
          type={props.type}
          value={props.value}
          onChange={props.onChange}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          onWheel={props.onWheel}
          onKeyDown={props.onKeyDown}
          placeholder={props.placeholder}
        />
      </label>
    </div>
  )
}

export default Input
