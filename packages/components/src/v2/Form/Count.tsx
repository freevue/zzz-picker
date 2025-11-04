import { Icons } from '../../'
import { concat, isUndefined, join, pipe, when } from '@fxts/core'

type Props = {
  value: number
  onChange?: (value: number) => void
  className?: string
  name: string
  max?: number
  min?: number
  step?: number
}

const Count: React.FC<Props> = (props) => {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    pipe(
      Number(event.target.value),
      when(
        (value) => value < (isUndefined(props.min) ? value : props.min),
        (value) => (isUndefined(props.min) ? value : props.min)
      ),
      when(
        (value) => value > (isUndefined(props.max) ? value : props.max),
        (value) => (isUndefined(props.max) ? value : props.max)
      ),
      (value) => props.onChange?.(value)
    )
  }
  const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select()
  }
  const onMinusClick = () => {
    pipe(
      props.value - 1,
      when(
        (value) => value < (isUndefined(props.min) ? value : props.min),
        (value) => (isUndefined(props.min) ? value : props.min)
      ),
      (value) => props.onChange?.(value)
    )
  }
  const onPlusClick = () => {
    pipe(
      props.value + 1,
      when(
        (value) => value > (isUndefined(props.max) ? value : props.max),
        (value) => (isUndefined(props.max) ? value : props.max)
      ),
      (value) => props.onChange?.(value)
    )
  }
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.currentTarget.blur()
    }
  }

  return (
    <div
      className={pipe(
        ['overflow-hidden', 'flex', 'h-11', 'rounded-xl'],
        concat([props.className || '']),
        join(' ')
      )}
    >
      <button
        type="button"
        onClick={onMinusClick}
        className="size-11 bg-netural group cursor-pointer flex items-center justify-center"
      >
        <Icons.Minus className="stroke-content size-2/3" />
      </button>
      <label className="h-full flex-1">
        <input
          className={pipe(
            ['text-ink', 'h-full', 'px-4', 'w-full', 'text-center'],
            concat(['focus:outline-none', 'heading-2xl']),
            join(' ')
          )}
          name={props.name}
          type="number"
          onKeyDown={onKeyDown}
          value={`${Number(props.value)}`}
          step={props.step || 1}
          onFocus={onFocus}
          onChange={onChange}
          max={props.max}
          min={props.min}
        />
      </label>
      <button
        type="button"
        onClick={onPlusClick}
        className="size-11 bg-netural group cursor-pointer flex items-center justify-center"
      >
        <Icons.Plus className="stroke-content size-2/3" />
      </button>
    </div>
  )
}

export default Count
