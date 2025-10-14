import { useScore } from '@/hooks'
import type { Side } from '@/types'
import { pipe, concat, join } from '@fxts/core'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'

type Props = {
  className?: string
  round: string
  side: Side
}

const Time: React.FC<Props> = (props) => {
  const { score, setTime } = useScore()
  const [minute, setMinute] = useState(0)
  const [second, setSecond] = useState(0)

  const value = useMemo(() => {
    return score.get(props.round)?.[props.side]?.time || 0
  }, [score, props.round, props.side])
  const timestamp = useMemo(() => {
    console.log(dayjs(`${minute}:${second}`, 'm:s').format('mm:ss'))

    return dayjs(`${minute}:${second}`, 'm:s')
  }, [minute, second])

  const onMinuteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    pipe(
      Number(event.target.value),
      (value) => {
        if (value > 3) return 3
        if (value < 0) return 0

        return value
      },
      (value) => {
        setMinute(value)
      }
    )
  }
  const onSecondChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    pipe(
      Number(event.target.value),
      (value) => {
        if (value > 59) return 59
        if (value < 0) return 0

        return value
      },
      (value) => {
        setSecond(value)
      }
    )
  }
  const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select()
  }

  useEffect(() => {
    console.log(timestamp)
  }, [timestamp])

  return (
    <div
      className={pipe(
        ['text-xl', 'font-bold', 'dark:text-text-primary', 'flex', 'items-center', 'gap-4', 'w-56'],
        concat([props.className || '']),
        join(' ')
      )}
    >
      <label className="flex-1">
        <input
          placeholder="분"
          className="border-2 w-full text-center px-4 py-2 border-text-primary block focus:outline-none focus:border-secondary"
          type="number"
          name={`${props.round}-${props.side}-time-minute`}
          onChange={onMinuteChange}
          onFocus={onFocus}
          min={0}
          max={3}
          value={minute}
        />
      </label>
      <span className="text-center">:</span>
      <label className="flex-1">
        <input
          placeholder="초"
          className="border-2 w-full text-center px-4 py-2 border-text-primary block focus:outline-none focus:border-secondary"
          type="number"
          name={`${props.round}-${props.side}-time-second`}
          onChange={onSecondChange}
          onFocus={onFocus}
          min={0}
          max={59}
          value={second}
        />
      </label>
    </div>
  )
}

export default Time
