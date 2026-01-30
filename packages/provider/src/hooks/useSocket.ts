import { Context as SocketContext } from '../Socket'
import { pipe, each, values, includes, filter } from '@fxts/core'
import { SOCKET_EVENT } from '@zzz-picker/constant'
import { useContext, useEffect, useRef } from 'react'

type Receive = (payload: Record<string, any>, eventName: SOCKET_EVENT) => void
type Options = {
  event: Array<SOCKET_EVENT>
}

const useSocket = (receive?: Receive, options?: Options) => {
  const { channel, status, events } = useContext(SocketContext)
  const receiveRef = useRef(receive)

  if (!channel) {
    throw new Error('채널에 연결되지 않았습니다.')
  }

  useEffect(() => {
    receiveRef.current = receive
  }, [receive])

  useEffect(() => {
    const onSocket = (event: Event) => {
      receiveRef.current?.(
        (event as CustomEvent<Record<string, any>>).detail,
        event.type as SOCKET_EVENT
      )
    }

    const targetEvents = options?.event || values(SOCKET_EVENT)

    pipe(
      targetEvents,
      each((eventName) => {
        events.addEventListener(eventName, onSocket)
      })
    )

    return () => {
      pipe(
        targetEvents,
        each((eventName) => {
          events.removeEventListener(eventName, onSocket)
        })
      )
    }
  }, [channel, events, JSON.stringify(options?.event)])

  return {
    status,
    send: (event: SOCKET_EVENT, payload: Record<string, any>) => {
      channel.send({ type: 'broadcast', event, payload })
    },
  }
}

export default useSocket
