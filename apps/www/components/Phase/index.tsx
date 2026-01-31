import Ban from './Ban'
import BossSelect from './BossSelect'
import Pick from './Pick'
import { Typo } from '@zzz-picker/components/v2'
import { SOCKET_EVENT, type RealtimeState, DEFAULT_REALTIME_STATE } from '@zzz-picker/constant'
import type { Side } from '@zzz-picker/constant'
import { supabase } from '@zzz-picker/provider'
import { useSocket } from '@zzz-picker/provider/hooks'
import { REALTIME_SUBSCRIBE_STATES } from '@zzz-picker/provider/realtime'
import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useEffectEvent, useState } from 'react'

export type Rols = Side | 'H'

export enum ROOM_PHASE {
  WAITING = 'WAITING',
  BOSS_SELECT = 'BOSS_SELECT',
  BAN = 'BAN',
  PICK = 'PICK',
  DONE = 'DONE',
}

export type RoomData = {
  id: string
  game_type: string
  names: { A: string; B: string }
  users: Array<{ id: string; role: string; nickname: string }>
  state: RealtimeState
}

type Props = {
  role: Rols
  initialRoom: RoomData
}

const Phase: React.FC<Props> = (props) => {
  const ensureRealtimeState = (s: any): RealtimeState => {
    if (!s) return DEFAULT_REALTIME_STATE
    if (s.play && s.realtime) return s as RealtimeState
    return {
      ...DEFAULT_REALTIME_STATE,
      play: s.play || DEFAULT_REALTIME_STATE.play,
      realtime: s.realtime || DEFAULT_REALTIME_STATE.realtime,
    }
  }

  const [room, setRoom] = useState<RoomData>(() => ({
    ...props.initialRoom,
    state: ensureRealtimeState(props.initialRoom.state),
  }))
  const { status, send } = useSocket(
    (payload: any, eventName: SOCKET_EVENT) => {
      if (eventName === SOCKET_EVENT.SYNC && payload.room) {
        setRoom({
          ...payload.room,
          state: ensureRealtimeState(payload.room.state),
        })
      }

      if (eventName === SOCKET_EVENT.JOIN && payload.role) {
        const joinedRole = payload.role === 'Host' ? 'H' : payload.role
        setRoom((prev) => {
          const realtime = (prev.state as any).realtime || {}
          return {
            ...prev,
            state: {
              ...prev.state,
              realtime: {
                ...realtime,
                status: {
                  ...realtime.status,
                  [joinedRole]: true,
                },
              },
            },
          }
        })
      }
    },
    { event: [SOCKET_EVENT.SYNC, SOCKET_EVENT.JOIN] }
  )

  const onJoinSend = useEffectEvent(() => {
    send(SOCKET_EVENT.JOIN, { role: props.role })
  })

  useEffect(() => {
    // 1. 실시간 DB 변경 구독 (Broadcast 실패 대비)
    const channel = supabase
      .channel(`room:db:${room.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'realtime_room',
          filter: `id=eq.${room.id}`,
        },
        (payload) => {
          if (payload.new) {
            setRoom((prev) => ({ ...prev, ...payload.new }))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [room.id])

  useEffect(() => {
    if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
      onJoinSend()
    }
  }, [status])

  const onUpdateRoom = (nextRoom: RoomData) => {
    const safeRoom = {
      ...nextRoom,
      state: ensureRealtimeState(nextRoom.state),
    }
    setRoom(safeRoom)

    // 1. 실시간 브로드캐스트
    send(SOCKET_EVENT.SYNC, { room: safeRoom })

    // 2. DB 영속성 저장
    if (safeRoom.id) {
      supabase
        .from('realtime_room')
        .update({ state: safeRoom.state })
        .eq('id', safeRoom.id)
        .then(({ error }) => {
          if (error) console.error('상태 저장 실패:', error)
        })
    }
  }

  const onFinish = () => {
    if (props.role !== 'H') return

    // 로컬 스토리지 포맷으로 변환
    const storageData = JSON.parse(localStorage.getItem('zzz-picker-play') || '{}')
    const league = room.game_type

    const getPicksFromPlay = (side: Side) => {
      const r1 = room.state.play.personal[side].pickList
      const r2 =
        room.game_type === 'unlimited'
          ? room.state.play.unlimited[side].pickList
          : room.state.play.common[side].pickList
      return [...r1, ...r2]
    }

    const costA = getPicksFromPlay('A')
      .map((agentId) =>
        agentId
          ? [
              agentId,
              {
                agentId,
                engineId: null,
                agentRate: 0,
                engineRate: 1,
              },
            ]
          : null
      )
      .filter((v): v is [number, any] => v !== null)
    const costB = getPicksFromPlay('B')
      .map((agentId) =>
        agentId
          ? [
              agentId,
              {
                agentId,
                engineId: null,
                agentRate: 0,
                engineRate: 1,
              },
            ]
          : null
      )
      .filter((v): v is [number, any] => v !== null)

    storageData[league] = {
      state: room.state.play,
      cost: {
        A: costA,
        B: costB,
      },
    }

    localStorage.setItem('zzz-picker-play', JSON.stringify(storageData))
    window.location.href = `/${league}`
  }

  const renderPhase = () => {
    const phase = room.state.realtime.phase
    switch (phase) {
      case ROOM_PHASE.WAITING:
      case ROOM_PHASE.BOSS_SELECT:
        return <BossSelect role={props.role} room={room} onUpdate={onUpdateRoom} />
      case ROOM_PHASE.BAN:
        return <Ban role={props.role} room={room} onUpdate={onUpdateRoom} />
      case ROOM_PHASE.PICK:
        return <Pick role={props.role} room={room} onUpdate={onUpdateRoom} />
      case ROOM_PHASE.DONE:
        return (
          <div className="flex flex-col items-center gap-10">
            <Typo.Heading className="heading-4xl text-ink" heading={1}>
              모든 선택이 완료되었습니다.
            </Typo.Heading>
            {props.role === 'H' ? (
              <button
                onClick={onFinish}
                className="px-12 py-4 bg-primary text-content rounded-2xl heading-2xl cursor-pointer"
              >
                결과 저장 및 경기 페이지로 이동
              </button>
            ) : (
              <Typo.Body className="body-xl opacity-50 text-center">
                관리자가 결과를 저장하고 경기를 시작할 때까지 잠시만 기다려주세요.
              </Typo.Body>
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={room.state.realtime.phase}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
      >
        {renderPhase()}
      </motion.div>
    </AnimatePresence>
  )
}

export default Phase
