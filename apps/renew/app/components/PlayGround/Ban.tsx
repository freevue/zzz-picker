import {
  filter,
  map,
  pipe,
  sort,
  toArray,
  join,
  concat,
  includes,
  when,
  append,
  not,
  uniq,
  size,
  isNumber,
  transpose,
  zip,
} from '@fxts/core'
import { BroadcastEvent, Phase, Role } from '~/constant'
import { useMatchState, useStore } from '~/hooks'
import { Player } from '~/type'

type Props = {
  player: Player
}

const Ban: React.FC<Props> = (props) => {
  const store = useStore()
  const matchState = useMatchState()

  const onBanAgentClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (props.player.role === Role.A_SIDE) return

    if (includes(Number(event.currentTarget.value), matchState.select[Phase.BAN])) {
      pipe(
        matchState.select[Phase.BAN],
        filter((id) => id !== Number(event.currentTarget.value)),
        toArray,
        (list) => {
          matchState.send(BroadcastEvent.FIRST_BAN_SELECT, list)
        }
      )

      return
    }

    pipe(
      [...matchState.select[Phase.BAN], Number(event.currentTarget.value)],
      uniq,
      toArray,
      (list) => {
        matchState.send(BroadcastEvent.FIRST_BAN_SELECT, list)
      }
    )

    // matchState.send(BroadcastEvent.FIRST_BAN_SELECT, event.currentTarget.value)
  }

  return (
    <>
      <div className="w-full h-full overflow-y-scroll pt-28 pb-14">
        <div className="w-full grid grid-cols-3 gap-4 p-4 max-w-xl mx-auto content-start">
          {pipe(
            store.agents,
            filter(([, agent]) => agent.isPickup),
            sort((prev, cur) => prev[1].nameKo.localeCompare(cur[1].nameKo)),
            map(([id, agent]) => (
              <button
                onClick={onBanAgentClick}
                value={id}
                type="button"
                disabled={
                  not(includes(id, matchState.select[Phase.BAN])) &&
                  size(matchState.select[Phase.BAN]) >= 2
                }
                className={pipe(
                  [
                    'cursor-pointer',
                    'card',
                    'block',
                    'p-2',
                    'rounded-2xl',
                    'active:outline-0',
                    'focus:outline-0',
                    'relative',
                    'overflow-hidden',
                  ],
                  concat(['disabled:grayscale-100', 'cursor-not-allowed']),
                  concat(
                    includes(id, matchState.select[Phase.BAN])
                      ? ['active', 'before:h-full', 'before:aspect-square']
                      : []
                  ),
                  join(' ')
                )}
                key={id}
              >
                <div
                  className="w-full aspect-square overflow-hidden rounded-xl"
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

      <button
        type="button"
        disabled={!matchState.isPicker}
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
          concat(['disabled:cursor-not-allowed', 'disabled:grayscale-100', 'disabled:opacity-30']),
          join(' ')
        )}
      >
        선택
      </button>
    </>
  )
}

export default Ban
