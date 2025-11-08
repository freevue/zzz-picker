import Ban from './Ban'
import { SOCKET_EVENT } from '@zzz-picker/constant'
import { useSocket } from '@zzz-picker/provider/hooks'
import { useEffect } from 'react'

// const STEP = ['join', 'ban1', 'ban2', 'pick1', 'pick2']

const Phase: React.FC = () => {
  const { status, send } = useSocket((event, { payload }) => {
    console.log(event, payload)
  })

  useEffect(() => {
    if (status === 'SUBSCRIBED') {
      send(SOCKET_EVENT.JOIN, { nickname: 'test' })
    }
  }, [status])

  return (
    <>
      <Ban />
    </>
  )
}

export default Phase
