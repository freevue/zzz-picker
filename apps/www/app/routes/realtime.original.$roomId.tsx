import { pipe, toArray, map, join, concat, split, filter, flatMap } from '@fxts/core'
import { useParams, useSearchParams } from '@remix-run/react'
import { DEFAULT } from '@zzz-picker/constant'
import { Play, Setting, Socket } from '@zzz-picker/provider'
import { supabase } from '@zzz-picker/provider'
import { useSocket, useStore, usePlay } from '@zzz-picker/provider/hooks'
import { useEffect, useMemo } from 'react'
import { useState } from 'react'
import { Realtime, CostTable, CommonBossCard, Header, Playground } from '~/components'

const OriginalContent: React.FC = () => {
  const { state } = useSocket()
  const { setState, setCost } = usePlay()
  const play = useMemo(() => state.play, [state])
  const realtime = useMemo(() => state.realtime, [state])

  useEffect(() => {
    pipe(
      [
        pipe(
          [state.play.common.A, state.play.personal.A, state.play.unlimited.A],
          flatMap((item) => item.pickCost || []),
          toArray
        ),
        pipe(
          [state.play.common.B, state.play.personal.B, state.play.unlimited.B],
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
    pipe(
      { ...play },
      (prev) => ({
        ...prev,
        common: { ...prev.common, boss: prev.common.boss },
      }),
      (play) => {
        setState((prev) => ({ ...prev, ...play }))
      }
    )
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
          concat([
            'alice:bg-[url("https://act-webstatic.hoyoverse.com/event-static-hoyowiki-admin/2025/08/04/01f84d7fdcdbef65d8a9c94416e81d91_2128704813195499621.png?x-oss-process=image%2Fformat%2Cwebp")]',
          ]),
          join(' ')
        )}
      >
        <Header />
        <CommonBossCard />
        <div className="flex gap-6 flex-col">
          <Realtime.Host.AllowAgent />
          <Realtime.Host.BanAgent />
        </div>
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

const Original: React.FC = () => {
  const { roomId: token } = useParams()
  const { agents } = useStore()
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [room, setRoom] = useState<any>(null)
  const options = useMemo(() => {
    return {
      banCount: Number(searchParams.get('banCount') || DEFAULT.BAN_COUNT),
      totalCost: Number(searchParams.get('totalCost') || DEFAULT.TOTAL_COST),
      allowAgent: pipe(searchParams.get('allowAgent') || '', split(','), map(Number), toArray),
    }
  }, [searchParams])

  useEffect(() => {
    pipe(
      agents,
      filter(([, agent]) => agent.isAllow),
      map(([id]) => id),
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
        if (userError || !userData || userData.role !== 'H') {
          // If not found or not Host, just stop loading (or could redirect/error)
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
            <OriginalContent />
          </div>
        </Socket>
      </Play>
    </Setting>
  )
}

export default Original
