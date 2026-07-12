import { PlayGround } from '@/components'
import { selectMath, selectMatchId } from '@/lib/DB'
import { Store, MatchState } from '@/provider'
import { type Player } from '@/type'
import {
  entries,
  find,
  fromEntries,
  head,
  isUndefined,
  map,
  pipe,
  size,
  toArray,
  toAsync,
  values,
} from '@fxts/core'
import { useParams } from '@remix-run/react'
import { useEffect, useMemo, useState } from 'react'
import { MatchType, Role } from '~/constant'

const RoomIndex = () => {
  const params = useParams()
  const [data, setData] = useState<Array<Player>>([])
  const [matchType, setMatchType] = useState<MatchType>(MatchType.ORIGINAL)
  const matchState = useMemo(() => {
    return pipe(
      data,
      map((player) => [player.role, player] as [Role, Player]),
      fromEntries
    )
  }, [data])
  const role = useMemo(() => {
    if (!params.id) return

    return pipe(
      data,
      find((player) => player.id === params.id),
      (data) => data?.role
    )
  }, [data, params.id])
  const loading = useMemo(() => isUndefined(role) && size(data) === 0, [data, role])

  useEffect(() => {
    if (!params.id) return

    pipe(
      params.id,
      selectMatchId,
      async (data) =>
        [await selectMath(data.matchId), setMatchType(data.matchType)] as [Player[], undefined],
      head,
      setData
    )
  }, [params])

  return (
    <Store>
      <div className="h-screen w-screen">
        {loading ? (
          <>Loading</>
        ) : (
          <MatchState match={matchState!} role={role!} matchType={matchType}>
            <PlayGround />
          </MatchState>
        )}
      </div>
    </Store>
  )
}

export default RoomIndex
