import React from 'react'

type InputProps = {
  themeColor?: 'primary' | 'secondary'
} & React.InputHTMLAttributes<HTMLInputElement>

export const Input: React.FC<InputProps> = ({
  themeColor = 'secondary',
  className = '',
  ...rest
}) => {
  const borderFocusClass = themeColor === 'primary' 
    ? 'focus:border-[var(--color-primary)] focus:shadow-[var(--v3-magenta-glow)]'
    : 'focus:border-[var(--color-secondary)] focus:shadow-[var(--v3-border-glow)]'

  return (
    <input
      className={`bg-[var(--color-content)] text-[var(--color-ink)] border border-[var(--color-netural)] rounded-lg px-4 py-2.5 text-sm outline-none transition-all duration-200 shadow-inner placeholder:text-[var(--color-ink)]/30 ${borderFocusClass} ${className}`}
      {...rest}
    />
  )
}
