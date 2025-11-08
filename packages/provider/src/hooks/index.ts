import { StoreContext, SettingContext, PlayContext } from '../'
import { Context as SocketContext } from '../Socket'
import { REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js'
import { useContext, useMemo, useEffect, useState } from 'react'

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

export { default as useSocket } from './useSocket'
