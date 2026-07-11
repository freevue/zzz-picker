import { BroadcastEvent, Phase, MatchType, Role } from '@/constant'
import { updateCommonBoss, selectMatchPlayer, selectMath } from '@/lib/DB'
import { type BroadcastPayloadMap, type Player, type Match } from '@/type'
import {
  append,
  pipe,
  slice,
  toArray,
  last,
  not,
  isNull,
  concat,
  uniq,
  isString,
  map,
  fromEntries,
  filter,
  size,
  compact,
} from '@fxts/core'
import { supabase, type RealtimeChannel } from '@zzz-picker/supabase'
import { createContext, useEffect, useMemo, useRef, useState } from 'react'

const INITIAL_SELECT_STATE = {
  [Phase.COMMON_BOSS_SELECT]: null as string | null,
  [Phase.BAN]: [],
}

type Props = {
  children: React.ReactNode
  player: Player
  match: Array<Player>
}
type State = {
  send: <T extends BroadcastEvent>(event: T, payload: BroadcastPayloadMap[T]) => void
  phase: Phase
  select: typeof INITIAL_SELECT_STATE
  isPicker: boolean
}

export const Context = createContext<State>({
  send: () => {},
  phase: Phase.COMMON_BOSS_SELECT,
  select: INITIAL_SELECT_STATE,
  isPicker: false,
})

const MatchState: React.FC<Props> = (props) => {
  const channel = useRef<null | RealtimeChannel>(null)
  const [player, setPlayer] = useState<Player>(props.player)
  const [select, setSelect] = useState(INITIAL_SELECT_STATE)
  const matchState = useMemo(() => {
    return pipe(
      props.match,
      map((player) => [player.role, player] as [Role.A_SIDE | Role.B_SIDE, Player]),
      fromEntries,
      (data) => ({
        ...data,
        state: {
          ban: [...data[Role.A_SIDE].selectBan, ...data[Role.B_SIDE].selectBan],
          matchType: data[Role.A_SIDE].matchType,
        },
      })
    )
  }, [props.match, player])
  const phase = useMemo(() => {
    if (matchState.state.matchType === MatchType.UNLIMITED) return Phase.PICK
    if (pipe(matchState.state.ban, filter(isNull), size) === 0) return Phase.PICK
    if (isNull(player.boss[1])) return Phase.COMMON_BOSS_SELECT

    return Phase.BAN
  }, [player, matchState])
  const isPicker = useMemo(() => {
    if (phase === Phase.COMMON_BOSS_SELECT) return player.role === Role.B_SIDE
    if (phase === Phase.PICK) return true

    return pipe(player.selectBan, filter(isNull), size) > 0
  }, [phase, player])

  console.log({ phase, player })

  useEffect(() => {
    channel.current = supabase
      .channel(`match:${props.player.matchId}`, {
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
      .on('broadcast', { event: BroadcastEvent.COMMON_BOSS_CONFIRM }, async (response) => {
        await updateCommonBoss(player, response.payload)
        console.log(response.payload)

        setPlayer((prev) => ({ ...prev, boss: [null, response.payload] }))
      })
      .on('broadcast', { event: BroadcastEvent.FIRST_BAN_SELECT }, (response) => {
        setSelect((prev) => ({
          ...prev,
          [Phase.BAN]: response.payload,
        }))
      })
      .on('broadcast', { event: BroadcastEvent.BOSS_SELECT }, (response) => {
        console.log(response)
      })
      .subscribe()

    return () => {
      channel.current !== null && supabase.removeChannel(channel.current)
    }
  }, [props.player.matchId])

  return (
    <Context.Provider
      value={{
        phase,
        select,
        isPicker,
        send(event, payload) {
          if (channel.current === null) return

          channel.current.send({
            type: 'broadcast',
            event,
            payload,
          })
        },
      }}
    >
      {props.children}
    </Context.Provider>
  )
}

export default MatchState
