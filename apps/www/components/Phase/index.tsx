import Ban from './Ban'
import Status from './Status'
import { SOCKET_EVENT } from '@zzz-picker/constant'
import type { Side } from '@zzz-picker/constant'
// import type { SelectAgent } from '@zzz-picker/constant'
import { useSocket } from '@zzz-picker/provider/hooks'
import { REALTIME_SUBSCRIBE_STATES } from '@zzz-picker/provider/realtime'
import { useEffect, useEffectEvent, useState } from 'react'

export type Rols = Side | 'H'

type Props = {
  role: Rols
}
export type RealtimeState = {
  info: {
    A: {
      nickname: string
      state: REALTIME_SUBSCRIBE_STATES
    }
    B: {
      nickname: string
      state: REALTIME_SUBSCRIBE_STATES
    }
    H: {
      state: REALTIME_SUBSCRIBE_STATES
    }
  }
  // banList: Array<SelectAgent>
}

const DEFAULT_STATE: RealtimeState = {
  info: {
    A: {
      nickname: '',
      state: REALTIME_SUBSCRIBE_STATES.CLOSED,
    },
    B: {
      nickname: '',
      state: REALTIME_SUBSCRIBE_STATES.CLOSED,
    },
    H: {
      state: REALTIME_SUBSCRIBE_STATES.CLOSED,
    },
  },
}
const Phase: React.FC<Props> = (props) => {
  const [realtimeState, setRealtimeState] = useState<RealtimeState>(DEFAULT_STATE)
  const { status, send } = useSocket(
    (payload) => {
      setRealtimeState(payload as RealtimeState)
    },
    { event: [SOCKET_EVENT.SYNC] }
  )

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
      <Ban role={props.role} state={realtimeState} />
      <Status role={props.role} state={realtimeState} />
    </>
  )
}

export default Phase
