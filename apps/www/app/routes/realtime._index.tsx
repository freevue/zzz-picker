import { isNull } from '@fxts/core'
import { type Side } from '@zzz-picker/constant'
import { supabase } from '@zzz-picker/provider'
import { AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { CreateRoomForm, RoomInfo } from '~/components/Realtime'

type Token = {
  uuid: string
  role: Side | 'H'
  token: string
  nickname: string
}

export const RealtimeRoot: React.FC = () => {
  const [tokens, setTokens] = useState<Token[] | null>(null)

  const onCreateChannel = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const league = (formData.get('league') as string)?.replace('/', '') // /legend -> legend
    const nicknameA = formData.get('A') as string
    const nicknameB = formData.get('B') as string

    // 1. 방 생성
    const { data: room, error: roomError } = await supabase
      .from('realtime_room')
      .insert({
        game_type: league,
        names: { A: nicknameA, B: nicknameB },
      })
      .select()
      .single()

    if (roomError || !room) {
      alert('방 생성에 실패했습니다.')
      return
    }

    // 2. 기본 유저 생성 (Host, A, B)
    const { data: users, error: userError } = await supabase
      .from('realtime_user')
      .insert([
        { room_id: room.id, role: 'Host', nickname: 'Host' },
        { room_id: room.id, role: 'A', nickname: nicknameA },
        { room_id: room.id, role: 'B', nickname: nicknameB },
      ])
      .select()

    if (userError || !users) {
      alert('유저 생성에 실패했습니다.')
      return
    }

    // 3. 토큰 리스트 생성 (유저 ID를 토큰으로 사용)
    const tokenList = users.map((user) => ({
      role: user.role === 'Host' ? ('H' as const) : (user.role as Side),
      uuid: room.id,
      token: user.id, // 유저 UUID를 토큰으로 사용
      nickname: user.nickname,
    }))

    setTokens(tokenList)
  }

  return (
    <AnimatePresence>
      {isNull(tokens) ? (
        <CreateRoomForm onSubmit={onCreateChannel} />
      ) : (
        <RoomInfo list={tokens} onReset={() => setTokens(null)} />
      )}
    </AnimatePresence>
  )
}

export default RealtimeRoot
