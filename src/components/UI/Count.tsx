import { Minus, Plus } from '@/Icons'
import { isUndefined } from '@fxts/core'
import { useEffect, useRef, useState } from 'react'

type Props = {
  defaultValue?: number
  onChange?: (count: number) => void
  min?: number
  max?: number
}

const Count: React.FC<Props> = (props) => {
  const timeout = useRef<NodeJS.Timeout | null>(null)
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
    if (timeout.current) clearTimeout(timeout.current)

    timeout.current = setTimeout(() => {
      props.onChange?.(count)
    }, 500)

    return () => {
      if (timeout.current) clearTimeout(timeout.current)
    }
  }, [count])

  return (
    <div className="flex items-center w-full border-2 border-gray-700 rounded-md overflow-hidden">
      <button
        className="size-8 cursor-pointer flex items-center justify-center bg-gray-700"
        value="-1"
        onClick={onButtonClick}
        type="button"
      >
        <Minus className="dark:stroke-white size-5" />
      </button>
      <p className="text-md font-bold text-center dark:text-white px-4 flex-1">{count}</p>
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
