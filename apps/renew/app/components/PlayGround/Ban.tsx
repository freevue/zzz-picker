import type { PlayerRole } from '@/type'
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
  when,
  append,
  head,
  isUndefined,
} from '@fxts/core'
import { useMemo } from 'react'
import { BroadcastEvent, Phase, Role, SETTING } from '~/constant'
import { useMatchState, useStore } from '~/hooks'
import { updateProposeBan, updateSelectBan } from '~/lib/DB'
import { opponent, getPosition } from '~/lib/utils'

type BanFixProps = {
  role: PlayerRole
  isPicker: boolean
  proposeBan: Record<Role.A_SIDE | Role.B_SIDE, Array<number | null>>
  active: Array<number | null>
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const BanFix: React.FC<BanFixProps> = (props) => {
  const store = useStore()

  return (
    <div className="fixed inset-0 backdrop-blur-xl">
      <div className="w-full h-full flex items-center justify-around max-w-lg mx-auto p-4">
        {pipe(
          props.role,
          when(() => props.isPicker, opponent),
          (role) => props.proposeBan[role],
          map((agentId) => store.agents.get(agentId as number)!),
          map((agent) => (
            <button
              onClick={props.onClick}
              value={agent.id}
              type="button"
              disabled={
                !includes(agent.id, props.active) &&
                props.active.length >= SETTING.MAX_PLAYER_BAN_FIX
              }
              className={pipe(
                [
                  'cursor-pointer',
                  'card',
                  'block',
                  'relative',
                  'w-2/5',
                  'aspect-square',
                  'p-2',
                  'rounded-2xl',
                  'overflow-hidden',
                ],
                concat(includes(agent.id, props.active) ? ['active'] : []),
                concat(['disabled:grayscale-100', 'disabled:cursor-not-allowed']),
                join(' ')
              )}
              key={agent.id}
            >
              <div
                className="w-full aspect-square overflow-hidden rounded-xl z-1 relative"
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
  )
}
const Ban: React.FC = () => {
  const store = useStore()
  const matchState = useMatchState()
  const firstBan = useMemo(() => {
    return pipe(matchState.state.selectBan[Role.B_SIDE], filter(isNumber), head, (agentId) =>
      store.agents.get(agentId || -1)
    )
  }, [matchState, store])

  const onBanAgentClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (!matchState.isPicker) return

    if (includes(Number(event.currentTarget.value), matchState.select[Phase.BAN])) {
      pipe(
        matchState.select[Phase.BAN],
        filter((id) => id !== Number(event.currentTarget.value)),
        toArray,
        (list) => {
          matchState.send(BroadcastEvent.BAN_SELECT, list)
        }
      )

      return
    }

    pipe(
      [...matchState.select[Phase.BAN], Number(event.currentTarget.value)],
      uniq,
      toArray,
      (list) => {
        matchState.send(BroadcastEvent.BAN_SELECT, list)
      }
    )
  }
  const onBanConfirm = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (matchState.player!.role === Role.HOST) return
    if (matchState.phase === Phase.BAN) {
      await pipe(
        matchState.select[Phase.BAN],
        filter(isNumber),
        toArray,
        updateProposeBan(matchState.player!)
      )

      matchState.send(BroadcastEvent.BAN_PROPOSE, {
        list: matchState.select[Phase.BAN],
        role: matchState.isPicker
          ? matchState.player!.role
          : (opponent(matchState.player!.role) as Role.A_SIDE | Role.B_SIDE),
      })
    }
    if (matchState.phase === Phase.BAN_FIX) {
      await pipe(
        matchState.select[Phase.BAN_FIX],
        filter(isNumber),
        toArray,
        updateSelectBan(matchState.player!)
      )

      matchState.send(BroadcastEvent.BAN_CONFIRM, {
        list: matchState.select[Phase.BAN_FIX],
        role: matchState.isPicker
          ? matchState.player!.role
          : (opponent(matchState.player!.role) as Role.A_SIDE | Role.B_SIDE),
      })
    }
  }
  const onBanFixClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (!matchState.isPicker) return

    pipe(
      Number(event.currentTarget.value),
      (id) =>
        includes(id, matchState.select[Phase.BAN_FIX])
          ? filter((selectId) => selectId !== id, matchState.select[Phase.BAN_FIX])
          : append(id, matchState.select[Phase.BAN_FIX]),
      uniq,
      toArray,
      (list) => matchState.send(BroadcastEvent.BAN_FIX, list)
    )
  }

  return (
    <>
      <div className="w-full h-full overflow-y-scroll pt-28 pb-14">
        <div className="w-full grid grid-cols-3 gap-4 p-4 max-w-xl mx-auto content-start">
          {pipe(
            store.agents,
            filter(([, agent]) => agent.isPickup),
            filter(([, agent]) => !agent.isAllow),
            filter(([, agent]) => {
              if (isUndefined(firstBan)) return true

              return getPosition(agent.specialty.nameKo) !== getPosition(firstBan.specialty.nameKo)
            }),
            sort((prev, cur) => prev[1].nameKo.localeCompare(cur[1].nameKo)),
            map(([id, agent]) => (
              <button
                onClick={onBanAgentClick}
                value={id}
                type="button"
                disabled={
                  !includes(id, matchState.select[Phase.BAN]) &&
                  (matchState.select[Phase.BAN].length >= SETTING.MAX_PLAYER_BAN_PROPOSE ||
                    !matchState.isPicker ||
                    matchState.phase !== Phase.BAN)
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
                    includes(id, matchState.select[Phase.BAN])
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

      {matchState.phase === Phase.BAN_FIX && (
        <BanFix
          onClick={onBanFixClick}
          active={matchState.select[Phase.BAN_FIX]}
          role={matchState.player!.role as PlayerRole}
          proposeBan={matchState.state.proposeBan}
          isPicker={matchState.isPicker}
        />
      )}

      {matchState.isPicker && (
        <button
          type="button"
          disabled={
            (matchState.phase === Phase.BAN &&
              matchState.select[Phase.BAN].length < SETTING.MAX_PLAYER_BAN_PROPOSE) ||
            (matchState.phase === Phase.BAN_FIX &&
              matchState.select[Phase.BAN_FIX].length < SETTING.MAX_PLAYER_BAN_FIX)
          }
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
