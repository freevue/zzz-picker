import React from 'react'

type DividerProps = {
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  className = ''
}) => {
  if (orientation === 'vertical') {
    return (
      <div 
        className={`w-[1px] self-stretch bg-gradient-to-b from-transparent via-[var(--color-netural)] to-transparent ${className}`} 
      />
    )
  }

  return (
    <div 
      className={`h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--color-netural)] to-transparent ${className}`} 
    />
  )
}

export default Divider
