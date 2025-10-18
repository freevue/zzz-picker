import { StoreContext } from '@zzz-picker/provider'
import { useContext } from 'react'

export { default as useAgents } from './useAgents'
export { default as useBan } from './useBan'
export { default as usePlay } from './usePlay'
export { default as useSetting } from './useSetting'
export { default as useScore } from './useScore'

export const useStore = () => {
  return useContext(StoreContext)
}
