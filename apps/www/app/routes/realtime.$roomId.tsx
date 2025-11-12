import { pipe } from '@fxts/core'
import { useParams, useSearchParams } from '@remix-run/react'
import { Socket } from '@zzz-picker/provider'
import { decryptRole } from '@zzz-picker/utils'
import { Phase } from '~/components'

const RealtimeRoom: React.FC = () => {
  const { roomId } = useParams()
  const [searchParams] = useSearchParams()

  return (
    <Socket channelId={roomId as string}>
      <Phase role={pipe(searchParams.get('a') as string, decryptRole)} />
    </Socket>
  )
}

export default RealtimeRoom
