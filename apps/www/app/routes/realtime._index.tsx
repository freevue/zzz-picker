import { pipe, map, toArray, isNull } from '@fxts/core'
import type { Side } from '@zzz-picker/constant'
import { createUUID, encryptRole } from '@zzz-picker/utils'
import { AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { CreateRoomForm, RoomInfo } from '~/components/Realtime'

type Token = {
  uuid: string
  role: Side | 'H'
  token: string
  nickname: string
}

const RealtimeRoot: React.FC = () => {
  const [tokens, setTokens] = useState<Token[] | null>(null)

  const onCreateChannel = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    // console.log([...formData.entries()])

    const uuid = createUUID()

    pipe(
      ['A', 'B', 'H'] as const,
      map((role) => ({
        role,
        uuid,
        token: encryptRole(role),
        nickname: role === 'H' ? 'Host' : (formData.get(`${role}-nickname`) as string),
      })),
      toArray,
      (list) => setTokens(list)
    )
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
