import Ban from './Ban'
import BossSelect from './BossSelect'
import Pick from './Pick'
import Status from './Status'
import { Typo } from '@zzz-picker/components/v2'
import { SOCKET_EVENT, DEFAULT_PLAY_STATE, type SelectAgent } from '@zzz-picker/constant'
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
  state: {
    phase: ROOM_PHASE
    boss: number | null
    personalBoss?: {
      A: number | null
      B: number | null
    }
    ban: {
      phase: string
      candidates: [SelectAgent, SelectAgent]
      list: number[]
    }
    picks: {
      A: Array<{
        agentId: SelectAgent
        engineId: number | null
        agentRate: number
        engineRate: number
      }>
      B: Array<{
        agentId: SelectAgent
        engineId: number | null
        agentRate: number
        engineRate: number
      }>
    }
    status: Record<string, boolean>
    ready: {
      A: boolean
      B: boolean
    }
  }
}

type Props = {
  role: Rols
  initialRoom: RoomData
}

const Phase: React.FC<Props> = (props) => {
  const [room, setRoom] = useState<RoomData>(props.initialRoom)
  const { status, send } = useSocket(
    (payload: any, eventName: SOCKET_EVENT) => {
      if (eventName === SOCKET_EVENT.SYNC && payload.room) {
        setRoom(payload.room)
      }

      if (eventName === SOCKET_EVENT.JOIN && payload.role) {
        const joinedRole = payload.role === 'Host' ? 'H' : payload.role
        setRoom((prev) => ({
          ...prev,
          state: {
            ...prev.state,
            status: {
              ...prev.state.status,
              [joinedRole]: true,
            },
          },
        }))
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
    setRoom(nextRoom)

    // 1. 실시간 브로드캐스트
    send(SOCKET_EVENT.SYNC, { room: nextRoom })

    // 2. DB 영속성 저장
    if (nextRoom.id) {
      supabase
        .from('realtime_room')
        .update({ state: nextRoom.state })
        .eq('id', nextRoom.id)
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

    // 픽 정보를 cost 맵으로 변환 (기존 시스템 호환용)
    const costA = (room.state.picks?.A || [])
      .map((p: any) =>
        p.agentId
          ? [
              p.agentId,
              {
                agentId: p.agentId,
                engineId: p.engineId,
                agentRate: p.agentRate,
                engineRate: p.engineRate,
              },
            ]
          : null
      )
      .filter(Boolean)
    const costB = (room.state.picks?.B || [])
      .map((p: any) =>
        p.agentId
          ? [
              p.agentId,
              {
                agentId: p.agentId,
                engineId: p.engineId,
                agentRate: p.agentRate,
                engineRate: p.engineRate,
              },
            ]
          : null
      )
      .filter(Boolean)

    storageData[league] = {
      state: {
        ...DEFAULT_PLAY_STATE,
        ...room.state,
        nickname: room.names,
        banList: room.state.ban.list,
        common: {
          ...DEFAULT_PLAY_STATE.common,
          boss: room.state.boss,
        },
      },
      cost: {
        A: costA,
        B: costB,
      },
    }

    localStorage.setItem('zzz-picker-play', JSON.stringify(storageData))
    window.location.href = `/${league}`
  }

  const renderPhase = () => {
    switch (room.state.phase) {
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
    <div className="flex flex-col items-center min-h-screen py-20 px-4 md:px-10">
      <div className="w-full max-w-7xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={room.state.phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            {renderPhase()}
          </motion.div>
        </AnimatePresence>
      </div>
      <Status role={props.role} room={room} />
    </div>
  )
}

export default Phase
