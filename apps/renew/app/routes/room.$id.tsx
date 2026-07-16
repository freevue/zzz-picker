import { PlayGround, HostDashboard } from '@/components'
import { selectMath, selectMatchId, selectHostMatch } from '@/lib/DB'
import { Store, MatchState } from '@/provider'
import { PlayerRole, type Player } from '@/type'
import { find, fromEntries, head, isUndefined, map, peek, pipe, size } from '@fxts/core'
import { useParams } from '@remix-run/react'
import { useEffect, useMemo, useState } from 'react'
import { MatchType, Role } from '~/constant'

type Match = {
  matchType: MatchType
  matchId: string
}

const RoomIndex = () => {
  const params = useParams()
  const [data, setData] = useState<Array<Player>>([])
  const [match, setMatch] = useState<Match>({ matchType: MatchType.ORIGINAL, matchId: '' })
  const matchState = useMemo(() => {
    return pipe(
      data,
      map((player) => [player.role, player] as [PlayerRole, Player]),
      fromEntries
    )
  }, [data])
  const role = useMemo(() => {
    if (!params.id) return

    return pipe(
      data,
      find((player) => player.id === params.id),
      (data) => data?.role ?? Role.HOST
    )
  }, [data, params.id])
  const loading = useMemo(() => isUndefined(role) && size(data) === 0, [data, role])

  useEffect(() => {
    if (!params.id) return

    pipe(
      params.id,
      selectHostMatch,
      (data) => [isUndefined(data) ? selectMatchId(params.id!) : data],
      peek(setMatch),
      head,
      (data) => selectMath(data!.matchId),
      setData
    )
  }, [params])

  return (
    <Store>
      <div className="h-screen w-screen">
        {loading ? (
          <>Loading</>
        ) : (
          <MatchState match={matchState!} role={role!} {...match}>
            {role === Role.HOST ? <HostDashboard /> : <PlayGround />}
          </MatchState>
        )}
      </div>
    </Store>
  )
}

export default RoomIndex
