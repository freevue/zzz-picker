import React from 'react'
import { Input } from '../Input'
import { Number as TypoNumber } from '../Typo/Number'

type NumberInputProps = {
  value: number
  onChange: (val: number) => void
  label?: string
  min?: number
  max?: number
  placeholder?: string
  showPreview?: boolean
  className?: string
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  label = '숫자 입력',
  min = 0,
  max,
  placeholder = '0',
  showPreview = true,
  className = '',
}) => {
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(e.target.value)
    if (Number.isNaN(raw)) return
    const clamped = max !== undefined ? Math.min(max, Math.max(min, raw)) : Math.max(min, raw)
    onChange(clamped)
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-black text-[var(--color-ink)]/50 tracking-wider uppercase">
          {label}
        </span>
        {showPreview && <TypoNumber value={value} size="lg" />}
      </div>

      <Input
        type="number"
        value={value === 0 ? '' : value}
        onChange={onInputChange}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full text-center font-bold text-lg"
      />
    </div>
  )
}

export default NumberInput
