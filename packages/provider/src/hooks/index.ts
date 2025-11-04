import { StoreContext, SettingContext, PlayContext, RouterContext } from '../'
import { useContext, useMemo } from 'react'

export const useStore = () => {
  return useContext(StoreContext)
}

export const useAgent = (id: number) => {
  const { agents } = useContext(StoreContext)

  return useMemo(() => agents.get(id), [agents, id])
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
