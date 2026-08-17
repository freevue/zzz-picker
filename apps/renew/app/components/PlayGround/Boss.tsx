import { BroadcastEvent, BossType, Phase, Role } from '@/constant'
import { useMatch, useStore } from '@/hooks'
import { updateCommonBoss } from '@/lib/DB'
import {
  concat,
  join,
  map,
  pipe,
  toArray,
  isString,
  not,
  fromEntries,
  filter,
  isNull,
} from '@fxts/core'
import { CircleCheck } from 'lucide-react'
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
      <div className="flex-center h-full w-full px-4 max-w-lg mx-auto overflow-hidden flex-col">
        <p className="mb-8 ft-pre text-xl font-bold text-ink">
          {props.role === Role.A_SIDE && 'B 선수의 선택을 기다리고 있습니다.'}
          {props.role === Role.B_SIDE && '공용무대 보스를 선택해주세요.'}
        </p>
        <ul className="flex items-start justify-between gap-4 w-full">
          {pipe(
            store.deadlyAssault,
            filter(([, { type }]) => type === BossType.TRIAL),
            map(([id, boss]) => (
              <li key={id} className="aspect-square flex-1 text-center">
                <button
                  value={id}
                  onClick={onBossClick}
                  disabled={props.role !== Role.B_SIDE}
                  className={pipe(
                    [
                      'block',
                      'overflow-hidden',
                      'w-full',
                      'h-full',
                      'rounded-2xl',
                      'transition-transform',
                      'relative',
                    ],
                    concat(['disabled:grayscale-100', 'disabled:cursor-not-allowed']),
                    concat(
                      isNull(select[Phase.COMMON_BOSS_SELECT])
                        ? []
                        : select[Phase.COMMON_BOSS_SELECT] === id
                          ? ['disabled:grayscale-0!']
                          : ['grayscale-100']
                    ),
                    join(' ')
                  )}
                  type="button"
                >
                  <img
                    src={boss.src}
                    className="block w-full bg-accent-foreground"
                    alt={boss.nameKo}
                  />
                </button>
                <p
                  className={pipe(
                    [
                      'opacity-0',
                      'transition-opacity',
                      'text-primary',
                      'text-xl',
                      'ft-pre',
                      'font-black',
                    ],
                    concat(select[Phase.COMMON_BOSS_SELECT] === id ? ['opacity-100'] : []),
                    join(' ')
                  )}
                >
                  선택
                </p>
              </li>
            )),
            toArray
          )}
        </ul>
      </div>
      {props.role === Role.B_SIDE && (
        <div className={pipe(['fixed', 'bottom-0', 'left-0', 'right-0'], join(' '))}>
          <div className="px-4 pb-4 w-full max-w-lg mx-auto">
            <button
              type="button"
              disabled={not(isString(select[Phase.COMMON_BOSS_SELECT]))}
              onClick={onConfirmClick}
              className={pipe(
                [
                  'w-full',
                  'block',
                  'bg-primary',
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
          </div>
        </div>
      )}
    </>
  )
}

export default Boss
