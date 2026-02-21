import { pipe, toArray, map, join, concat, split, filter, flatMap } from '@fxts/core'
import { useParams, useSearchParams } from '@remix-run/react'
import { DEFAULT } from '@zzz-picker/constant'
import { Play, Setting, Socket } from '@zzz-picker/provider'
import { supabase } from '@zzz-picker/provider'
import { useSocket, usePlay, useStore } from '@zzz-picker/provider/hooks'
import { useEffect, useMemo, useState } from 'react'
import { CostTable, Header, Playground } from '~/components'

const UnlimitedContent: React.FC = () => {
  const { state } = useSocket()
  const { setState, setCost } = usePlay()
  const play = useMemo(() => state.play, [state])
  const realtime = useMemo(() => state.realtime, [state])

  useEffect(() => {
    pipe(
      [
        pipe(
          [state.play.personal.A, state.play.unlimited.A],
          flatMap((item) => item.pickCost || []),
          toArray
        ),
        pipe(
          [state.play.personal.B, state.play.unlimited.B],
          flatMap((item) => item.pickCost || []),
          toArray
        ),
      ] as const,
      ([aSide, bSide]) => {
        setCost((prev) => {
          const aSideCost = new Map(prev.A)
          const bSideCost = new Map(prev.B)

          for (const item of aSide) {
            if (item === null) continue

            aSideCost.set(item.agentId, {
              agentId: item.agentId,
              agentRate: item.agentRate,
              engineId: item.engineId,
              engineRate: item.engineRate,
            })
          }
          for (const item of bSide) {
            if (item === null) continue

            bSideCost.set(item.agentId, {
              agentId: item.agentId,
              agentRate: item.agentRate,
              engineId: item.engineId,
              engineRate: item.engineRate,
            })
          }

          return { A: aSideCost, B: bSideCost }
        })
      }
    )
    pipe({ ...play }, (play) => {
      setState((prev) => ({ ...prev, ...play }))
    })
  }, [play, realtime])

  return (
    <div className="h-full ml-auto w-fit flex z-10 relative flex-1 overflow-auto scrollbar-hidden">
      <div
        className={pipe(
          [
            'min-w-xl',
            'w-xl',
            'bg-content',
            'flex',
            'flex-col',
            'gap-6',
            'overflow-y-auto',
            'overflow-x-hidden',
            'scrollbar-hidden',
          ],
          concat(['bg-cover', 'bg-no-repeat', 'bg-[center_30px]']),
          join(' ')
        )}
      >
        <Header />
        <CostTable />
      </div>
      <div
        className={pipe(
          ['min-w-4xl', 'w-4xl', 'overflow-auto', 'scrollbar-hidden', 'min-h-screen', 'bg-base'],
          join(' ')
        )}
      >
        <Playground />
      </div>
    </div>
  )
}

const Unlimited: React.FC = () => {
  const { roomId: token } = useParams()
  const { agents } = useStore()
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [room, setRoom] = useState<any>(null)

  const options = useMemo(() => {
    return {
      banCount: Number(searchParams.get('banCount') || DEFAULT.BAN_COUNT),
      totalCost: Infinity, // Unlimited는 Cost 무제한
      allowAgent: pipe(searchParams.get('allowAgent') || '', split(','), map(Number), toArray),
    }
  }, [searchParams])

  useEffect(() => {
    if (agents.size === 0) return

    pipe(
      agents,
      filter(([, agent]: any) => agent.isAllow),
      map(([id]: any) => id),
      join(','),
      (allowAgent) => {
        setSearchParams(
          (prev) => ({
            banCount: prev.get('banCount') || `${DEFAULT.BAN_COUNT}`,
            totalCost: prev.get('totalCost') || `${DEFAULT.TOTAL_COST}`,
            allowAgent: prev.get('allowAgent') || allowAgent,
          }),
          { replace: true }
        )
      }
    )
  }, [agents])

  useEffect(() => {
    if (!token) return

    supabase
      .from('realtime_user')
      .select('*, room:realtime_room(*)')
      .eq('id', token)
      .single()
      .then(async ({ data: userData, error: userError }) => {
        if (userError || !userData) {
          setLoading(false)
          return
        }

        const roomData = userData.room
        setRoom(roomData)
        setLoading(false)
      })
  }, [token])

  if (loading) return <div>Loading...</div>
  if (!room) return <div>접속 권한이 없습니다.</div>

  return (
    <Setting option={options}>
      <Play>
        <Socket channelId={room.id}>
          <div className="w-full h-full overflow-auto scrollbar-hidden">
            <UnlimitedContent />
          </div>
        </Socket>
      </Play>
    </Setting>
  )
}

export default Unlimited
