import { pipe, split, map, toArray } from '@fxts/core'
import { useParams, useSearchParams } from '@remix-run/react'
import {
  DEFAULT,
  DEFAULT_ROOM_STATE,
  type RoomState,
  type Side,
  GAME_TYPE,
} from '@zzz-picker/constant'
import { Socket, supabase, Setting, Play, Store } from '@zzz-picker/provider'
import { useEffect, useState, useMemo } from 'react'
import { Phase } from '~/components'

export const RealtimeRoom: React.FC = () => {
  const { roomId: token } = useParams() // URL param is now the User Token
  const [searchParams] = useSearchParams()
  const [room, setRoom] = useState<RoomState>(DEFAULT_ROOM_STATE)
  const [channelId, setChannelId] = useState<string | null>(null)
  const [role, setRole] = useState<Side | 'H'>('A')
  const [gameType, setGameType] = useState<GAME_TYPE>(GAME_TYPE.ORIGINAL)
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
        setChannelId(roomData.id)
        setRole(userData.role as Side | 'H')
        setGameType(roomData.game_type as GAME_TYPE)

        // Fetch full room data including all users (to reconstruct room state consistent with other views)
        const { data } = await supabase
          .from('realtime_room')
          .select('*, users:realtime_user(*)')
          .eq('id', roomData.id)
          .single()

        if (data) {
          setRoom((prev) => ({
            realtime: { ...prev.realtime, ...data.realtime },
            play: { ...prev.play, ...data.play },
          }))
        } else {
          setError('방 정보를 찾을 수 없습니다.')
        }
        setLoading(false)
      })
  }, [token])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>
  if (!channelId) return <div>방 정보를 찾을 수 없습니다.</div>

  return (
    <Setting option={options}>
      <Store>
        <Play>
          <Socket channelId={channelId}>
            <Phase role={role} id={channelId} gameType={gameType} initialRoom={room} />
          </Socket>
        </Play>
      </Store>
    </Setting>
  )
}

export default RealtimeRoom
