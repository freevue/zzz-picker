import { Loading } from '@/components'
import { map, pipe, sort, toArray } from '@fxts/core'
import { useParams, Link } from '@remix-run/react'
import { useEffect, useMemo, useState } from 'react'
import { Role } from '~/constant'
import { selectMatchPlayer, selectMatchHost } from '~/lib/DB'
import { type Player } from '~/type'

const LinkCard: React.FC<{ role: Role; name: string; roomId: string }> = (props) => {
  const onCopyClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    await navigator.clipboard.writeText(`${window.location.origin}/room/${props.roomId}`)
  }

  return (
    <div className="card flex gap-4 items-center px-8 py-6 rounded-3xl relative overflow-hidden w-full">
      <span className="absolute -left-3 -top-2 text-primary/70 font-black text-7xl -skew-x-12 ft-ria">
        {props.role}
      </span>
      <p className="text-4xl font-black truncate ft-pre flex-1">{props.name}</p>
      <div className="flex flex-col gap-4 ml-auto">
        <Link
          className="w-56 py-2 text-xl font-bold text-center bg-primary rounded-full text-base ft-pre"
          to={`/room/${props.roomId}`}
        >
          접속
        </Link>
        <button
          type="button"
          className="w-56 cursor-pointer py-2 text-xl ft-pre font-bold text-center bg-secondary rounded-full text-base"
          onClick={onCopyClick}
        >
          복사
        </button>
      </div>
    </div>
  )
}
const RoomIndex = () => {
  const params = useParams()
  const [players, setPlayers] = useState<Array<Player>>([])
  const [hostId, setHostId] = useState<string>('')
  const loading = useMemo(() => {
    return players.length === 0
  }, [players])

  useEffect(() => {
    if (!params.roomId) return

    pipe(
      params.roomId,
      selectMatchHost,
      (data) => setHostId(data.hostId),
      () => params.roomId!,
      selectMatchPlayer,
      (list) => setPlayers(list)
    )
  }, [params])

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col gap-4 w-screen max-w-xl">
          <LinkCard role={Role.HOST} name="관리자" roomId={hostId} />
          {pipe(
            players,
            sort((player) => (player.role === Role.A_SIDE ? -1 : 1)),
            map((player) => (
              <LinkCard role={player.role} name={player.name} roomId={player.id} key={player.id} />
            )),
            toArray
          )}
        </div>
      )}
    </div>
  )
}

export default RoomIndex
