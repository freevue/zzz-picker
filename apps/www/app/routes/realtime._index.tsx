import { isEmpty, isNull, map, pipe, throwIf, toArray } from '@fxts/core'
import { DEFAULT_REALTIME_STATE } from '@zzz-picker/constant'
import { supabase } from '@zzz-picker/provider'
import { AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { CreateRoomForm, RoomInfo } from '~/components/Realtime'

type Token = {
  uuid: string
  role: 'A' | 'B' | 'H'
  token: string
  nickname: string
}

export const RealtimeRoot: React.FC = () => {
  const [tokens, setTokens] = useState<Token[] | null>(null)
  const [gameType, setGameType] = useState<string>('original')

  const onCreateChannel = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const { game_type, state } = pipe(
        new FormData(event.currentTarget),
        (formData) => ({
          game_type: formData.get('league') as string,
          A: formData.get('A-nickname'),
          B: formData.get('B-nickname'),
        }),
        throwIf(
          ({ A }) => isEmpty(A),
          () => Error('A 플레이어 닉네임을 입력해주세요')
        ),
        throwIf(
          ({ B }) => isEmpty(B),
          () => Error('B 플레이어 닉네임을 입력해주세요')
        ),
        ({ A, B, game_type }) => ({
          game_type,
          state: {
            ...DEFAULT_REALTIME_STATE,
            play: {
              ...DEFAULT_REALTIME_STATE.play,
              nickname: { A, B },
            },
          },
        })
      )

      const { data: room, error: roomError } = await supabase
        .from('realtime_room')
        .insert({ game_type, state })
        .select()
        .single()

      if (roomError || !room) {
        throw Error('방 생성에 실패했습니다.')
      }

      const { data: users, error: userError } = await supabase
        .from('realtime_user')
        .insert([
          { room_id: room.id, role: 'H', nickname: 'Host' },
          { room_id: room.id, role: 'A', nickname: state.play.nickname.A },
          { room_id: room.id, role: 'B', nickname: state.play.nickname.B },
        ])
        .select()

      if (userError || !users) {
        throw Error('유저 생성에 실패했습니다.')
      }

      pipe(
        users,
        map((user) => ({
          role: user.role,
          uuid: room.id,
          token: user.id,
          nickname: user.nickname,
        })),
        toArray,
        (list) => {
          setTokens(list)
          setGameType(game_type)
        }
      )
    } catch (error: any) {
      alert(error.message || '방 생성에 실패했습니다.')
    }
  }

  return (
    <AnimatePresence>
      {isNull(tokens) ? (
        <CreateRoomForm onSubmit={onCreateChannel} />
      ) : (
        <RoomInfo list={tokens} gameType={gameType} onReset={() => setTokens(null)} />
      )}
    </AnimatePresence>
  )
}

export default RealtimeRoot
