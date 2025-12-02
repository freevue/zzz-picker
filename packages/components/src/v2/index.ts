import { useMemo } from 'react'

export * as Agent from './Agent'
export * as Typo from './Typo'
export { default as Form } from './Form'
export { default as Dialog } from './Dialog'
export { default as Tabs } from './Tabs'
export { default as Table } from './Table'
export { default as Tooltip } from './Tooltip'
export { default as Increase } from './Increase'

export const useRoundedSize = (size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl', reverse?: boolean) => {
  const rounded = useMemo(() => {
    switch (size) {
      case 'xs':
        return reverse ? 'rounded-tl-2xl rounded-br-2xl' : 'rounded-bl-2xl rounded-tr-2xl'
      case 'sm':
        return reverse ? 'rounded-tl-3xl rounded-br-3xl' : 'rounded-bl-3xl rounded-tr-3xl'
      case 'md':
        return reverse ? 'rounded-tl-3xl rounded-br-3xl' : 'rounded-bl-3xl rounded-tr-3xl'
      case 'lg':
        return reverse ? 'rounded-tl-4xl rounded-br-4xl' : 'rounded-bl-4xl rounded-tr-4xl'
      case 'xl':
        return reverse ? 'rounded-tl-4xl rounded-br-4xl' : 'rounded-bl-4xl rounded-tr-4xl'
      default:
        return reverse ? 'rounded-tl-2xl rounded-br-2xl' : 'rounded-bl-3xl rounded-tr-3xl'
    }
  }, [size, reverse])

  return useMemo(() => {
    switch (size) {
      case 'xs':
        return `size-20 ${rounded}`
      case 'sm':
        return `size-24 ${rounded}`
      case 'md':
        return `size-28 ${rounded}`
      case 'lg':
        return `size-32 ${rounded}`
      case 'xl':
        return `size-36 ${rounded}`
      default:
        return `size-28 ${rounded}`
    }
  }, [size, rounded])
}
