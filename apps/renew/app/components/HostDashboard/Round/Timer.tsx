import { pipe, join, concat, max, min, filter, isNumber, when } from '@fxts/core'
import { useMemo, useRef, useState } from 'react'
import { useMatch } from '~/hooks'
import { PlayerRole } from '~/type'

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
  const { play } = useMatch()
  // const minute = useMemo(() => {
  //   return Math.floor(time[props.round][props.role] / 60)
  // }, [time, props.role, props.round])
  // const second = useMemo(() => {
  //   return Math.floor(time[props.round][props.role] % 60)
  // }, [time, props.role, props.round])

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    pipe(
      Number(event.currentTarget.value),
      when(
        () => event.currentTarget.name === 'minute',
        (value) => value * 60
      ),
      (value) => {
        console.log(value)
      }
    )
  }

  return (
    <div className="flex bg-accent h-14 items-center border-solid border-primary rounded-2xl w-48">
      <Input value={0} min={0} max={3} onChange={onChange} name="minute" />
      <p className="text-4xl font-bold ft-ria">:</p>
      <Input value={0} min={0} max={59} onChange={onChange} name="second" />
    </div>
  )
}

export default Timer
