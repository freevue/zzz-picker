import { Minus, Plus } from '@/Icons'
import { isUndefined } from '@fxts/core'
import { useEffect, useState } from 'react'

type Props = {
  name?: string
  defaultValue?: number
  onChange?: (count: number) => void
  min?: number
  max?: number
}

const Count: React.FC<Props> = (props) => {
  const [count, setCount] = useState<number>(props.defaultValue || 0)

  const onButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const value = event.currentTarget.value

    setCount((prev) => {
      const newCount = prev + Number(value)

      if (!isUndefined(props.min) && newCount < props.min) return props.min
      if (!isUndefined(props.max) && newCount > props.max) return props.max

      return newCount
    })
  }

  useEffect(() => {
    setCount(props.defaultValue || 0)
  }, [props.defaultValue])
  useEffect(() => {
    props.onChange?.(count)
  }, [count])

  return (
    <div className="flex items-center w-full border-2 border-gray-700 rounded-md overflow-hidden">
      <input type="hidden" name={props.name} value={count} />
      <button
        className="size-8 cursor-pointer flex items-center justify-center bg-gray-700"
        value="-1"
        onClick={onButtonClick}
        type="button"
      >
        <Minus className="dark:stroke-white size-5" />
      </button>
      <p className="text-md font-bold text-center dark:text-white flex-1">{count}</p>
      <button
        className="size-8 cursor-pointer flex items-center justify-center bg-gray-700"
        value="1"
        onClick={onButtonClick}
        type="button"
      >
        <Plus className="dark:stroke-white size-5" />
      </button>
    </div>
  )
}

export default Count
