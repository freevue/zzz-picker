import { Context as SocketContext } from '../Socket'
import { peek, pipe, each, values } from '@fxts/core'
import { REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js'
import { SOCKET_EVENT } from '@zzz-picker/constant'
import { useContext, useEffect, useState } from 'react'

type Receive = (event: SOCKET_EVENT, payload: Record<string, any>) => void

const useSocket = (receive: Receive) => {
  const [status, setStatus] = useState<REALTIME_SUBSCRIBE_STATES>(REALTIME_SUBSCRIBE_STATES.CLOSED)
  const { channel } = useContext(SocketContext)

  useEffect(() => {
    pipe(
      SOCKET_EVENT,
      values,
      each((event) => {
        channel.on('broadcast', { event }, ({ event, payload }) => {
          receive(event as SOCKET_EVENT, payload)
        })
      })
    )

    channel.subscribe(setStatus, 10_000)

    return () => {
      channel.unsubscribe()
    }
  }, [channel])

  return {
    status,
    send: (event: SOCKET_EVENT, payload: Record<string, any>) => {
      channel.send({ type: 'broadcast', event, payload })
    },
  }
}

export default useSocket
