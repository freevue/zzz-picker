import { PlayGround } from '@/components'
import { selectMatchPlayer, selectMath } from '@/lib/DB'
import { Store, MatchState } from '@/provider'
import { type Player, type Match } from '@/type'
import { isNull, pipe } from '@fxts/core'
import { useParams } from '@remix-run/react'
import { useEffect, useMemo, useState } from 'react'
import { Role } from '~/constant'

const RoomIndex = () => {
  const params = useParams()
  const [player, setPlayer] = useState<Player | null>(null)
  const [matchState, setMatchState] = useState<Array<Player> | null>(null)
  const loading = useMemo(() => isNull(player) || isNull(matchState), [player, matchState])

  useEffect(() => {
    if (!params.id) return

    pipe(params.id, selectMatchPlayer, setPlayer)
  }, [params])
  useEffect(() => {
    if (isNull(player)) return

    pipe(player.matchId, selectMath, (data) => setMatchState(data))
  }, [player])

  return (
    <Store>
      <div className="h-screen w-screen">
        {loading ? (
          <>Loading</>
        ) : (
          <MatchState player={player!} match={matchState!}>
            {player!.role === Role.HOST ? (
              <>{player!.role}</>
            ) : (
              <>
                <h1 className="text-7xl font-bold text-primary ft-ria fixed left-4 top-4 z-1">
                  {player!.name}
                </h1>
                <PlayGround player={player!} />
              </>
            )}
          </MatchState>
        )}
      </div>
    </Store>
  )
}

export default RoomIndex
