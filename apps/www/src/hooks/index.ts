import { StoreContext, SettingContext, PlayContext } from '@zzz-picker/provider'
import { useContext } from 'react'

export const useStore = () => {
  return useContext(StoreContext)
}

export const useAgent = (id: number) => {
  const { agent } = useContext(StoreContext)

  return agent.get(id)
}

export const useSetting2 = () => {
  return useContext(SettingContext)
}

export const usePlay2 = () => {
  return useContext(PlayContext)
}
