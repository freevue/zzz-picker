import Form from '../'
import { pipe, concat, join, when } from '@fxts/core'
import { useEffect, useState } from 'react'

type Props = {
  value: number
  name: string
  onChange?: (value: number) => void
  className?: string
}

const Input: React.FC<Props> = (props) => {
  const [minute, setMinute] = useState(0)
  const [second, setSecond] = useState(0)

  const onMinuteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    pipe(
      Number(event.target.value),
      when(
        (value) => value > 3,
        () => 3
      ),
      when(
        (value) => value < 0,
        () => 0
      ),
      (value) => {
        setMinute(value)
        props.onChange?.(value * 60 + second)
      }
    )
  }
  const onSecondChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    pipe(
      Number(event.target.value),
      when(
        (value) => value > 59,
        () => 59
      ),
      when(
        (value) => value < 0,
        () => 0
      ),
      (value) => {
        setSecond(value)
        props.onChange?.(minute * 60 + value)
      }
    )
  }

  useEffect(() => {
    setMinute(() => Math.floor(props.value / 60))
    setSecond(() => props.value % 60)
  }, [props.value])

  return (
    <div
      className={pipe(
        [
          'heading-3xl',
          'text-ink',
          'flex',
          'gap-1',
          'items-center',
          'justify-center',
          'cursor-pointer',
          'focus:outline-none',
        ],
        concat([props.className || '']),
        join(' ')
      )}
    >
      <Form.Input
        value={`${Number(minute)}`}
        type="number"
        onChange={onMinuteChange}
        onFocus={(event) => event.target.select()}
        max={3}
        min={0}
        name={`${props.name}-minute`}
        className={pipe(
          ['heading-3xl', 'text-ink', 'w-full'],
          concat(['[&_input]:text-center']),
          join(' ')
        )}
      />
      <span className="px-2">:</span>
      <Form.Input
        value={`${second < 10 ? `0${second}` : second}`}
        onChange={onSecondChange}
        onFocus={(event) => event.target.select()}
        type="number"
        max={59}
        min={0}
        name={`${props.name}-second`}
        className={pipe(
          ['heading-3xl', 'text-ink', 'w-full'],
          concat(['[&_input]:text-center']),
          join(' ')
        )}
      />

      {/* <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={pipe(
          [
            'heading-3xl',
            'text-ink',
            'flex',
            'gap-1',
            'items-center',
            'justify-center',
            'cursor-pointer',
            'focus:outline-none',
          ],
          concat([props.className || '']),
          join(' ')
        )}
      >
        <span className="flex-1 text-center">{minute}</span>
        <span className="px-2">:</span>
        <span className="flex-1 text-center tracking-widest">
          {second < 10 ? `0${second}` : second}
        </span>
      </button> */}
    </div>
  )
}

export default Input
