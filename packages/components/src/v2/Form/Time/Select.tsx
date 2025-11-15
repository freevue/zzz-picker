import { pipe, concat, join, map, range, toArray } from '@fxts/core'
import { useEffect, useRef } from 'react'

type Props = {
  value: number
  max: number
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
  defaultValue?: number
  className?: string
}

const Option: React.FC<{
  value?: number
  className?: string
  disabled?: boolean
  children?: React.ReactNode
}> = (props) => {
  return (
    <option
      disabled={props.disabled}
      value={props.value}
      className={pipe(
        [
          'heading-3xl',
          'flex',
          'select-none',
          'items-center',
          'justify-center',
          // 'snap-center',
          'tracking-widest',
        ],
        concat([props.className]),
        concat(['checked:bg-primary']),
        join(' ')
      )}
    >
      {props.children}
    </option>
  )
}
const Select: React.FC<Props> = (props) => {
  const selectRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    if (selectRef.current) {
      pipe(
        selectRef.current,
        ({ options }) => {
          const fixHeight = options.item(0)?.offsetHeight ?? 0

          return (options.item(props.value + 1)?.offsetTop ?? 0) - fixHeight
        },
        (top) => {
          selectRef.current!.blur()
          selectRef.current!.scrollTo({ top, behavior: 'smooth' })
        }
      )
    }
  }, [props.value])
  useEffect(() => {
    if (selectRef.current) {
      pipe(
        selectRef.current,
        ({ options }) => {
          const fixHeight = options.item(0)?.offsetHeight ?? 0

          return (options.item(props.value + 1)?.offsetTop ?? 0) - fixHeight
        },
        (top) => {
          requestAnimationFrame(() => {
            selectRef.current?.scrollTo({ top })
          })
        }
      )
    }
  }, [])

  return (
    <select
      ref={selectRef}
      onChange={props.onChange}
      value={props.value}
      name="minute"
      size={4}
      className={pipe(
        [
          'appearance-none',
          'block',
          'focus:outline-none',
          'scrollbar-hidden',
          // 'snap-y',
          // 'snap-mandatory',
        ],
        concat([props.className]),
        join(' ')
      )}
    >
      <Option className="h-1/4 text-[0px]" disabled>
        -
      </Option>
      {pipe(
        props.max,
        range,
        map((index) => (
          <Option key={index} className="h-1/2" value={index}>
            {index < 10 ? `${props.max > 10 ? '0' : ''}${index}` : index}
          </Option>
        )),
        toArray
      )}
      <Option className="h-1/4 text-[0px]" disabled>
        -
      </Option>
    </select>
  )
}

export default Select
