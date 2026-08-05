import { BroadcastEvent, BossType, Phase, Role } from '@/constant'
import { useMatch, useStore } from '@/hooks'
import { updateCommonBoss } from '@/lib/DB'
import { concat, join, map, pipe, toArray, isString, not, fromEntries, filter } from '@fxts/core'
import type { Player, PlayerRole } from '~/type'

type Props = {
  role: PlayerRole
}

const Boss: React.FC<Props> = (props) => {
  const store = useStore()
  const { select, send, match } = useMatch()

  const onBossClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    send(BroadcastEvent.COMMON_BOSS_SELECT, event.currentTarget.value)
  }
  const onConfirmClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (select[Phase.COMMON_BOSS_SELECT] === null) return

    send(
      BroadcastEvent.COMMON_BOSS_CONFIRM,
      await pipe(
        select[Phase.COMMON_BOSS_SELECT],
        updateCommonBoss(match.matchId),
        map((play) => [play.role, play] as [PlayerRole, Player]),
        fromEntries
      )
    )
  }

  return (
    <>
      <div className="flex h-full w-full items-center justify-center">
        <ul className="flex flex-wrap gap-4 items-center justify-center">
          {pipe(
            store.deadlyAssault,
            filter(([, { type }]) => type === BossType.TRIAL),
            map(([id, boss]) => (
              <li key={id}>
                <button
                  value={id}
                  onClick={onBossClick}
                  disabled={props.role !== Role.B_SIDE}
                  className={pipe(
                    ['block', 'aspect-144/199', 'w-40', 'card', 'p-2 rounded-2xl'],
                    concat(['disabled:grayscale-100', 'disabled:cursor-not-allowed']),
                    concat(
                      select[Phase.COMMON_BOSS_SELECT] === id
                        ? ['active', 'disabled:grayscale-0!']
                        : []
                    ),
                    join(' ')
                  )}
                  type="button"
                >
                  <img
                    src={boss.src}
                    className="block w-full h-full rounded-xl bg-accent-foreground relative z-1"
                    alt={boss.nameKo}
                  />
                </button>
              </li>
            )),
            toArray
          )}
        </ul>
      </div>
      {props.role === Role.B_SIDE && (
        <button
          type="button"
          disabled={not(isString(select[Phase.COMMON_BOSS_SELECT]))}
          onClick={onConfirmClick}
          className={pipe(
            [
              'max-w-lg',
              'mx-auto',
              'block',
              'bg-primary',
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

export default Boss
