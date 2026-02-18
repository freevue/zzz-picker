import { supabase } from './utils'
import { pipe, flatMap, filter, isNull, toArray } from '@fxts/core'
import { REALTIME_SUBSCRIBE_STATES, type RealtimeChannel } from '@supabase/supabase-js'
import {
  SOCKET_EVENT,
  DEFAULT_REALTIME_STATE,
  DEFAULT_PLAY_STATE,
  DEFAULT_ROOM_STATE,
  type RoomState,
  type Side,
  type PlayState,
  type AgentCostSetting,
  type SelectAgent,
} from '@zzz-picker/constant'
import { createContext, useEffect, useRef, useState, useMemo, useCallback } from 'react'

export type PickInfo = {
  agentId: number
  engineId: number | null
  agentRate: number
  engineRate: number
}

export type Cost = {
  A: Map<number, AgentCostSetting>
  B: Map<number, AgentCostSetting>
}

export type RoomData = {
  id: string
  gameType: string
  state: RoomState
}

type Context = {
  events: EventTarget
  channel: RealtimeChannel | null
  status: REALTIME_SUBSCRIBE_STATES
  room: RoomData | null
  state: RoomState
  cost: Cost
  allPickList: {
    A: SelectAgent[]
    B: SelectAgent[]
  }
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
  state: DEFAULT_ROOM_STATE,
  cost: { A: new Map(), B: new Map() },
  allPickList: {
    A: [],
    B: [],
  },
  send: () => {},
}

export const Context = createContext<Context>(state)

const Provider: React.FC<Props> = (props) => {
  const events = useRef(new EventTarget())
  const [status, setStatus] = useState<REALTIME_SUBSCRIBE_STATES>(REALTIME_SUBSCRIBE_STATES.CLOSED)
  const [room, setRoom] = useState<RoomData | null>(null)
  const [state, setState] = useState<RoomState>(DEFAULT_ROOM_STATE)
  const [cost, setCost] = useState<Cost>({
    A: new Map(),
    B: new Map(),
  })

  // sync Play.tsx logic
  const allPickList = useMemo(() => {
    const getPickList = (side: Side) =>
      pipe(
        state.play || DEFAULT_REALTIME_STATE,
        (state) => [state.common[side], state.personal[side], state.unlimited[side]],
        flatMap((item) => item.pickList),
        filter((agentId) => !isNull(agentId)),
        toArray
      )

    return {
      A: getPickList('A'),
      B: getPickList('B'),
    }
  }, [state])

  const ensureRealtimeState = (state: RoomState): RoomState => {
    if (!state) return DEFAULT_ROOM_STATE
    if (state.play && state.realtime) return state as RoomState
    // 구버전(flat) 데이터 대응: 최소한의 크래시 방지
    return {
      ...DEFAULT_ROOM_STATE,
      play: state.play || DEFAULT_PLAY_STATE,
      realtime: state.realtime || DEFAULT_REALTIME_STATE,
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
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'realtime_room',
          filter: `id=eq.${props.channelId}`,
        },
        (payload) => {
          if (payload.new) {
            const newRoom = payload.new as RoomData
            setRoom((prev) => ({ ...prev, ...newRoom }))
            if (newRoom.state) {
              setState(ensureRealtimeState(newRoom.state))
            }
          }
        }
      )
      .on('broadcast', { event: '*' }, ({ event, payload }) => {
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
          }
        }

        if (event === SOCKET_EVENT.PICK) {
          const { side, roundKey, pickList, pickCost, complete, nextPhase } = payload
          setState((prev) => {
            const next = {
              ...prev,
              play: {
                ...prev.play,
                [roundKey]: {
                  ...(prev.play[roundKey as keyof PlayState] as any),
                  [side]: {
                    ...(prev.play[roundKey as keyof PlayState] as any)[side],
                    ...(pickList ? { pickList } : {}),
                    ...(pickCost ? { pickCost } : {}),
                  },
                },
              },
            }

            if (complete && nextPhase) {
              next.realtime = {
                ...next.realtime,
                phase: nextPhase,
              }
            }

            // DB sync
            if (complete) {
              supabase
                .from('realtime_room')
                .update({ state: next })
                .eq('id', props.channelId)
                .then(() => {})
            }

            return next
          })
        }

        if (event === SOCKET_EVENT.BAN) {
          const { confirm, agentId, banCandidates, nextPhase } = payload
          setState((prev) => {
            const next = { ...prev }
            if (confirm) {
              const nextBanList = [...prev.play.banList]

              // If agentId is provided, fill the first null slot
              if (agentId) {
                // Prevent duplicate entry
                if (!nextBanList.includes(agentId)) {
                  const emptyIndex = nextBanList.findIndex((item) => item === null)
                  if (emptyIndex !== -1) {
                    nextBanList[emptyIndex] = agentId
                  }
                }
              }

              next.play = {
                ...prev.play,
                banList: nextBanList,
              }

              const isBanEnd = nextPhase === 'end' // BAN_PHASE.END
              next.realtime = {
                ...prev.realtime,
                ...(agentId ? { banCandidates: [null, null] } : {}),
                ...(nextPhase ? { banPhase: nextPhase } : {}),
                ...(isBanEnd ? { phase: 'PICK' } : {}), // ROOM_PHASE.PICK
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
          console.log('[Socket] BOSS Event Received:', payload)
          const { confirm, bossId, roundKey, side, nextPhase } = payload as {
            confirm: boolean
            bossId: number
            roundKey: keyof PlayState
            side: Side
            nextPhase?: string
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
                ...(nextPhase ? { phase: nextPhase } : {}),
              }

              // Persist to DB
              supabase
                .from('realtime_room')
                .update({ state: next })
                .eq('id', props.channelId)
                .then(() => {})
            } else {
              // Update candidates AND play state for preview
              console.log('[Socket] Updating Preview State:', { bossId, roundKey })
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
              }
            }
            return next
          })
        }

        if (event === SOCKET_EVENT.READY) {
          const { side, ready } = payload
          setState((prev) => {
            const nextReady = { ...prev.realtime.ready, [side]: ready }
            let nextPhase = prev.realtime.phase

            // 양쪽 모두 준비 완료 시, PICK 페이즈라면 DONE으로 이동
            if (prev.realtime.phase === 'PICK' && nextReady.A && nextReady.B) {
              nextPhase = 'DONE'
            }

            const next = {
              ...prev,
              realtime: {
                ...prev.realtime,
                ready: nextReady,
                phase: nextPhase,
              },
            }

            // DB sync
            supabase
              .from('realtime_room')
              .update({ state: next })
              .eq('id', props.channelId)
              .then(() => {})

            return next
          })
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
        allPickList,
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
