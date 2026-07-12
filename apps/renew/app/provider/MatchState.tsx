import { BroadcastEvent, Phase, MatchType, Role } from '@/constant'
import { updateCommonBoss } from '@/lib/DB'
import { opponent, isBanFix } from '@/lib/utils'
import { type BroadcastPayloadMap, type Player, type PlayerRole } from '@/type'
import { pipe, isNull, filter, size, nth, isEmpty, includes, not } from '@fxts/core'
import { supabase, type RealtimeChannel } from '@zzz-picker/supabase'
import { createContext, useEffect, useMemo, useRef, useState } from 'react'

const INITIAL_SELECT_STATE = {
  [Phase.COMMON_BOSS_SELECT]: null as string | null,
  [Phase.BAN]: [] as Array<number | null>,
  [Phase.BAN_FIX]: [] as Array<number | null>,
}
const INITIAL_MATCH_STATE = {
  matchType: MatchType.ORIGINAL,
  boss: {
    [Role.A_SIDE]: [null, null] as [null | string, null | string],
    [Role.B_SIDE]: [null, null] as [null | string, null | string],
  },
  proposeBan: {
    [Role.A_SIDE]: [] as Array<null | number>,
    [Role.B_SIDE]: [] as Array<null | number>,
  },
  selectBan: {
    [Role.A_SIDE]: [] as Array<null | number>,
    [Role.B_SIDE]: [] as Array<null | number>,
  },
}

type Props = {
  children: React.ReactNode
  role: Role
  match: Record<Role, Player>
  matchType: MatchType
}
type State = {
  send: <T extends BroadcastEvent>(event: T, payload: BroadcastPayloadMap[T]) => void
  phase: Phase
  select: typeof INITIAL_SELECT_STATE
  isPicker: boolean
  player: Player | null
  state: typeof INITIAL_MATCH_STATE
}

export const Context = createContext<State>({
  send: () => {},
  phase: Phase.COMMON_BOSS_SELECT,
  select: INITIAL_SELECT_STATE,
  isPicker: false,
  player: null,
  state: INITIAL_MATCH_STATE,
})

const MatchState: React.FC<Props> = (props) => {
  const channel = useRef<null | RealtimeChannel>(null)
  const [select, setSelect] = useState(INITIAL_SELECT_STATE)
  const [macth, setMatch] = useState({
    matchType: props.matchType,
    boss: {
      [Role.A_SIDE]: props.match[Role.A_SIDE].boss,
      [Role.B_SIDE]: props.match[Role.B_SIDE].boss,
    },
    proposeBan: {
      [Role.A_SIDE]: props.match[Role.A_SIDE].proposeBan,
      [Role.B_SIDE]: props.match[Role.B_SIDE].proposeBan,
    },
    selectBan: {
      [Role.A_SIDE]: props.match[Role.A_SIDE].selectBan,
      [Role.B_SIDE]: props.match[Role.B_SIDE].selectBan,
    },
  })
  const player = useMemo(() => props.match[props.role], [props.role, props.match])
  const phase = useMemo(() => {
    if (macth.matchType === MatchType.UNLIMITED) return Phase.PICK
    if (pipe(macth.boss[Role.B_SIDE], nth(1), isNull)) return Phase.COMMON_BOSS_SELECT
    if (
      isBanFix(
        macth.proposeBan[props.role as PlayerRole],
        macth.selectBan[opponent(props.role) as PlayerRole]
      ) ||
      isBanFix(
        macth.proposeBan[opponent(props.role) as PlayerRole],
        macth.selectBan[props.role as PlayerRole]
      )
    )
      return Phase.BAN_FIX
    if (
      !includes(null, macth.selectBan[Role.A_SIDE]) &&
      !includes(null, macth.selectBan[Role.B_SIDE])
    )
      return Phase.PICK

    return Phase.BAN
  }, [macth, props.role])
  const isPicker = useMemo(() => {
    if (props.role === Role.HOST) return true
    if (phase === Phase.COMMON_BOSS_SELECT) return props.role === Role.B_SIDE
    if (phase === Phase.PICK) return true
    if (phase === Phase.BAN_FIX) {
      if (props.role === Role.A_SIDE) {
        return !(
          includes(null, macth.selectBan[Role.A_SIDE]) &&
          includes(null, macth.selectBan[Role.B_SIDE])
        )
      }
      if (props.role === Role.B_SIDE) {
        return (
          includes(null, macth.selectBan[Role.A_SIDE]) &&
          includes(null, macth.selectBan[Role.B_SIDE])
        )
      }

      return false
    }

    if (props.role === Role.A_SIDE) return includes(null, macth.selectBan[Role.B_SIDE])
    if (props.role === Role.B_SIDE) return !includes(null, macth.proposeBan[Role.A_SIDE])

    return false
  }, [phase, props.role, macth])

  useEffect(() => {
    channel.current = supabase
      .channel(`match:${player.matchId}`, {
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

        setMatch((prev) => ({
          ...prev,
          boss: {
            [Role.A_SIDE]: [null, response.payload],
            [Role.B_SIDE]: [null, response.payload],
          },
        }))
      })
      .on('broadcast', { event: BroadcastEvent.BAN_SELECT }, (response) => {
        setSelect((prev) => ({ ...prev, [Phase.BAN]: response.payload }))
      })
      .on('broadcast', { event: BroadcastEvent.BAN_PROPOSE }, (response) => {
        setMatch((prev) => ({
          ...prev,
          proposeBan: {
            ...prev.proposeBan,
            [response.payload.role]: response.payload.list,
          },
        }))
        setSelect((prev) => ({ ...prev, [Phase.BAN]: [] }))
      })
      .on('broadcast', { event: BroadcastEvent.BAN_FIX }, (response) => {
        setSelect((prev) => ({ ...prev, [Phase.BAN_FIX]: response.payload }))
      })
      .on('broadcast', { event: BroadcastEvent.BAN_CONFIRM }, (response) => {
        setMatch((prev) => ({
          ...prev,
          selectBan: {
            ...prev.selectBan,
            [response.payload.role]: response.payload.list,
          },
        }))
        setSelect((prev) => ({ ...prev, [Phase.BAN_FIX]: [] }))
      })
      .subscribe()

    return () => {
      channel.current !== null && supabase.removeChannel(channel.current)
    }
  }, [player])

  return isNull(player) ? null : (
    <Context.Provider
      value={{
        phase,
        select,
        isPicker,
        player,
        state: macth,
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
