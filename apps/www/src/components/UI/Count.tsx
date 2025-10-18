import { Minus, Plus } from '@/Icons'
import { isUndefined } from '@fxts/core'
import { useEffect, useRef, useState } from 'react'

type Props = {
  name: string
  defaultValue?: number
  onChange?: (value: number, name: string) => void
  min?: number
  max?: number
  step?: number
}

const Count: React.FC<Props> = (props) => {
  const input = useRef<HTMLInputElement>(null)
  const [count, setCount] = useState<number>(props.defaultValue || 0)

  const onButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setCount((prev) => {
      const newCount = prev + Number(event.currentTarget.value)

      if (!isUndefined(props.min) && newCount < props.min) return props.min
      if (!isUndefined(props.max) && newCount > props.max) return props.max

      return newCount
    })
  }
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCount(() => {
      const newCount = Number(event.currentTarget.value)

      if (!isUndefined(props.min) && newCount < props.min) return props.min
      if (!isUndefined(props.max) && newCount > props.max) return props.max

      return newCount
    })
  }

  useEffect(() => {
    props.onChange?.(count, props.name)
  }, [count])

  return (
    <div className="flex items-center w-full border-2 border-text-muted overflow-hidden h-8">
      <button
        className="size-8 cursor-pointer flex items-center justify-center bg-text-muted group"
        value="-1"
        onClick={onButtonClick}
        type="button"
      >
        <Minus className="dark:stroke-text-primary size-5 group-hover:stroke-secondary" />
      </button>
      <label className="flex-1 block h-full">
        <input
          className="w-full h-full block text-center text-lg font-medium text-text-primary focus:outline-none focus:text-secondary"
          type="number"
          ref={input}
          step={props.step || 1}
          name={props.name}
          min={props.min}
          max={props.max}
          value={count}
          onChange={onInputChange}
        />
      </label>
      <button
        className="size-8 cursor-pointer flex items-center justify-center bg-text-muted group"
        value="1"
        onClick={onButtonClick}
        type="button"
      >
        <Plus className="dark:stroke-text-primary size-5 group-hover:stroke-secondary" />
      </button>
    </div>
  )
}

export default Count
