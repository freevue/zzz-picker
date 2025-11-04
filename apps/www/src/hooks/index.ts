import { StoreContext, SettingContext, PlayContext, RouterContext } from '@zzz-picker/provider'
import { useContext } from 'react'

export const useStore = () => {
  return useContext(StoreContext)
}

export const useAgent = (id: number) => {
  const { agents } = useContext(StoreContext)

  return agents.get(id)
}

export const useSetting = () => {
  return useContext(SettingContext)
}

export const usePlay = () => {
  return useContext(PlayContext)
}

export const useRouter = () => {
  return useContext(RouterContext)
}
