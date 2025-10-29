import { StoreContext, SettingContext, PlayContext } from '@zzz-picker/provider'
import { useContext } from 'react'

export const useStore = () => {
  return useContext(StoreContext)
}

export const useAgent = (id: number) => {
  const { gqlAgents } = useContext(StoreContext)

  return gqlAgents.get(id)
}

export const useSetting = () => {
  return useContext(SettingContext)
}

export const usePlay = () => {
  return useContext(PlayContext)
}
