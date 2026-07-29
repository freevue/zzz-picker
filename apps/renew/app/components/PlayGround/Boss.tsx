import { BroadcastEvent, Phase, Role } from '@/constant'
import { useMatchState, useStore } from '@/hooks'
import { concat, join, map, pipe, toArray, isString, not } from '@fxts/core'

const Boss: React.FC = () => {
  const store = useStore()
  const mathState = useMatchState()

  const onBossClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    mathState.send(BroadcastEvent.COMMON_BOSS_SELECT, event.currentTarget.value)
  }
  const onConfirmClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (mathState.select[Phase.COMMON_BOSS_SELECT] === null) return

    mathState.send(BroadcastEvent.COMMON_BOSS_CONFIRM, {
      playerId: mathState.player!.id,
      bossId: mathState.select[Phase.COMMON_BOSS_SELECT],
    })
  }

  return (
    <>
      <div className="flex h-full w-full items-center justify-center">
        <ul className="flex flex-wrap gap-4 items-center justify-center">
          {pipe(
            store.deadlyAssault,
            map(([id, boss]) => (
              <li key={id}>
                <button
                  value={id}
                  onClick={onBossClick}
                  disabled={mathState.player!.role !== Role.B_SIDE}
                  className={pipe(
                    ['block', 'aspect-144/199', 'w-40', 'card', 'p-2 rounded-2xl'],
                    concat(['disabled:grayscale-100', 'disabled:cursor-not-allowed']),
                    concat(
                      mathState.select[Phase.COMMON_BOSS_SELECT] === id
                        ? ['active', 'disabled:grayscale-0!']
                        : []
                    ),
                    join(' ')
                  )}
                  type="button"
                >
                  <img
                    src={boss.src}
                    className="block w-full h-full rounded-xl bg-accent-foreground"
                    alt={boss.nameKo}
                  />
                </button>
              </li>
            )),
            toArray
          )}
        </ul>
      </div>
      {mathState.player!.role === Role.B_SIDE && (
        <button
          type="button"
          disabled={not(isString(mathState.select[Phase.COMMON_BOSS_SELECT]))}
          onClick={onConfirmClick}
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

export default Boss
