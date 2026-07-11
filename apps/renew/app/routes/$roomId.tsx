import { map, pipe, toArray } from '@fxts/core'
import { useParams, Link } from '@remix-run/react'
import { supabase } from '@zzz-picker/supabase'
import { useEffect, useMemo, useState } from 'react'
import { Role } from '~/constant'
import { TableName } from '~/lib/DB/constant'
import { type Player } from '~/type'

const LinkCard: React.FC<{ role: Role; name: string; roomId: string }> = (props) => {
  return (
    <div className="card flex gap-4 items-center px-8 py-6 rounded-3xl relative overflow-hidden">
      <span className="absolute -left-2 -top-4 text-primary/70 font-black text-7xl -skew-x-12">
        {props.role}
      </span>
      <p className="text-4xl w-52 font-black truncate">{props.name}</p>
      <div className="flex flex-col gap-4">
        <Link
          className="w-56 py-2 text-lg font-bold text-center bg-primary rounded-full text-base"
          to={`/room/${props.roomId}`}
        >
          접속
        </Link>
        <button
          type="button"
          className="w-56 py-2 text-lg font-bold text-center bg-secondary rounded-full text-base"
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
  const loading = useMemo(() => {
    return players.length === 0
  }, [players])

  useEffect(() => {
    if (!params.roomId) return

    supabase
      .from(TableName.PLAY)
      .select<string, Player>(
        `id,
        agents,
        boss,
        engines,
        name,
        proposeBan,
        rate,
        role,
        score,
        selectBan,
        time,
        ...${TableName.MATCH}(matchType)`
      )
      .eq('matchId', params.roomId)
      .then((response) => {
        setPlayers(response.data!)
      })
  }, [params])

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      {loading ? (
        <>Loading</>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <LinkCard role={Role.HOST} name="관리자" roomId={players[0].matchId} />
            {pipe(
              players,
              map((player) => (
                <LinkCard
                  role={player.role}
                  name={player.name}
                  roomId={player.id}
                  key={player.id}
                />
              )),
              toArray
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default RoomIndex
