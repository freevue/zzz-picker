import BanFix from './BanFix'
import type { Player, PlayerRole } from '@/type'
import {
  filter,
  map,
  pipe,
  sort,
  toArray,
  join,
  concat,
  includes,
  uniq,
  isNumber,
  isUndefined,
  every,
  isNull,
  some,
  fromEntries,
  flat,
  isObject,
  entries,
  flatMap,
  size,
  findIndex,
} from '@fxts/core'
import { useMemo } from 'react'
import { BroadcastEvent, Phase, Role, SETTING } from '~/constant'
import { useMatch, useStore } from '~/hooks'
import { updateMatchPhase, updateProposeBan, updateSelectBan } from '~/lib/DB'
import { getPosition } from '~/lib/utils'

type Props = {
  role: PlayerRole
}

const Ban: React.FC<Props> = (props) => {
  const store = useStore()
  const { match, select, play, send, currentPlay } = useMatch()
  const isPicker = useMemo(() => {
    if (props.role === Role.A_SIDE) {
      if (some(isNull, play[Role.A_SIDE].proposeBan)) return true
      if (
        every(isNumber, play[Role.A_SIDE].proposeBan) &&
        every(isNumber, play[Role.B_SIDE].selectBan) &&
        every(isNumber, play[Role.B_SIDE].proposeBan) &&
        some(isNull, play[Role.A_SIDE].selectBan)
      )
        return true
    }
    if (props.role === Role.B_SIDE) {
      if (
        every(isNumber, play[Role.A_SIDE].proposeBan) &&
        some(isNull, play[Role.B_SIDE].selectBan)
      )
        return true
      if (
        every(isNumber, play[Role.A_SIDE].proposeBan) &&
        every(isNumber, play[Role.B_SIDE].selectBan) &&
        some(isNull, play[Role.B_SIDE].proposeBan)
      )
        return true
    }

    return false
  }, [play, props.role])
  const isBanFix = useMemo(() => {
    if (every(isNumber, play[Role.A_SIDE].proposeBan) && some(isNull, play[Role.B_SIDE].selectBan))
      return true
    if (every(isNumber, play[Role.B_SIDE].proposeBan) && some(isNull, play[Role.A_SIDE].selectBan))
      return true

    return false
  }, [play, props.role])
  const currentProposeBan = useMemo(() => {
    return every(isNumber, play[Role.B_SIDE].selectBan)
      ? play[Role.B_SIDE].proposeBan
      : play[Role.A_SIDE].proposeBan
  }, [play])
  const isDisabled = useMemo(() => {
    if (isBanFix) return select[Phase.BAN_FIX].length !== SETTING.MAX_PLAYER_BAN_FIX
    if (match.phase === Phase.BAN)
      return pipe(select[Phase.BAN], filter(isNumber), size) !== SETTING.MAX_PLAYER_BAN_PROPOSE

    return true
  }, [match, select, isBanFix])
  const isBanList = useMemo(() => {
    return pipe(
      [play[Role.A_SIDE].selectBan, play[Role.B_SIDE].selectBan],
      flat,
      filter(isNumber),
      map((agentId) => store.agents.get(agentId)),
      filter(isObject),
      map((agent) => agent.specialty.nameKo),
      map(getPosition),
      uniq,
      toArray
    )
  }, [play, store])

  const onBanAgentClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (!isPicker) return
    if (includes(Number(event.currentTarget.value), select[Phase.BAN])) {
      const index = findIndex((id) => id === Number(event.currentTarget.value), select[Phase.BAN])

      pipe(
        select[Phase.BAN],
        (list) => {
          list[index] = null

          return list
        },
        (list) => {
          send(BroadcastEvent.BAN_SELECT, list)
        }
      )

      return
    }

    const index = findIndex(isNull, select[Phase.BAN])

    pipe(
      select[Phase.BAN],
      (list) => {
        list[index] = Number(event.currentTarget.value)

        return list
      },
      (list) => {
        send(BroadcastEvent.BAN_SELECT, list)
      }
    )
  }
  const onBanConfirm = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (isUndefined(currentPlay)) return
    if (currentPlay.role === Role.HOST) return

    if (isBanFix) {
      const player = await pipe(
        select[Phase.BAN_FIX],
        filter(isNumber),
        toArray,
        updateSelectBan(currentPlay.id),
        map((play) => [play.role, play] as [PlayerRole, Player]),
        fromEntries
      )
      const isAllSelect = pipe(
        { ...play, ...player },
        entries,
        flatMap(([, play]) => play.selectBan),
        every(isNumber)
      )

      if (isAllSelect) await pipe(Phase.PICK, updateMatchPhase(match.matchId))

      send(BroadcastEvent.BAN_CONFIRM, player)

      return
    }

    send(
      BroadcastEvent.BAN_PROPOSE,
      await pipe(
        select[Phase.BAN],
        filter(isNumber),
        toArray,
        updateProposeBan(currentPlay.id),
        map((play) => [play.role, play] as [PlayerRole, Player]),
        fromEntries
      )
    )
  }
  const onBanFixClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (!isPicker) return
    if (includes(Number(event.currentTarget.value), select[Phase.BAN_FIX])) {
      const index = findIndex(
        (id) => id === Number(event.currentTarget.value),
        select[Phase.BAN_FIX]
      )

      pipe(
        select[Phase.BAN_FIX],
        (list) => {
          list[index] = null

          return list
        },
        (list) => {
          send(BroadcastEvent.BAN_FIX, list)
        }
      )

      return
    }

    const index = findIndex(isNull, select[Phase.BAN_FIX])

    pipe(
      select[Phase.BAN_FIX],
      (list) => {
        list[index] = Number(event.currentTarget.value)

        return list
      },
      toArray,
      (list) => send(BroadcastEvent.BAN_FIX, list)
    )
  }

  return (
    <>
      <div className="w-full h-dvh overflow-y-scroll pt-16 pb-14">
        <div className="w-full grid grid-cols-3 gap-4 p-4 max-w-xl mx-auto content-start">
          {pipe(
            store.agents,
            filter(([, agent]) => agent.isPickup),
            filter(([, agent]) => !agent.isTeaser),
            filter(([, agent]) => !agent.isAllow),
            filter(([, agent]) => !includes(getPosition(agent.specialty.nameKo), isBanList)),
            sort((prev, cur) => prev[1].nameKo.localeCompare(cur[1].nameKo)),
            map(([id, agent]) => (
              <button
                onClick={onBanAgentClick}
                value={id}
                type="button"
                disabled={
                  !includes(id, select[Phase.BAN]) &&
                  (size(filter(isNumber, select[Phase.BAN])) >= SETTING.MAX_PLAYER_BAN_PROPOSE ||
                    !isPicker ||
                    match.phase !== Phase.BAN)
                }
                className={pipe(
                  [
                    'cursor-pointer',
                    'card',
                    'block',
                    'p-2',
                    'rounded-2xl',
                    'relative',
                    'overflow-hidden',
                  ],
                  concat(['disabled:grayscale-100', 'cursor-not-allowed']),
                  concat(
                    includes(id, select[Phase.BAN])
                      ? ['active', 'grayscale-0!', 'before:h-full', 'before:aspect-square']
                      : []
                  ),
                  join(' ')
                )}
                key={id}
              >
                <div
                  className="w-full aspect-square overflow-hidden rounded-xl relative z-1"
                  style={{ backgroundColor: agent.color || 'transparent' }}
                >
                  <img className="w-full block" src={agent.profile} alt={agent.nameKo} />
                </div>
              </button>
            )),
            toArray
          )}
        </div>
      </div>

      {isBanFix && (
        <BanFix
          onClick={onBanFixClick}
          active={select[Phase.BAN_FIX]}
          proposeBan={currentProposeBan}
        />
      )}

      {isPicker && (
        <button
          type="button"
          disabled={isDisabled}
          onClick={onBanConfirm}
          className={pipe(
            [
              'max-w-lg',
              'mx-auto',
              'block',
              'bg-primary',
              'active:outline-0',
              'focus:outline-0',
              'fixed',
              'bottom-4',
              'left-4',
              'right-4',
              'rounded-full',
              'font-bold',
              'ft-ria',
              'text-base',
              'text-2xl',
              'py-2',
              'cursor-pointer',
              'z-21',
            ],
            concat([
              'disabled:cursor-not-allowed',
              'disabled:grayscale-100',
              'disabled:opacity-30',
            ]),
            join(' ')
          )}
        >
          선택
        </button>
      )}
    </>
  )
}

export default Ban
