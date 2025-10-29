import { useSetting } from '@/hooks'
import { pipe } from '@fxts/core'
import { useEffect, useRef, useState } from 'react'

type Props = {
  value: number
  name: string
  append?: React.ReactNode
}

const Td: React.FC<Props> = (props) => {
  const input = useRef<HTMLInputElement>(null)
  const [isEdit, setIsEdit] = useState(false)
  const { state, setCostTable } = useSetting()

  const onEditClick = () => {
    setIsEdit(true)
  }
  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    pipe(
      Number(event.target.value),
      (value) => (isNaN(value) ? 0 : value),
      (value) => {
        setCostTable(event.target.name, value)
        setIsEdit(false)
      }
    )
  }
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    pipe(
      new FormData(event.target as HTMLFormElement),
      (formData) => formData.get(props.name),
      (value) => (isNaN(Number(value)) ? 0 : Number(value)),
      (value) => {
        setCostTable(props.name, value)
        setIsEdit(false)
      }
    )
  }
  const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select()
  }

  useEffect(() => {
    if (isEdit) {
      input.current?.focus()
    }
  }, [isEdit])

  if (state.totalCost === Infinity) {
    return (
      <td className="text-center h-14 bg-content border-table text-foreground border-b border-r text-2xl font-black">
        -
      </td>
    )
  }

  return (
    <td className="text-center h-14 bg-content border-table border-b border-r hover:bg-table/70 relative">
      {isEdit ? (
        <form className="block w-full h-full relative" onSubmit={onSubmit}>
          <label className="block w-full h-full">
            <input
              type="number"
              step="0.01"
              ref={input}
              className="w-full text-center h-full block p-2 border-none outline-none text-lg font-medium text-secondary selection:bg-text-muted"
              defaultValue={props.value}
              onFocus={onFocus}
              onBlur={onBlur}
              name={props.name}
            />
          </label>
        </form>
      ) : (
        <button
          onClick={onEditClick}
          className="w-full h-full cursor-pointer block text-foreground text-lg font-medium"
          type="button"
        >
          <span className="block">{props.value}</span>
          {props.append || null}
        </button>
      )}
    </td>
  )
}

export default Td
