import { usePlay } from '@/hooks'
import { pipe, concat, join } from '@fxts/core'
import type { RoundId, Side } from '@zzz-picker/constant'
import { useEffect, useMemo, useRef, useState } from 'react'

type Props = {
  roundId: RoundId
  side: Side
}

const Time: React.FC<Props> = (props) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { state, setState } = usePlay()
  const [minute, setMinute] = useState(0)
  const [second, setSecond] = useState(0)
  const value = useMemo(() => {
    return state[props.roundId][props.side].time
  }, [props.roundId, props.side])

  const time = useMemo(() => {
    return minute * 60 + second
  }, [minute, second])
  useEffect(() => {
    if (value === 0) {
      setMinute(0)
      setSecond(0)
    }
  }, [value])

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
  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.value = `${Number(event.target.value)}`
  }

  useEffect(() => {
    timerRef.current && clearInterval(timerRef.current)
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      // setRoundResultTime(props.roundId, props.side, time)
    }, 300)
  }, [time])

  return (
    <div
      className={pipe(
        ['text-xl', 'font-extrabold', 'text-foreground', 'w-60', 'flex', 'items-center', 'gap-4'],
        join(' ')
      )}
    >
      <label className="flex-1">
        <input
          placeholder="분"
          className={pipe(
            [
              'border-2',
              'w-full',
              'text-center',
              'px-4',
              'py-2',
              'border-foreground',
              'block',
              'focus:outline-none',
              'focus:border-secondary',
            ],
            concat(props.side === 'B' ? ['rounded-tl-2xl'] : []),
            join(' ')
          )}
          type="number"
          name={`${props.roundId}-${props.side}-time-minute`}
          onChange={onMinuteChange}
          onFocus={onFocus}
          onBlur={onBlur}
          min={0}
          max={3}
          value={minute}
          step="1"
          onWheel={(event) => event.currentTarget.blur()}
        />
      </label>
      <span className="text-center">:</span>
      <label className="flex-1">
        <input
          placeholder="초"
          className={pipe(
            [
              'border-2',
              'w-full',
              'text-center',
              'px-4',
              'py-2',
              'border-foreground',
              'block',
              'focus:outline-none',
              'focus:border-secondary',
            ],
            concat(props.side === 'A' ? ['rounded-tr-2xl'] : []),
            join(' ')
          )}
          type="number"
          name={`${props.roundId}-${props.side}-time-second`}
          onChange={onSecondChange}
          onFocus={onFocus}
          onBlur={onBlur}
          min={0}
          max={59}
          value={second}
          step="1"
          onWheel={(event) => event.currentTarget.blur()}
        />
      </label>
    </div>
  )
}

export default Time
