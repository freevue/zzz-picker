import {
  entries,
  every,
  flatMap,
  fromEntries,
  isNumber,
  map,
  pipe,
  range,
  toArray,
} from '@fxts/core'
import { supabase, type RealtimeChannel } from '@zzz-picker/supabase'
import { createContext, useEffect, useMemo, useRef, useState } from 'react'
import { Loading } from '~/components'
import { MatchType, Phase, Role, BroadcastEvent, SETTING } from '~/constant'
import type { Match, Player, BroadcastPayloadMap, PlayerRole } from '~/type'

const INITIAL_PLAY = {
  agentSlot: [],
  engineSlot: [],
  boss: [null, null],
  id: '',
  name: '',
  proposeBan: [null, null],
  selectBan: [null],
  role: Role.A_SIDE,
  score: [0, 0],
  time: [0, 0],
  isConnected: false,
} as Player
const INITIAL_SELECT_STATE = {
  [Phase.COMMON_BOSS_SELECT]: null as string | null,
  [Phase.BAN]: pipe(
    SETTING.MAX_PLAYER_BAN_PROPOSE,
    range,
    map(() => null),
    toArray
  ) as Array<number | null>,
  [Phase.BAN_FIX]: [null] as Array<number | null>,
}

type Props = {
  children: React.ReactNode
  match: Match
  role: Role
  play: Array<Player>
}
type State = {
  match: Match
  select: typeof INITIAL_SELECT_STATE
  currentPlay?: Player
  play: Record<PlayerRole, Player>
  send: <T extends BroadcastEvent>(event: T, payload: BroadcastPayloadMap[T]) => void
}

export const Context = createContext<State>({
  match: {
    matchId: '',
    matchType: MatchType.ORIGINAL,
    phase: Phase.COMMON_BOSS_SELECT,
  },
  select: INITIAL_SELECT_STATE,
  play: { [Role.A_SIDE]: INITIAL_PLAY, [Role.B_SIDE]: INITIAL_PLAY },
  send: () => {},
})

const MatchState: React.FC<Props> = (props) => {
  const timeOut = useRef<NodeJS.Timeout | null>(null)
  const channel = useRef<null | RealtimeChannel>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [match, setMatch] = useState<Match>(props.match)
  const [select, setSelect] = useState<typeof INITIAL_SELECT_STATE>(INITIAL_SELECT_STATE)
  const [play, setPlay] = useState<Record<PlayerRole, Player>>(
    pipe(
      props.play,
      map((play) => [play.role, play] as [PlayerRole, Player]),
      fromEntries
    )
  )
  const currentPlay = useMemo(
    () => (props.role === Role.HOST ? undefined : play[props.role]),
    [props.role, play]
  )

  useEffect(() => {
    timeOut.current = setTimeout(() => {
      timeOut.current = null
      setIsLoading(false)
    }, 2000)

    return () => {
      timeOut.current && clearTimeout(timeOut.current)
    }
  }, [])
  useEffect(() => {
    channel.current = supabase
      .channel(`match:${props.match.matchId}`, {
        config: {
          broadcast: { self: true },
          presence: {
            key: props.role,
          },
        },
      })
      .on('presence', { event: 'join' }, (data) => {
        setPlay((prev) => {
          if (data.key === Role.HOST) return prev

          return pipe({ ...prev }, (payload) => {
            payload[data.key as PlayerRole].isConnected = true

            return payload
          })
        })
      })
      .on('presence', { event: 'leave' }, (data) => {
        setPlay((prev) => {
          if (data.key === Role.HOST) return prev

          return pipe({ ...prev }, (payload) => {
            payload[data.key as PlayerRole].isConnected = true

            return payload
          })
        })
      })
      // .on('presence', { event: 'sync' }, () => {})
      .on('broadcast', { event: BroadcastEvent.COMMON_BOSS_SELECT }, (response) => {
        setSelect((prev) => ({
          ...prev,
          [Phase.COMMON_BOSS_SELECT]: response.payload,
        }))
      })
      .on('broadcast', { event: BroadcastEvent.COMMON_BOSS_CONFIRM }, (response) => {
        setPlay(response.payload as BroadcastPayloadMap[BroadcastEvent.COMMON_BOSS_CONFIRM])
        setMatch((prev) => ({ ...prev, phase: Phase.BAN }))
      })
      .on('broadcast', { event: BroadcastEvent.BAN_SELECT }, (response) => {
        setSelect((prev) => ({ ...prev, [Phase.BAN]: response.payload }))
      })
      .on('broadcast', { event: BroadcastEvent.BAN_PROPOSE }, (response) => {
        setPlay((prev) => ({
          ...prev,
          ...(response.payload as BroadcastPayloadMap[BroadcastEvent.BAN_PROPOSE]),
        }))
        setSelect((prev) => ({ ...prev, [Phase.BAN]: [null, null] }))
      })
      .on('broadcast', { event: BroadcastEvent.BAN_FIX }, (response) => {
        setSelect((prev) => ({ ...prev, [Phase.BAN_FIX]: response.payload }))
      })
      .on('broadcast', { event: BroadcastEvent.BAN_CONFIRM }, (response) => {
        setPlay((prev) => {
          const newState = {
            ...prev,
            ...(response.payload as BroadcastPayloadMap[BroadcastEvent.BAN_CONFIRM]),
          }
          const isAllSelect = pipe(
            newState,
            entries,
            flatMap(([, play]) => play.selectBan),
            every(isNumber)
          )

          if (isAllSelect) setMatch((prev) => ({ ...prev, phase: Phase.PICK }))

          return newState
        })
        setSelect((prev) => ({ ...prev, [Phase.BAN_FIX]: [null] }))
      })
      .on('broadcast', { event: BroadcastEvent.BOSS_SELECT }, (response) => {
        setPlay((prev) => ({
          ...prev,
          ...(response.payload as BroadcastPayloadMap[BroadcastEvent.BOSS_SELECT]),
        }))
      })
      .on('broadcast', { event: BroadcastEvent.AGENT_PICK }, (response) => {
        setPlay((prev) => ({
          ...prev,
          ...(response.payload as BroadcastPayloadMap[BroadcastEvent.AGENT_PICK]),
        }))
      })
      .on('broadcast', { event: BroadcastEvent.ENGINE_PICK }, (response) => {
        setPlay((prev) => ({
          ...prev,
          ...(response.payload as BroadcastPayloadMap[BroadcastEvent.ENGINE_PICK]),
        }))
      })
      .on('broadcast', { event: BroadcastEvent.SCORE }, (response) => {
        setPlay((prev) => ({
          ...prev,
          ...(response.payload as BroadcastPayloadMap[BroadcastEvent.SCORE]),
        }))
      })
      .on('broadcast', { event: BroadcastEvent.TIME }, (response) => {
        setPlay((prev) => ({
          ...prev,
          ...(response.payload as BroadcastPayloadMap[BroadcastEvent.TIME]),
        }))
      })
      .on('broadcast', { event: BroadcastEvent.MATCH_TYPE }, (response) => {
        setMatch((prev) => ({
          ...prev,
          ...(response.payload as BroadcastPayloadMap[BroadcastEvent.MATCH_TYPE]),
        }))
      })
      .subscribe(async (status, error) => {
        if (status === 'SUBSCRIBED') {
          await channel.current?.track({
            role: props.role,
            onlineAt: new Date().toISOString(),
          })
        }
      })

    return () => {
      channel.current !== null && supabase.removeChannel(channel.current)
    }
  }, [props.match.matchId])

  return (
    <Context.Provider
      value={{
        match,
        select,
        play,
        currentPlay,
        send(event, payload) {
          if (channel.current === null) return

          channel.current.send({ type: 'broadcast', event, payload })
        },
      }}
    >
      {isLoading ? <Loading /> : props.children}
    </Context.Provider>
  )
}

export default MatchState
