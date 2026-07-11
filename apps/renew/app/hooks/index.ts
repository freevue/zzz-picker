import { useContext } from 'react'
import { StoreContext, MatchStateContext } from '~/provider'

export const useStore = () => {
  return useContext(StoreContext)
}

export const useMatchState = () => {
  return useContext(MatchStateContext)
}
