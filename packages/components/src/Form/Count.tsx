import { Button, Icons } from '../'
import { isUndefined } from '@fxts/core'
import { useEffect, useRef, useState } from 'react'

type Props = {
  name: string
  defaultValue?: number
  value?: number
  onChange?: (value: number, name: string) => void
  min?: number
  max?: number
  step?: number
}

const Count: React.FC<Props> = (props) => {
  const input = useRef<HTMLInputElement>(null)
  const [count, setCount] = useState<number>(props.value || 0)

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
  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.value = `${Number(event.target.value)}`
  }
  useEffect(() => {
    props.onChange?.(count, props.name)
  }, [count])
  useEffect(() => {
    setCount(props.value || 0)
  }, [props.value])

  return (
    <div className="flex items-center w-full border-2 border-base overflow-hidden rounded-lg">
      <Button className="p-2 bg-base group" value="-1" onClick={onButtonClick} type="button">
        <Icons.Minus className="stroke-content size-8 group-hover:stroke-secondary" />
      </Button>
      <label className="flex-1 block h-full">
        <input
          className="w-full h-full block text-center text-xl font-extrabold text-text-primary focus:outline-none focus:text-secondary"
          type="number"
          ref={input}
          step={props.step || 1}
          name={props.name}
          min={props.min}
          max={props.max}
          value={count}
          onChange={onInputChange}
          onBlur={onBlur}
          onWheel={(event) => event.currentTarget.blur()}
        />
      </label>
      <Button className="p-2 bg-base group" value="1" onClick={onButtonClick} type="button">
        <Icons.Plus className="stroke-content size-8 group-hover:stroke-secondary" />
      </Button>
    </div>
  )
}

export default Count
