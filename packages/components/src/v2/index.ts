import { useMemo } from 'react'

export * as Agent from './Agent'
export * as Form from './Form'

export const useRoundedSize = (size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => {
  return useMemo(() => {
    switch (size) {
      case 'xs':
        return 'size-20 rounded-bl-2xl rounded-tr-2xl'
      case 'sm':
        return 'size-24 rounded-bl-3xl rounded-tr-3xl'
      case 'md':
        return 'size-28 rounded-bl-3xl rounded-tr-3xl'
      case 'lg':
        return 'size-32 rounded-bl-4xl rounded-tr-4xl'
      case 'xl':
        return 'size-36 rounded-bl-4xl rounded-tr-4xl'
      default:
        return 'size-28 rounded-bl-3xl rounded-tr-3xl'
    }
  }, [size])
}
