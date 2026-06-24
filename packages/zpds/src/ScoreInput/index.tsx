import React from 'react'
import { Increase } from '../Increase'

type ScoreInputProps = {
  value: number
  onChange: (val: number) => void
  label?: string
  className?: string
}

export const ScoreInput: React.FC<ScoreInputProps> = ({
  value,
  onChange,
  label = '라운드 획득 점수 기입',
  className = ''
}) => {
  const onIncrement = (amount: number) => {
    onChange(Math.max(0, value + amount))
  }

  return (
    <div className={`flex flex-col gap-3 bg-[var(--color-content)] p-4.5 rounded-2xl border border-[var(--color-netural)]/60 shadow-[var(--v3-border-glow)] ${className}`}>
      {/* 타이틀 및 애니메이션 수치 미리보기 */}
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-black text-[var(--color-ink)]/50 tracking-wider uppercase">{label}</span>
        <div className="text-3xl font-black text-[var(--color-secondary)] tracking-wide font-mono">
          <Increase value={value} />
        </div>
      </div>

      {/* 수동 인풋 및 컨트롤러 */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onIncrement(-100)}
          className="px-2.5 py-2 rounded-lg bg-[var(--color-base)] text-xs text-[var(--color-ink)]/60 hover:text-[var(--color-tertiary)] border border-[var(--color-netural)] cursor-pointer"
        >
          -100
        </button>
        <button
          type="button"
          onClick={() => onIncrement(-10)}
          className="px-2.5 py-2 rounded-lg bg-[var(--color-base)] text-xs text-[var(--color-ink)]/60 hover:text-[var(--color-tertiary)] border border-[var(--color-netural)] cursor-pointer"
        >
          -10
        </button>
        
        <input
          type="number"
          value={value === 0 ? '' : value}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
          placeholder="0"
          className="bg-[var(--color-base)] text-[var(--color-ink)] text-center font-bold text-lg rounded-xl py-1.5 px-3 flex-1 border border-[var(--color-netural)] outline-none focus:border-[var(--color-secondary)] transition-all"
        />

        <button
          type="button"
          onClick={() => onIncrement(10)}
          className="px-2.5 py-2 rounded-lg bg-[var(--color-base)] text-xs text-[var(--color-ink)]/60 hover:text-[var(--color-secondary)] border border-[var(--color-netural)] cursor-pointer"
        >
          +10
        </button>
        <button
          type="button"
          onClick={() => onIncrement(100)}
          className="px-2.5 py-2 rounded-lg bg-[var(--color-base)] text-xs text-[var(--color-ink)]/60 hover:text-[var(--color-secondary)] border border-[var(--color-netural)] cursor-pointer"
        >
          +100
        </button>
      </div>
    </div>
  )
}

export default ScoreInput
