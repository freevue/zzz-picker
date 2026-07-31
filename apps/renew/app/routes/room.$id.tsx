import { PlayGround, HostDashboard, Loading } from '@/components'
import { selectMatchPlayer, selectMatchPlayerId, selectHostMatch } from '@/lib/DB'
import { hook } from '@/lib/utils'
import { Store, Score, Match } from '@/provider'
import type { Match as MatchStateType, PlayerRole, Player } from '@/type'
import { find, isUndefined, pipe, size } from '@fxts/core'
import { useParams } from '@remix-run/react'
import { useEffect, useMemo, useState } from 'react'
import { Role } from '~/constant'

const RoomIndex = () => {
  const params = useParams()
  const [match, setMatch] = useState<MatchStateType | null>(null)
  const [play, setPlay] = useState<Array<Player>>([])
  const role = useMemo(() => {
    if (isUndefined(params.id)) return

    return pipe(
      play,
      find((player) => player.id === params.id),
      (data) => data?.role ?? Role.HOST
    )
  }, [play, params.id])
  const loading = useMemo(() => isUndefined(role) && size(play) === 0, [play, role])

  useEffect(() => {
    if (isUndefined(params.id)) return

    pipe(
      params.id,
      selectHostMatch,
      (data) => (isUndefined(data) ? selectMatchPlayerId(params.id!) : data),
      hook(setMatch),
      (data) => selectMatchPlayer(data!.matchId),
      setPlay
    )
  }, [params])

  return (
    <Store>
      <div className="h-screen w-screen">
        {loading ? (
          <Loading />
        ) : (
          <Match match={match!} role={role!} play={play}>
            {role === Role.HOST ? <HostDashboard /> : <PlayGround role={role! as PlayerRole} />}
          </Match>
        )}
      </div>
    </Store>
  )
}

export default RoomIndex
