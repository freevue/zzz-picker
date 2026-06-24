import React from 'react'

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled,
  ...rest
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  }

  const baseClasses = 'font-bold tracking-widest rounded-lg transition-all duration-200 focus:outline-none select-none cursor-pointer flex items-center justify-center gap-2'
  
  const variantClasses = {
    primary: disabled
      ? 'bg-[var(--color-disabled)]/10 text-[var(--color-ink)]/20 border border-[var(--color-disabled)]/20 cursor-not-allowed'
      : 'bg-transparent text-[var(--color-primary)] border border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 hover:shadow-[var(--v3-magenta-glow)] active:scale-95',
    secondary: disabled
      ? 'bg-[var(--color-disabled)]/10 text-[var(--color-ink)]/20 border border-[var(--color-disabled)]/20 cursor-not-allowed'
      : 'bg-transparent text-[var(--color-secondary)] border border-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/10 hover:shadow-[var(--v3-border-glow)] active:scale-95',
    neutral: disabled
      ? 'bg-[var(--color-disabled)]/10 text-[var(--color-ink)]/20 cursor-not-allowed'
      : 'bg-[var(--color-netural)] text-[var(--color-ink)] hover:bg-[var(--color-netural)]/80 active:scale-95 border border-[var(--color-netural)]/50',
  }

  return (
    <button
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
