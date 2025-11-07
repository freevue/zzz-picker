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

export const useSocket = (receive: (payload: Record<string, any>) => void) => {
  const [status, setStatus] = useState<REALTIME_SUBSCRIBE_STATES>(REALTIME_SUBSCRIBE_STATES.CLOSED)
  const { channel } = useContext(SocketContext)

  useEffect(() => {
    channel.on('broadcast', { event: 'message' }, receive).subscribe(setStatus, 10_000)

    return () => {
      channel.unsubscribe()
    }
  }, [channel])

  return {
    status,
    send: (payload: Record<string, any>) => {
      channel.send({
        type: 'broadcast',
        event: 'message',
        payload,
      })
    },
  }
}
