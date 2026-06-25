import React from 'react'
import { Increase } from '../Increase'

type NumberProps = {
  value: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
  prefix?: string
  suffix?: string
  fixed?: number
  className?: string
} & React.HTMLAttributes<HTMLSpanElement>

const sizeClasses = {
  sm: 'text-sm font-bold',
  md: 'text-xl font-extrabold',
  lg: 'text-3xl font-black',
  xl: 'text-5xl font-black',
}

export const Number: React.FC<NumberProps> = ({
  value,
  size = 'md',
  animated = false,
  prefix = '',
  suffix = '',
  fixed = 0,
  className = '',
  ...rest
}) => {
  const colorClass = 'text-[var(--color-secondary)] font-mono tracking-wide'

  if (animated) {
    return (
      <span className={`${sizeClasses[size]} ${colorClass} ${className}`} {...rest}>
        {prefix && <span className="text-[var(--color-ink)]/50 mr-1">{prefix}</span>}
        <Increase value={value} fixed={fixed} />
        {suffix && <span className="text-[var(--color-ink)]/50 ml-1">{suffix}</span>}
      </span>
    )
  }

  const formatted = value.toLocaleString('ko-KR', {
    minimumFractionDigits: fixed,
    maximumFractionDigits: fixed,
  })

  return (
    <span className={`${sizeClasses[size]} ${colorClass} ${className}`} {...rest}>
      {prefix && <span className="text-[var(--color-ink)]/50 mr-1">{prefix}</span>}
      {formatted}
      {suffix && <span className="text-[var(--color-ink)]/50 ml-1">{suffix}</span>}
    </span>
  )
}

export default Number
