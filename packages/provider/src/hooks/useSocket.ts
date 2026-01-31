import { Context as SocketContext } from '../Socket'
import { SOCKET_EVENT } from '@zzz-picker/constant'
import { useContext, useEffect } from 'react'

const useSocket = (
  onMessage?: (payload: any, event: SOCKET_EVENT) => void,
  options?: { event: SOCKET_EVENT | SOCKET_EVENT[] }
) => {
  const context = useContext(SocketContext)

  useEffect(() => {
    if (!onMessage) return

    const { events: eventTarget } = context
    const eventsOption = options?.event
    const eventList = Array.isArray(eventsOption)
      ? eventsOption
      : eventsOption
        ? [eventsOption]
        : []

    const handler = (e: any) => {
      onMessage(e.detail, e.type as SOCKET_EVENT)
    }

    eventList.forEach((event) => {
      eventTarget.addEventListener(event, handler)
    })

    return () => {
      eventList.forEach((event) => {
        eventTarget.removeEventListener(event, handler)
      })
    }
  }, [context.events, onMessage, options?.event])

  return context
}

export default useSocket
