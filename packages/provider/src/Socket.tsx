import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY } from './utils'
import { REALTIME_SUBSCRIBE_STATES, type RealtimeChannel } from '@supabase/supabase-js'
import {
  SOCKET_EVENT,
  DEFAULT_REALTIME_STATE,
  type Side,
  type PlayState,
  type RealtimeState,
  type AgentCostSetting,
} from '@zzz-picker/constant'
import { createContext, useEffect, useRef, useState, useMemo, useCallback } from 'react'

export type PickInfo = {
  agentId: number
  engineId: number | null
  agentRate: number
  engineRate: number
}

export type Cost = Record<Side, Map<number, AgentCostSetting>>

export type RoomData = {
  id: string
  game_type: string
  names: { A: string; B: string }
  users: Array<{ id: string; role: string; nickname: string }>
  state: RealtimeState
}

type Context = {
  events: EventTarget
  channel: RealtimeChannel | null
  status: REALTIME_SUBSCRIBE_STATES
  room: RoomData | null
  state: RealtimeState
  cost: Cost
  send: (event: SOCKET_EVENT, payload: Record<string, any>) => void
}
type Props = {
  children: React.ReactNode
  channelId: string
}

const state: Context = {
  events: new EventTarget(),
  channel: null,
  status: REALTIME_SUBSCRIBE_STATES.CLOSED,
  room: null,
  state: DEFAULT_REALTIME_STATE,
  cost: { A: new Map(), B: new Map() },
  send: () => {},
}

export const Context = createContext<Context>(state)

const Provider: React.FC<Props> = (props) => {
  const events = useRef(new EventTarget())
  const [status, setStatus] = useState<REALTIME_SUBSCRIBE_STATES>(REALTIME_SUBSCRIBE_STATES.CLOSED)
  const [room, setRoom] = useState<RoomData | null>(null)
  const [state, setState] = useState<RealtimeState>(DEFAULT_REALTIME_STATE)
  const [cost, setCost] = useState<Cost>({
    A: new Map(),
    B: new Map(),
  })

  const ensureRealtimeState = (s: any): RealtimeState => {
    if (!s) return DEFAULT_REALTIME_STATE
    if (s.play && s.realtime) return s as RealtimeState
    // 구버전(flat) 데이터 대응: 최소한의 크래시 방지
    return {
      ...DEFAULT_REALTIME_STATE,
      play: s.play || DEFAULT_REALTIME_STATE.play,
      realtime: s.realtime || DEFAULT_REALTIME_STATE.realtime,
    }
  }

  useEffect(() => {
    if (!props.channelId) return
    supabase
      .from('realtime_room')
      .select('*, users:realtime_user(*)')
      .eq('id', props.channelId)
      .single()
      .then(({ data }) => {
        if (data) {
          setRoom(data)
          setState((prev) => ({
            ...prev,
            play: { ...prev.play, ...data.state.play },
            realtime: { ...prev.realtime, ...data.state.realtime },
          }))
        }
      })
  }, [props.channelId])

  // Ref to hold the channel for send() access
  const channelRef = useRef<RealtimeChannel | null>(null)
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!props.channelId) return

    console.log('[Socket] Initializing new channel for:', props.channelId)

    const newChannel = supabase.channel(`room:zzz:pick:${props.channelId}`, {
      config: {
        broadcast: { self: true },
      },
    })

    // Assign to ref for 'send' method
    channelRef.current = newChannel

    // Set state for context
    setChannel(newChannel)

    newChannel
      .on('broadcast', { event: '*' }, ({ event, payload }) => {
        console.log({ event })
        if (event === SOCKET_EVENT.SYNC) {
          if (payload.room) {
            setRoom(payload.room)
            if (payload.room.state) {
              setState(ensureRealtimeState(payload.room.state))
            }
          } else if (payload.state) {
            setState(ensureRealtimeState(payload.state))
          }

          if (payload.cost) {
            setCost({
              A: new Map(
                Object.entries(payload.cost.A as any).map(([k, v]) => [
                  Number(k),
                  v as AgentCostSetting,
                ])
              ),
              B: new Map(
                Object.entries(payload.cost.B as any).map(([k, v]) => [
                  Number(k),
                  v as AgentCostSetting,
                ])
              ),
            })
          }
        }

        if (event === SOCKET_EVENT.JOIN) {
          const { side, nickname } = payload
          if (side && (side === 'A' || side === 'B')) {
            // Update Realtime state
            setState((prev) => {
              const next = {
                ...prev,
                play: {
                  ...prev.play,
                  nickname: {
                    ...prev.play.nickname,
                    [side]: nickname,
                  },
                },
              }

              // Persist to DB (State)
              supabase
                .from('realtime_room')
                .update({ state: next })
                .eq('id', props.channelId)
                .then(() => {})

              return next
            })

            // Update local Room state (for UI components using room.names or room.users)
            setRoom((prev) => {
              if (!prev) return null
              // Keep room.names for compatibility if type expects it,
              // though DB doesn't have it. RoomData type definition might need update but for now specific valid.
              const nextNames = { ...(prev as any).names, [side]: nickname }
              const nextUsers = prev.users.map((u) => (u.role === side ? { ...u, nickname } : u))
              return { ...prev, names: nextNames, users: nextUsers }
            })
          }
        }

        if (event === SOCKET_EVENT.PICK) {
          const { side, roundKey, pickList } = payload
          setState((prev) => ({
            ...prev,
            play: {
              ...prev.play,
              [roundKey]: {
                ...(prev.play[roundKey as keyof PlayState] as any),
                [side]: {
                  ...(prev.play[roundKey as keyof PlayState] as any)[side],
                  pickList,
                },
              },
            },
          }))
        }

        if (event === SOCKET_EVENT.BAN) {
          const { confirm, agentId, banCandidates, nextPhase } = payload
          setState((prev) => {
            const next = { ...prev }
            if (confirm) {
              const nextBanList = [...prev.play.banList]

              // Prevent duplicate entry
              if (agentId && nextBanList.includes(agentId)) {
                return prev
              }

              const emptyIndex = nextBanList.findIndex((item) => item === null)
              if (emptyIndex !== -1) {
                nextBanList[emptyIndex] = agentId
              }
              next.play = {
                ...prev.play,
                banList: nextBanList,
              }
              next.realtime = {
                ...prev.realtime,
                banCandidates: [null, null],
                ...(nextPhase ? { banPhase: nextPhase } : {}),
              }

              // Persist to DB
              supabase
                .from('realtime_room')
                .update({ state: next })
                .eq('id', props.channelId)
                .then(() => {})
            } else if (banCandidates !== undefined) {
              next.realtime = {
                ...prev.realtime,
                banCandidates,
              }
            }
            return next
          })
        }

        if (event === SOCKET_EVENT.BOSS) {
          const { confirm, bossId, roundKey, side } = payload as {
            confirm: boolean
            bossId: number
            roundKey: keyof PlayState
            side: Side
          }
          setState((prev) => {
            const next = { ...prev }
            if (confirm) {
              const nextPlay = { ...prev.play }
              if (roundKey === 'common') {
                nextPlay.common = {
                  ...nextPlay.common,
                  boss: bossId,
                }
              } else if (roundKey === 'personal' || roundKey === 'unlimited') {
                const round = nextPlay[roundKey]
                if (side && (side === 'A' || side === 'B')) {
                  nextPlay[roundKey] = {
                    ...round,
                    [side]: {
                      ...(round as any)[side],
                      boss: bossId,
                    },
                  } as any
                }
              }
              next.play = nextPlay
              next.realtime = {
                ...prev.realtime,
                bossCandidates: null,
              }

              // Persist to DB
              supabase
                .from('realtime_room')
                .update({ state: next })
                .eq('id', props.channelId)
                .then(() => {})
            } else {
              // Update candidates AND play state for preview
              const nextPlay = { ...prev.play }
              if (roundKey === 'common') {
                nextPlay.common = {
                  ...nextPlay.common,
                  boss: bossId,
                }
              } else if (roundKey === 'personal' || roundKey === 'unlimited') {
                const round = nextPlay[roundKey]
                if (side && (side === 'A' || side === 'B')) {
                  nextPlay[roundKey] = {
                    ...round,
                    [side]: {
                      ...(round as any)[side],
                      boss: bossId,
                    },
                  } as any
                }
              }
              next.play = nextPlay

              next.realtime = {
                ...prev.realtime,
                bossCandidates: bossId,
              }
            }
            console.log({ next })
            return next
          })
        }

        if (event === SOCKET_EVENT.READY) {
          const { side, ready } = payload
          setState((prev) => ({
            ...prev,
            realtime: {
              ...prev.realtime,
              ready: { ...prev.realtime.ready, [side]: ready },
            },
          }))
        }

        if (event === SOCKET_EVENT.STATUS) {
          const { side, status } = payload
          setState((prev) => ({
            ...prev,
            realtime: {
              ...prev.realtime,
              status: { ...prev.realtime.status, [side]: status },
            },
          }))
        }

        if (event === SOCKET_EVENT.COST) {
          const { side, agentId, updates } = payload
          setCost((prev) => {
            const nextCost = { ...prev }
            const currentItem = nextCost[side as Side].get(agentId) || {
              agentId,
              engineId: null,
              agentRate: 0,
              engineRate: 1,
            }
            nextCost[side as Side].set(agentId, { ...currentItem, ...updates })
            return { ...nextCost }
          })
        }

        events.current.dispatchEvent(
          new CustomEvent<Record<string, any>>(event, { detail: payload })
        )
      })
      .subscribe((status) => {
        console.log('[Socket] Subscription Status changed:', status)
        setStatus(status)
      })

    return () => {
      supabase.removeChannel(newChannel)
      setChannel(null)
    }
  }, [props.channelId])

  return (
    <Context.Provider
      value={{
        events: events.current,
        channel,
        status,
        room,
        state,
        cost,
        send: useCallback((event: SOCKET_EVENT, payload: Record<string, any>) => {
          if (channelRef.current) {
            channelRef.current.send({ type: 'broadcast', event, payload })
          }
        }, []),
      }}
    >
      {props.children}
    </Context.Provider>
  )
}

export default Provider
