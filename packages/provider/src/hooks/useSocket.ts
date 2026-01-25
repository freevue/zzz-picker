import { Context as SocketContext } from '../Socket'
import { pipe, each, values, includes, filter } from '@fxts/core'
import { SOCKET_EVENT } from '@zzz-picker/constant'
import { useContext, useEffect } from 'react'

type Receive = (payload: Record<string, any>, eventName: SOCKET_EVENT) => void
type Options = {
  event: Array<SOCKET_EVENT>
}

const useSocket = (receive?: Receive, options?: Options) => {
  const { channel, status, events } = useContext(SocketContext)

  if (!channel) {
    throw new Error('채널에 연결되지 않았습니다.')
  }

  useEffect(() => {
    const onSocket = (event: Event) => {
      receive?.((event as CustomEvent<Record<string, any>>).detail, event.type as SOCKET_EVENT)
    }

    pipe(
      SOCKET_EVENT,
      values,
      filter((eventName) => options?.event && includes(eventName, options.event)),
      each((eventName) => {
        events.addEventListener(eventName, onSocket)
      })
    )

    return () => {
      pipe(
        SOCKET_EVENT,
        values,
        each((eventName) => {
          events.removeEventListener(eventName, onSocket)
        })
      )
    }
  }, [options?.event])

  return {
    status,
    send: (event: SOCKET_EVENT, payload: Record<string, any>) => {
      channel.send({ type: 'broadcast', event, payload })
    },
  }
}

export default useSocket
