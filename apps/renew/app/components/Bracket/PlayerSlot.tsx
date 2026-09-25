import React from 'react'
import { pipe, concat, join } from '@fxts/core'

type Props = {
  slot: 'A' | 'B'
  name: string
  isWinner: boolean
  isLoser: boolean
  disabled: boolean
  onNameChange: (name: string) => void
  onToggleWin: () => void
}

const PlayerSlot: React.FC<Props> = (props) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onNameChange(e.target.value)
  }

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    props.onToggleWin()
  }

  const onMouseDownInput = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation()
  }

  const slotClassName = pipe(
    [
      'flex',
      'items-center',
      'justify-between',
      'gap-2',
      'p-3',
      'rounded-2xl',
      'transition-all',
    ],
    concat(
      props.isWinner
        ? ['bg-primary/20', 'text-primary']
        : props.isLoser
          ? ['bg-neutral/30', 'grayscale', 'opacity-30']
          : ['bg-accent', 'text-ink']
    ),
    join(' ')
  )

  const winBtnClassName = pipe(
    [
      'px-3',
      'py-1.5',
      'rounded-xl',
      'text-xs',
      'font-black',
      'ft-pre',
      'transition-all',
      'shrink-0',
    ],
    concat(
      props.isWinner
        ? ['bg-primary', 'text-[#16181f]', 'cursor-pointer']
        : props.disabled
          ? ['bg-neutral', 'text-disabled', 'cursor-not-allowed', 'opacity-40']
          : ['bg-elevated', 'text-ink', 'hover:bg-primary', 'hover:text-[#16181f]', 'cursor-pointer']
    ),
    join(' ')
  )

  return (
    <div className={slotClassName}>
      <input
        type="text"
        value={props.name}
        onChange={onChange}
        onMouseDown={onMouseDownInput}
        placeholder={`${props.slot}선수 닉네임`}
        className="bg-transparent text-sm font-bold ft-pre outline-none w-full placeholder:text-disabled select-text"
      />
      <button
        type="button"
        disabled={props.disabled}
        onClick={onClick}
        className={winBtnClassName}
      >
        승리
      </button>
    </div>
  )
}

export default PlayerSlot
