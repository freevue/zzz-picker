import type { Rols } from '.'
import { pipe, concat, join, entries, map, toArray } from '@fxts/core'
import { SOCKET_EVENT } from '@zzz-picker/constant'
import { useSocket } from '@zzz-picker/provider/hooks'
import { REALTIME_SUBSCRIBE_STATES } from '@zzz-picker/provider/realtime'
import { useEffect, useState } from 'react'

type Props = {
  role: Rols
}

const Status: React.FC<Props> = (props) => {
  const [roleStatus, setRoleStatus] = useState({
    A: REALTIME_SUBSCRIBE_STATES.CLOSED,
    B: REALTIME_SUBSCRIBE_STATES.CLOSED,
    H: REALTIME_SUBSCRIBE_STATES.CLOSED,
  })
  const { status } = useSocket(
    (payload) => {
      setRoleStatus((prev) => ({ ...prev, [payload.role]: status }))
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
          <div key={role}>
            <p className="body-sm text-ink/50">
              {role}: {status}
            </p>
          </div>
        )),
        toArray
      )}
    </div>
  )
}

export default Status
