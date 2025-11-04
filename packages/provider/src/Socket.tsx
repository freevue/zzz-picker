import { supabase } from './utils'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { createContext, useEffect, useRef } from 'react'

type Context = {
  send: (payload: Record<string, any>) => void
  receive: (callback: (payload: Record<string, any>) => void) => void
}
type Props = {
  children: React.ReactNode
}
export const Context = createContext<Context>({
  send: () => {},
  receive: () => {},
})

const Provider: React.FC<Props> = (props) => {
  const channelName = useRef<string>(`room:zzz:pick:chanel`)
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    channelRef.current = supabase.channel(channelName.current)
    channelRef.current.subscribe((status) => {
      console.log('Channel status:', status)
      // status가 'SUBSCRIBED'일 때 send가 정상적으로 작동합니다
    })
    // .on('broadcast', { event: 'message' }, (payload) => {
    //   console.log(payload)
    // })

    return () => {
      channelRef.current?.unsubscribe()
    }
  }, [])

  return (
    <Context.Provider
      value={{
        send: (payload) => {
          if (!channelRef.current) return

          channelRef.current.send({
            type: 'broadcast',
            event: 'message',
            payload,
          })
        },
        receive: (callback) => {
          if (!channelRef.current) return

          channelRef.current.on('broadcast', { event: 'message' }, callback)
        },
      }}
    >
      {props.children}
    </Context.Provider>
  )
}

export default Provider
