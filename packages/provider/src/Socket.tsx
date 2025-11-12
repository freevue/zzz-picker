import { supabase } from './utils'
import { each, pipe, values } from '@fxts/core'
import { REALTIME_SUBSCRIBE_STATES, type RealtimeChannel } from '@supabase/supabase-js'
import { SOCKET_EVENT } from '@zzz-picker/constant'
import { createContext, useEffect, useMemo, useRef, useState } from 'react'

type Context = {
  events: EventTarget
  channel: RealtimeChannel | null
  status: REALTIME_SUBSCRIBE_STATES
}
type Props = {
  children: React.ReactNode
  channelId: string
}

const state: Context = {
  events: new EventTarget(),
  channel: null,
  status: REALTIME_SUBSCRIBE_STATES.CLOSED,
}

export const Context = createContext<Context>(state)

const Provider: React.FC<Props> = (props) => {
  const events = useRef(new EventTarget())
  const [status, setStatus] = useState<REALTIME_SUBSCRIBE_STATES>(REALTIME_SUBSCRIBE_STATES.CLOSED)

  const channel = useMemo(() => {
    return supabase.channel(`room:zzz:pick:${props.channelId}`, {
      config: {
        broadcast: { self: false },
      },
    })
  }, [props.channelId])

  useEffect(() => {
    pipe(
      SOCKET_EVENT,
      values,
      each((event) => {
        channel.on('broadcast', { event }, ({ event, payload }) => {
          events.current.dispatchEvent(
            new CustomEvent<Record<string, any>>(event, { detail: payload })
          )
        })
      })
    )

    channel.subscribe(setStatus, 10_000)

    return () => {
      channel.unsubscribe()
    }
  }, [channel])

  return (
    <Context.Provider
      value={{
        events: events.current,
        channel,
        status,
      }}
    >
      {props.children}
    </Context.Provider>
  )
}

export default Provider
