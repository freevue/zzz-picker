import { pipe, join, concat } from '@fxts/core'
import { useEffect, useRef, useState } from 'react'

type Props = {
  value: number
  name: string
  append?: React.ReactNode
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}

const Td: React.FC<Props> = (props) => {
  const input = useRef<HTMLInputElement>(null)
  const [isEdit, setIsEdit] = useState(false)

  const onEditClick = () => {
    setIsEdit(true)
  }
  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    event.preventDefault()
    setIsEdit(false)
  }
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()

    props.onChange?.(event)
  }
  const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select()
  }
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.currentTarget.blur()
    }
  }

  useEffect(() => {
    if (isEdit) {
      input.current?.focus()
    }
  }, [isEdit])

  return (
    <td
      className={pipe(
        ['text-center', 'h-14', 'bg-base/70', 'border-b', 'border-r', 'relative'],
        concat([props.className || '']),
        concat(['hover:bg-tertiary', 'border-secondary']),
        join(' ')
      )}
    >
      {isEdit ? (
        <label className="block w-full h-full">
          <input
            type="number"
            step="0.01"
            ref={input}
            className="w-full text-center h-full block p-2 border-none outline-none selection:bg-netural selection:text-content text-ink body-xl"
            defaultValue={props.value}
            onFocus={onFocus}
            onChange={onChange}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            name={props.name}
          />
        </label>
      ) : (
        <button
          onClick={onEditClick}
          className="w-full h-full cursor-pointer block text-ink body-xl"
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
