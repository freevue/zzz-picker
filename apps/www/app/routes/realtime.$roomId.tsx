import { pipe } from '@fxts/core'
import { useParams } from '@remix-run/react'
import { verifyJWT } from '@zzz-picker/utils'
import { useEffect } from 'react'
import { Phase } from '~/components'

const RealtimeRoom: React.FC = () => {
  const { roomId } = useParams()

  useEffect(() => {
    pipe(verifyJWT(roomId!), (payload) => {
      console.log(payload)
    })
  }, [roomId])
  return <Phase />
}

export default RealtimeRoom
