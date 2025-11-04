import { pipe, concat, join, range, map, toArray } from '@fxts/core'
import { useEffect, useRef, useState } from 'react'

type Props = {
  range: number
  value: number
  onChange?: (value: number) => void
  className?: string
}

const Scroll: React.FC<Props> = (props) => {
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const timeout = useRef<NodeJS.Timeout | null>(null)

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange?.(Number(event.target.value))
  }
  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()

    setIsEditing(true)
  }
  const onEditClose = () => {
    setIsEditing(false)
  }
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onEditClose()
    }
  }
  const onScrollEnd = () => {
    if (isEditing) return

    timeout.current && clearTimeout(timeout.current)
    timeout.current = setTimeout(() => {
      props.onChange?.(Math.floor(scrollRef.current!.scrollTop / 56))
      timeout.current = null
    }, 300)
  }

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])
  useEffect(() => {
    if (scrollRef.current && !isEditing) {
      scrollRef.current.scrollTop = props.value * 56
    }
  }, [props.value, isEditing])

  return (
    <div
      ref={scrollRef}
      onClick={onClick}
      onScroll={onScrollEnd}
      className={pipe(
        [
          'flex',
          'flex-col',
          'size-14',
          'overflow-y-auto',
          'scrollbar-hidden',
          'snap-y',
          'snap-mandatory',
        ],
        concat([props.className || '']),
        join(' ')
      )}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          onChange={onInputChange}
          value={props.value}
          onWheel={onEditClose}
          onBlur={onEditClose}
          onKeyDown={onKeyDown}
          className={pipe(
            ['size-14', 'flex', 'items-center', 'heading-4xl', 'justify-center'],
            concat(['text-ink', 'snap-center', 'focus:outline-none', 'text-center']),
            join(' ')
          )}
          min={0}
          max={props.range}
          type="number"
        />
      ) : (
        pipe(
          props.range,
          range,
          map((index) => (
            <button
              key={index}
              type="button"
              className={pipe(
                ['size-14', 'min-h-14', 'flex', 'items-center', 'heading-4xl', 'justify-center'],
                concat(['text-ink', 'snap-center']),
                join(' ')
              )}
            >
              {index < 10 ? `0${index}` : index}
            </button>
          )),
          toArray
        )
      )}
    </div>
  )
}

export default Scroll
