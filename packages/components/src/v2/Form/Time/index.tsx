import { Dialog } from '../../'
import Scroll from './Scroll'
import { pipe, concat, join } from '@fxts/core'
import { useEffect, useState } from 'react'

type Props = {
  value: number
  onChange?: (value: number) => void
}

const Time: React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [minute, setMinute] = useState(0)
  const [second, setSecond] = useState(0)

  const onMinuteChange = (value: number) => {
    setMinute(value)

    props.onChange?.(value * 60 + second)
  }
  const onSecondChange = (value: number) => {
    setSecond(value)

    props.onChange?.(minute * 60 + value)
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
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={pipe(
          ['heading-4xl', 'text-ink', 'flex', 'gap-1', 'items-center', 'justify-center'],
          concat(['']),
          join(' ')
        )}
      >
        <span>{minute < 10 ? `0${minute}` : minute}</span>
        <span>:</span>
        <span>{second < 10 ? `0${second}` : second}</span>
      </button>
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex items-center gap-1 justify-center">
          <Scroll range={4} value={minute} onChange={onMinuteChange} />
          <span className="text-ink heading-4xl">:</span>
          <Scroll range={60} value={second} onChange={onSecondChange} />
        </div>
      </Dialog>
    </>
  )
}

export default Time
