import { updateTime } from '@/lib/DB'
import { pipe, join, concat, max, min, filter, isNumber, when, map, fromEntries } from '@fxts/core'
import { useMemo, useRef } from 'react'
import { BroadcastEvent } from '~/constant'
import { useMatch } from '~/hooks'
import { Player, PlayerRole } from '~/type'

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    pipe(
      Number(event.currentTarget.value),
      (value) => [value, props.min],
      filter(isNumber),
      max,
      (value) => [value, props.max],
      filter(isNumber),
      min,
      (value) => {
        event.currentTarget.value = `${value}`

        props.onChange?.(event)
      }
    )
  }

  return (
    <input
      {...props}
      onChange={onInputChange}
      onFocus={(event) => event.currentTarget.select()}
      type="number"
      name={props.name}
      step={1}
      className={pipe(
        ['appearance-none', 'flex-1', 'w-20', 'h-full', 'px-4'],
        concat(['text-center', 'text-primary', 'text-2xl', 'ft-ria']),
        concat(['active:outline-0', 'focus:outline-0']),
        join(' ')
      )}
    />
  )
}

type Props = {
  role: PlayerRole
  round: number
  id: string
}

const Timer: React.FC<Props> = (props) => {
  const debounce = useRef<NodeJS.Timeout | null>(null)
  const { play, send } = useMatch()
  const minute = useMemo(() => {
    return Math.floor(play[props.role].time[props.round] / 60)
  }, [play, props.role, props.round])
  const second = useMemo(() => {
    return Math.floor(play[props.role].time[props.round] % 60)
  }, [play, props.role, props.round])

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debounce.current && clearTimeout(debounce.current)

    const value = pipe(
      Number(event.currentTarget.value),
      when(
        () => event.currentTarget.name === 'minute',
        (value) => value * 60
      ),
      (value) => {
        if (event.currentTarget.name === 'minute') return value + second

        return value + minute * 60
      }
    )
    const time = pipe(play[props.role].time, (list) => {
      list[props.round] = value

      return list
    })

    send(BroadcastEvent.TIME, {
      ...play,
      [props.role]: { ...play[props.role], time },
    })

    debounce.current = setTimeout(async () => {
      send(
        BroadcastEvent.TIME,
        await pipe(
          time,
          updateTime(play[props.role].id),
          map((play) => [play.role, play] as [PlayerRole, Player]),
          fromEntries
        )
      )

      debounce.current = null
    }, 1000)
  }

  return (
    <div className="flex bg-accent h-14 items-center border-solid border-primary rounded-2xl w-48">
      <Input value={minute} min={0} max={3} onChange={onChange} name="minute" />
      <p className="text-4xl font-bold ft-ria">:</p>
      <Input value={second} min={0} max={59} onChange={onChange} name="second" />
    </div>
  )
}

export default Timer
