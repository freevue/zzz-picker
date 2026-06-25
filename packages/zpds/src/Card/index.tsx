import React from 'react'

type CardProps = {
  variant?: 'default' | 'elevated' | 'outline'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  className = '',
  children,
  ...rest
}) => {
  const variantClasses = {
    default: 'bg-[var(--color-content)] border-[var(--color-netural)]/60',
    elevated: 'bg-[var(--color-elevated,var(--color-netural))] border-[var(--color-netural)]/40',
    outline: 'bg-transparent border-[var(--color-netural)]',
  }

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  }

  return (
    <div
      className={`rounded-2xl border ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}

export default Card
