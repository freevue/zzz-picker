import { entries, every, flatMap, fromEntries, isNumber, map, pipe } from '@fxts/core'
import { supabase, type RealtimeChannel } from '@zzz-picker/supabase'
import { createContext, useEffect, useMemo, useRef, useState } from 'react'
import { MatchType, Phase, Role, BroadcastEvent } from '~/constant'
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
} as Player
const INITIAL_SELECT_STATE = {
  [Phase.COMMON_BOSS_SELECT]: null as string | null,
  [Phase.BAN]: [] as Array<number | null>,
  [Phase.BAN_FIX]: [] as Array<number | null>,
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
  const channel = useRef<null | RealtimeChannel>(null)
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
    channel.current = supabase
      .channel(`match:${props.match.matchId}`, {
        config: {
          broadcast: { self: true },
        },
      })
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
        setSelect((prev) => ({ ...prev, [Phase.BAN]: [] }))
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
        setSelect((prev) => ({ ...prev, [Phase.BAN_FIX]: [] }))
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

      .on('broadcast', { event: BroadcastEvent.AGENT_RATE }, (response) => {
        // const payload = response.payload as BroadcastPayloadMap[BroadcastEvent.AGENT_RATE]
        // setMatch((prev) => {
        //   return pipe(
        //     prev.rate[payload.role].agents,
        //     (rate) => ({ ...rate, [payload.agentId]: payload.rate }),
        //     (agents) => ({ ...prev.rate[payload.role], agents }),
        //     (rate) => ({ ...prev.rate, [payload.role]: rate }),
        //     (rate) => ({ ...prev, rate })
        //   )
        // })
      })
      .on('broadcast', { event: BroadcastEvent.ENGINE_RATE }, (response) => {
        // const payload = response.payload as BroadcastPayloadMap[BroadcastEvent.ENGINE_RATE]
        // setMatch((prev) => {
        //   return pipe(
        //     prev.rate[payload.role].engines,
        //     (rate) => ({ ...rate, [payload.engineId]: payload.rate }),
        //     (engines) => ({ ...prev.rate[payload.role], engines }),
        //     (rate) => ({ ...prev.rate, [payload.role]: rate }),
        //     (rate) => ({ ...prev, rate })
        //   )
        // })
      })
      .subscribe()

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
      {props.children}
    </Context.Provider>
  )
}

export default MatchState
