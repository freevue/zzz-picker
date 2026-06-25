import React from 'react'

export { Number } from './Number'
export { AgentName } from './AgentName'

type HeadingProps = {
  level?: 'huge' | '6xl' | '5xl' | '4xl' | '3xl' | '2xl' | 'xl' | 'lg' | 'md'
  className?: string
  children: React.ReactNode
} & React.HTMLAttributes<HTMLHeadingElement>

export const Heading: React.FC<HeadingProps> = ({ level = 'xl', className = '', children, ...rest }) => {
  const levelClass = (() => {
    switch (level) {
      case 'huge': return 'heading-huge'
      case '6xl': return 'heading-6xl'
      case '5xl': return 'heading-5xl'
      case '4xl': return 'heading-4xl'
      case '3xl': return 'heading-3xl'
      case '2xl': return 'heading-2xl'
      case 'xl': return 'heading-xl'
      case 'lg': return 'heading-lg'
      case 'md': return 'heading-md'
      default: return 'heading-xl'
    }
  })()

  return (
    <h3 className={`${levelClass} text-[var(--color-primary)] font-black tracking-wide ${className}`} {...rest}>
      {children}
    </h3>
  )
}

type BodyProps = {
  size?: '3xl' | '2xl' | 'xl' | 'lg' | 'md' | 'sm'
  className?: string
  children: React.ReactNode
} & React.HTMLAttributes<HTMLSpanElement>

export const Body: React.FC<BodyProps> = ({ size = 'md', className = '', children, ...rest }) => {
  const sizeClass = (() => {
    switch (size) {
      case '3xl': return 'body-3xl'
      case '2xl': return 'body-2xl'
      case 'xl': return 'body-xl'
      case 'lg': return 'body-lg'
      case 'md': return 'body-md'
      case 'sm': return 'body-sm'
      default: return 'body-md'
    }
  })()

  return (
    <span className={`${sizeClass} text-[var(--color-ink)]/90 tracking-normal ${className}`} {...rest}>
      {children}
    </span>
  )
}
