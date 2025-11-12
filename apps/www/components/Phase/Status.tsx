import type { Rols, RealtimeState } from '.'
import { pipe, concat, join, entries, map, toArray } from '@fxts/core'
import { SOCKET_EVENT } from '@zzz-picker/constant'
import { useSocket } from '@zzz-picker/provider/hooks'
import { REALTIME_SUBSCRIBE_STATES } from '@zzz-picker/provider/realtime'
import { useEffect, useState } from 'react'

type Props = {
  role: Rols
  state: RealtimeState
}

const Status: React.FC<Props> = (props) => {
  const [roleStatus, setRoleStatus] = useState({
    A: REALTIME_SUBSCRIBE_STATES.CLOSED,
    B: REALTIME_SUBSCRIBE_STATES.CLOSED,
    H: REALTIME_SUBSCRIBE_STATES.CLOSED,
  })
  const { status, send } = useSocket(
    (payload) => {
      setRoleStatus((prev) => ({ ...prev, [payload.role]: status }))
      send(SOCKET_EVENT.SYNC, { aa: 1 })
    },
    { event: [SOCKET_EVENT.JOIN] }
  )

  useEffect(() => {
    setRoleStatus((prev) => ({ ...prev, [props.role]: status }))
  }, [status, props.role])

  return (
    <div
      className={pipe(
        ['fixed', 'bottom-4', 'right-4', 'bg-content', 'text-ink', 'p-3'],
        concat(['rounded-xl']),
        join(' ')
      )}
    >
      {pipe(
        roleStatus,
        entries,
        map(([role, status]) => (
          <p key={role} className="body-sm text-ink/50">
            {role}: {status}
          </p>
        )),
        toArray
      )}
    </div>
  )
}

export default Status
