import { pipe, split, map, toArray } from '@fxts/core'
import { useParams, useSearchParams } from '@remix-run/react'
import { DEFAULT } from '@zzz-picker/constant'
import { Socket, supabase, useSocket, Setting, Play, Store } from '@zzz-picker/provider'
import { useEffect, useState, useMemo } from 'react'
import { Phase } from '~/components'

export const RealtimeRoom: React.FC = () => {
  const { roomId: token } = useParams() // URL param is now the User Token
  const [searchParams] = useSearchParams()
  const [room, setRoom] = useState<any>(null)
  const [me, setMe] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const options = useMemo(() => {
    return {
      banCount: Number(searchParams.get('banCount') || DEFAULT.BAN_COUNT),
      totalCost: Number(searchParams.get('totalCost') || DEFAULT.TOTAL_COST),
      allowAgent: pipe(searchParams.get('allowAgent') || '', split(','), map(Number), toArray),
    }
  }, [searchParams])

  useEffect(() => {
    if (!token) return

    // Resolve User Token -> Room ID
    supabase
      .from('realtime_user')
      .select('*, room:realtime_room(*)')
      .eq('id', token)
      .single()
      .then(async ({ data: userData, error: userError }) => {
        if (userError || !userData) {
          setError('유효하지 않은 참가자 토큰입니다.')
          setLoading(false)
          return
        }

        const roomData = userData.room

        // Fetch full room data including all users (to reconstruct room state consistent with other views)
        const { data: fullRoomData } = await supabase
          .from('realtime_room')
          .select('*, users:realtime_user(*)')
          .eq('id', roomData.id)
          .single()

        if (fullRoomData) {
          setRoom(fullRoomData)
          setMe(userData)
        } else {
          setError('방 정보를 찾을 수 없습니다.')
        }
        setLoading(false)
      })
  }, [token])

  const role = me?.role === 'Host' ? 'H' : (me?.role as 'A' | 'B')

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>
  if (!room || !me) return <div>접속 정보를 불러올 수 없습니다.</div>

  return (
    <Setting option={options}>
      <Store>
        <Play>
          <Socket channelId={room.id}>
            <SocketTester />
            <Phase role={role} initialRoom={room} />
          </Socket>
        </Play>
      </Store>
    </Setting>
  )
}

const SocketTester: React.FC = () => {
  const { status } = useSocket()

  useEffect(() => {
    if (status === 'SUBSCRIBED') {
      console.log('[SocketTester] Channel subscribed')
    }
  }, [status])

  return null
}

export default RealtimeRoom
