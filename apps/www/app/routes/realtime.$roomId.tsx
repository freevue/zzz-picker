import { useParams, useSearchParams } from '@remix-run/react'
import { Socket, supabase } from '@zzz-picker/provider'
import { useEffect, useState } from 'react'
import { Phase } from '~/components'

const RealtimeRoom: React.FC = () => {
  const { roomId } = useParams()
  const [searchParams] = useSearchParams()
  const [room, setRoom] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('realtime_room')
      .select('*, users:realtime_user(*)')
      .eq('id', roomId)
      .single()
      .then(({ data }) => {
        setRoom(data)
        setLoading(false)
      })
  }, [roomId])

  if (loading) return <div>Loading...</div>
  if (!room) return <div>방을 찾을 수 없습니다.</div>

  const userToken = searchParams.get('a')
  const me = room.users.find((u: any) => u.id === userToken)

  if (!me) return <div>유효하지 않은 유저 토큰입니다.</div>

  const role = me.role === 'Host' ? 'H' : (me.role as 'A' | 'B')

  return (
    <Socket channelId={roomId as string}>
      <Phase role={role} initialRoom={room} />
    </Socket>
  )
}

export default RealtimeRoom
