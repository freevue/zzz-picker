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
  name: {
    [Role.A_SIDE]: '',
    [Role.B_SIDE]: '',
  },
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
  agent: {
    [Role.A_SIDE]: {
      [0]: [null, null, null],
      [1]: [null, null, null],
    } as Record<number, [null | number, null | number, null | number]>,
    [Role.B_SIDE]: {
      [0]: [null, null, null],
      [1]: [null, null, null],
    } as Record<number, [null | number, null | number, null | number]>,
  },
  engine: {
    [Role.A_SIDE]: {
      [0]: [null, null, null],
      [1]: [null, null, null],
    } as Record<number, [null | string, null | string, null | string]>,
    [Role.B_SIDE]: {
      [0]: [null, null, null],
      [1]: [null, null, null],
    } as Record<number, [null | string, null | string, null | string]>,
  },
  rate: {
    [Role.A_SIDE]: {
      agents: {} as Record<number, number>,
      engines: {} as Record<string, number>,
    },
    [Role.B_SIDE]: {
      agents: {} as Record<number, number>,
      engines: {} as Record<string, number>,
    },
  },
}
const INITIAL_PICK = {
  boss: [null, null] as [null | string, null | string],
  proposeBan: [] as Array<null | number>,
  selectBan: [] as Array<null | number>,
  agent: {
    [0]: [null, null, null],
    [1]: [null, null, null],
  } as Record<number, [null | number, null | number, null | number]>,
  engine: {
    [0]: [null, null, null],
    [1]: [null, null, null],
  } as Record<number, [null | string, null | string, null | string]>,
  rate: {
    agents: {} as Record<number, number>,
    engines: {} as Record<string, number>,
  },
}

type Props = {
  children: React.ReactNode
  role: Role
  match: Record<PlayerRole, Player>
  matchType: MatchType
  matchId: string
}
type State = {
  send: <T extends BroadcastEvent>(event: T, payload: BroadcastPayloadMap[T]) => void
  phase: Phase
  select: typeof INITIAL_SELECT_STATE
  isPicker: boolean
  player: Player | null
  state: typeof INITIAL_MATCH_STATE
  pick: typeof INITIAL_PICK
}

export const Context = createContext<State>({
  send: () => {},
  phase: Phase.COMMON_BOSS_SELECT,
  select: INITIAL_SELECT_STATE,
  isPicker: false,
  player: null,
  state: INITIAL_MATCH_STATE,
  pick: INITIAL_PICK,
})

const MatchState: React.FC<Props> = (props) => {
  const channel = useRef<null | RealtimeChannel>(null)
  const [select, setSelect] = useState(INITIAL_SELECT_STATE)
  const [match, setMatch] = useState<typeof INITIAL_MATCH_STATE>({
    matchType: props.matchType,
    name: {
      [Role.A_SIDE]: props.match[Role.A_SIDE].name,
      [Role.B_SIDE]: props.match[Role.B_SIDE].name,
    },
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
    agent: {
      [Role.A_SIDE]: props.match[Role.A_SIDE].agent,
      [Role.B_SIDE]: props.match[Role.B_SIDE].agent,
    },
    engine: {
      [Role.A_SIDE]: props.match[Role.A_SIDE].engine,
      [Role.B_SIDE]: props.match[Role.B_SIDE].engine,
    },
    rate: {
      [Role.A_SIDE]: props.match[Role.A_SIDE].rate,
      [Role.B_SIDE]: props.match[Role.B_SIDE].rate,
    },
  })
  const player = useMemo(() => {
    if (props.role === Role.HOST) return null

    return props.match[props.role]
  }, [props.role, props.match])
  const pick = useMemo(() => {
    return {
      boss: match.boss[props.role as Role.A_SIDE | Role.B_SIDE],
      proposeBan: match.proposeBan[props.role as Role.A_SIDE | Role.B_SIDE],
      selectBan: match.selectBan[props.role as Role.A_SIDE | Role.B_SIDE],
      agent: match.agent[props.role as Role.A_SIDE | Role.B_SIDE],
      engine: match.engine[props.role as Role.A_SIDE | Role.B_SIDE],
      rate: match.rate[props.role as Role.A_SIDE | Role.B_SIDE],
    }
  }, [match, props.role])
  const phase = useMemo(() => {
    if (match.matchType === MatchType.UNLIMITED) return Phase.PICK
    if (pipe(match.boss[Role.B_SIDE], nth(1), isNull)) return Phase.COMMON_BOSS_SELECT
    if (
      isBanFix(
        match.proposeBan[Role.A_SIDE as PlayerRole],
        match.selectBan[opponent(Role.A_SIDE) as PlayerRole]
      ) ||
      isBanFix(
        match.proposeBan[Role.B_SIDE as PlayerRole],
        match.selectBan[opponent(Role.B_SIDE) as PlayerRole]
      )
    )
      return Phase.BAN_FIX
    if (
      !includes(null, match.selectBan[Role.A_SIDE]) &&
      !includes(null, match.selectBan[Role.B_SIDE])
    )
      return Phase.PICK

    return Phase.BAN
  }, [match])
  const isPicker = useMemo(() => {
    if (props.role === Role.HOST) return true
    if (phase === Phase.COMMON_BOSS_SELECT) return props.role === Role.B_SIDE
    if (phase === Phase.PICK) return true
    if (phase === Phase.BAN_FIX) {
      if (props.role === Role.A_SIDE) {
        return !(
          includes(null, match.selectBan[Role.A_SIDE]) &&
          includes(null, match.selectBan[Role.B_SIDE])
        )
      }
      if (props.role === Role.B_SIDE) {
        return (
          includes(null, match.selectBan[Role.A_SIDE]) &&
          includes(null, match.selectBan[Role.B_SIDE])
        )
      }

      return false
    }

    if (props.role === Role.A_SIDE) return includes(null, match.selectBan[Role.B_SIDE])
    if (props.role === Role.B_SIDE) return !includes(null, match.proposeBan[Role.A_SIDE])

    return false
  }, [phase, props.role, match])

  useEffect(() => {
    channel.current = supabase
      .channel(`match:${props.matchId}`, {
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
      .on('broadcast', { event: BroadcastEvent.BOSS_SELECT }, (response) => {
        const payload = response.payload as BroadcastPayloadMap[BroadcastEvent.BOSS_SELECT]

        setMatch((prev) => {
          return pipe(
            prev.boss[payload.side],
            (list) => {
              list[payload.round] = payload.bossId

              return list
            },
            (list) => ({ ...prev.boss, [payload.side]: list }),
            (boss) => ({ ...prev, boss })
          )
        })
      })
      .on('broadcast', { event: BroadcastEvent.COMMON_BOSS_CONFIRM }, async (response) => {
        const payload = response.payload as BroadcastPayloadMap[BroadcastEvent.COMMON_BOSS_CONFIRM]

        await updateCommonBoss(props.matchId, payload.bossId)

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
      .on('broadcast', { event: BroadcastEvent.AGENT_PICK }, (response) => {
        const payload = response.payload as BroadcastPayloadMap[BroadcastEvent.AGENT_PICK]

        setMatch((prev) => {
          return pipe(
            prev.agent[payload.role][payload.round],
            (list) => {
              list[payload.index] = payload.agentId

              return { ...prev.agent[payload.role], [payload.round]: list }
            },
            (agent) => ({
              ...prev,
              agent: { ...prev.agent, [payload.role]: agent },
            })
          )
        })
      })
      .on('broadcast', { event: BroadcastEvent.AGENT_RATE }, (response) => {
        const payload = response.payload as BroadcastPayloadMap[BroadcastEvent.AGENT_RATE]

        setMatch((prev) => {
          return pipe(
            prev.rate[payload.role].agents,
            (rate) => ({ ...rate, [payload.agentId]: payload.rate }),
            (agents) => ({ ...prev.rate[payload.role], agents }),
            (rate) => ({ ...prev.rate, [payload.role]: rate }),
            (rate) => ({ ...prev, rate })
          )
        })
      })
      .on('broadcast', { event: BroadcastEvent.ENGINE_PICK }, (response) => {
        const payload = response.payload as BroadcastPayloadMap[BroadcastEvent.ENGINE_PICK]

        setMatch((prev) => {
          return pipe(
            prev.engine[payload.role][payload.round],
            (list) => {
              list[payload.index] = payload.engineId

              return { ...prev.engine[payload.role], [payload.round]: list }
            },
            (engine) => ({
              ...prev,
              engine: { ...prev.engine, [payload.role]: engine },
            })
          )
        })
      })
      .on('broadcast', { event: BroadcastEvent.ENGINE_RATE }, (response) => {
        const payload = response.payload as BroadcastPayloadMap[BroadcastEvent.ENGINE_RATE]

        setMatch((prev) => {
          return pipe(
            prev.rate[payload.role].engines,
            (rate) => ({ ...rate, [payload.engineId]: payload.rate }),
            (engines) => ({ ...prev.rate[payload.role], engines }),
            (rate) => ({ ...prev.rate, [payload.role]: rate }),
            (rate) => ({ ...prev, rate })
          )
        })
      })
      .subscribe()

    return () => {
      channel.current !== null && supabase.removeChannel(channel.current)
    }
  }, [props.matchId])

  return (
    <Context.Provider
      value={{
        phase,
        select,
        isPicker,
        player,
        state: match,
        pick,
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
