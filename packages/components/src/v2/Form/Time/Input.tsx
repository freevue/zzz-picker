import Form from '../'
import { pipe, concat, join } from '@fxts/core'
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
    setMinute(Number(event.target.value))

    props.onChange?.(Number(event.target.value) * 60 + second)
  }
  const onSecondChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSecond(Number(event.target.value))

    props.onChange?.(minute * 60 + Number(event.target.value))
  }

  useEffect(() => {
    setMinute(() => {
      const value = Math.floor(props.value / 60)

      if (value > 3) return 3
      if (value < 0) return 0

      return value
    })
    setSecond(() => {
      const value = props.value % 60

      if (value > 59) return 59
      if (value < 0) return 0

      return value
    })
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
        max={3}
        min={0}
        name={`${props.name}-minute`}
        className={pipe(['heading-3xl', 'text-ink'], concat(['[&_input]:text-center']), join(' '))}
      />
      <span className="px-2">:</span>
      <Form.Input
        value={`${second < 10 ? `0${second}` : second}`}
        onChange={onSecondChange}
        type="number"
        max={59}
        min={0}
        name={`${props.name}-second`}
        className={pipe(['heading-3xl', 'text-ink'], concat(['[&_input]:text-center']), join(' '))}
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
