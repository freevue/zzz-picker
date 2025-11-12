import Ban from './Ban'
import Status from './Status'
import { SOCKET_EVENT } from '@zzz-picker/constant'
import type { Side } from '@zzz-picker/constant'
import { useSocket } from '@zzz-picker/provider/hooks'
import { REALTIME_SUBSCRIBE_STATES } from '@zzz-picker/provider/realtime'
import { useEffect, useEffectEvent } from 'react'

// const STEP = ['join', 'ban1', 'ban2', 'pick1', 'pick2']

export type Rols = Side | 'H'

type Props = {
  role: Rols
}

const Phase: React.FC<Props> = (props) => {
  const { status, send } = useSocket()

  const onJoinSend = useEffectEvent(() => {
    send(SOCKET_EVENT.JOIN, { role: props.role })
  })

  useEffect(() => {
    if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
      onJoinSend()
    }
  }, [status])

  return (
    <>
      <Ban />
      <Status role={props.role} />
    </>
  )
}

export default Phase
