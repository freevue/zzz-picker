import { BroadcastEvent, Phase, Role } from '@/constant'
import { useMatchState, useStore } from '@/hooks'
import { concat, join, map, pipe, toArray, isEmpty, isString, not } from '@fxts/core'
import { Player } from '~/type'

type Props = {
  player: Player
}

const Boss: React.FC<Props> = (props) => {
  const store = useStore()
  const mathState = useMatchState()

  const onBossClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    mathState.send(BroadcastEvent.COMMON_BOSS_SELECT, event.currentTarget.value)
  }
  const onConfirmClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (mathState.select[Phase.COMMON_BOSS_SELECT] === null) return

    mathState.send(BroadcastEvent.COMMON_BOSS_CONFIRM, mathState.select[Phase.COMMON_BOSS_SELECT])
  }

  return (
    <>
      <div className="flex h-full w-full items-center justify-center">
        <ul className="flex flex-wrap gap-4 items-center justify-center">
          {pipe(
            store.deadlyAssault,
            map((boss) => (
              <li key={boss.id}>
                <button
                  value={boss.id}
                  onClick={onBossClick}
                  disabled={props.player.role !== Role.B_SIDE}
                  className={pipe(
                    [
                      'block',
                      'w-40 card p-2 rounded-2xl overflow-hidden',
                      'active:outline-0',
                      'focus:outline-0',
                    ],
                    concat(['disabled:grayscale-100', 'disabled:cursor-not-allowed']),
                    concat(
                      mathState.select[Phase.COMMON_BOSS_SELECT] === boss.id
                        ? [
                            'active',
                            'before:h-full',
                            'before:aspect-square',
                            'disabled:grayscale-0!',
                          ]
                        : []
                    ),
                    join(' ')
                  )}
                  type="button"
                >
                  <img
                    src={boss.src}
                    className="block w-full rounded-xl aspect-144/199 bg-ink"
                    alt={boss.nameKo}
                  />
                </button>
              </li>
            )),
            toArray
          )}
        </ul>
      </div>
      {props.player.role === Role.B_SIDE && (
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
