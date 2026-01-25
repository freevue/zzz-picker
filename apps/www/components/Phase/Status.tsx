import type { Rols, RoomData } from '.'
import { pipe, concat, join } from '@fxts/core'
import { SOCKET_EVENT, type Side } from '@zzz-picker/constant'
import { useSocket } from '@zzz-picker/provider/hooks'
import { REALTIME_SUBSCRIBE_STATES } from '@zzz-picker/provider/realtime'
import { useEffect } from 'react'

type Props = {
  role: Rols
  room: RoomData
}

const Status: React.FC<Props> = (props) => {
  const { status, send } = useSocket(undefined, { event: [SOCKET_EVENT.JOIN] })

  useEffect(() => {
    if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
      send(SOCKET_EVENT.JOIN, { role: props.role })
    }
  }, [status, props.role]) // props.role 추가

  return (
    <div
      className={pipe(
        ['fixed', 'bottom-4', 'right-4', 'bg-content', 'text-ink', 'p-3'],
        concat(['rounded-xl', 'border-2', 'border-primary/20', 'z-50']),
        join(' ')
      )}
    >
      <div className="flex flex-col gap-1">
        {props.room.users.map((user) => {
          const roleKey = user.role === 'Host' ? 'H' : (user.role as Side)
          const isOnline = !!props.room.state.status[roleKey]

          return (
            <div key={user.id} className="flex items-center gap-2">
              <div
                className={pipe(
                  ['w-2', 'h-2', 'rounded-full'],
                  concat(
                    isOnline
                      ? ['bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.6)]']
                      : ['bg-ink/20']
                  ),
                  join(' ')
                )}
              />
              <p
                className={pipe(
                  ['body-sm'],
                  concat(isOnline ? ['text-ink'] : ['text-ink/30']),
                  join(' ')
                )}
              >
                {roleKey} ({user.nickname}): {isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          )
        })}
      </div>
      <div className="mt-2 pt-2 border-t border-ink/5 opacity-30 text-[10px] text-right">
        Socket: {status}
      </div>
    </div>
  )
}

export default Status
