import { useSetting } from '@/hooks'
import { pipe } from '@fxts/core'
import { useEffect, useRef, useState } from 'react'

type Props = {
  value: number
  name: string
}

const Td: React.FC<Props> = (props) => {
  const input = useRef<HTMLInputElement>(null)
  const [isEdit, setIsEdit] = useState(false)
  const { onCostChange } = useSetting()

  const onEditClick = () => {
    setIsEdit(true)
  }
  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    pipe(
      Number(event.target.value),
      (value) => (isNaN(value) ? 0 : value),
      (value) => {
        onCostChange(event.target.name, value)
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
        onCostChange(props.name, value)
        setIsEdit(false)
      }
    )
  }

  useEffect(() => {
    if (isEdit) {
      input.current?.focus()
    }
  }, [isEdit])

  return (
    <td className="text-center border-table-bg-highlight border-b border-r hover:bg-table-bg-hover">
      {isEdit ? (
        <form className="block w-full h-full relative" onSubmit={onSubmit}>
          <label className="block w-full h-full">
            <input
              type="number"
              step="0.01"
              ref={input}
              className="w-full text-center h-full block p-2 border-none outline-none text-secondary"
              defaultValue={props.value}
              onBlur={onBlur}
              name={props.name}
            />
          </label>
        </form>
      ) : (
        <button onClick={onEditClick} className="w-full h-full cursor-pointer block" type="button">
          {props.value}
        </button>
      )}
    </td>
  )
}

export default Td
