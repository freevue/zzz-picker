import { pipe, join, concat, max, min, filter, isNumber, when } from '@fxts/core'
import { useState } from 'react'

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
const Timer: React.FC = () => {
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
    <div className="flex bg-accent h-14 items-center border-solid border-primary rounded-2xl w-46">
      <Input min={0} max={3} onChange={onChange} name="minute" />
      <p className="text-4xl font-bold ft-ria">:</p>
      <Input min={0} max={59} onChange={onChange} name="second" />
    </div>
  )
}

export default Timer
