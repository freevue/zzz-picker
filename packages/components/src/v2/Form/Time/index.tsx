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
  }
  const onSecondChange = (value: number) => {
    setSecond(value)
  }

  useEffect(() => {
    if (props.value >= 240) {
      setMinute(3)
      setSecond(0)

      return
    }
    if (props.value < 0) {
      setMinute(0)
      setSecond(0)

      return
    }

    setMinute(Math.floor(props.value / 60))
    setSecond(props.value % 60)
  }, [props.value])
  useEffect(() => {
    props.onChange?.(minute * 60 + second)
  }, [minute, second])

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
