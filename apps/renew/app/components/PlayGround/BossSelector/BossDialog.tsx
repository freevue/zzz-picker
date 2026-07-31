import { updateBoss } from '@/lib/DB'
import {
  concat,
  filter,
  fromEntries,
  includes,
  isString,
  isUndefined,
  join,
  map,
  pipe,
  toArray,
  uniq,
} from '@fxts/core'
import { useMemo } from 'react'
import { Dialog } from '~/components'
import { BroadcastEvent } from '~/constant'
import { useMatch, useStore } from '~/hooks'
import type { Player, PlayerRole } from '~/type'

type Props = {
  round: number
  active: boolean
  bossId?: string
  role: PlayerRole
  onClose: () => void
}

const BossDialog: React.FC<Props> = (props) => {
  const store = useStore()
  const { currentPlay, send } = useMatch()
  const selectBoss = useMemo(() => {
    return pipe(currentPlay!.boss, filter(isString), uniq, toArray)
  }, [currentPlay])

  const onBossClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (isUndefined(currentPlay)) return

    send(
      BroadcastEvent.BOSS_SELECT,
      await pipe(
        currentPlay.boss,
        (list) => {
          list[props.round] = event.currentTarget.value

          return list
        },
        updateBoss(currentPlay.id),
        map((play) => [play.role, play] as [PlayerRole, Player]),
        fromEntries
      )
    )

    props.onClose()
  }

  return (
    <Dialog active={props.active}>
      <ul className="flex h-screen items-center gap-2 px-4 max-w-lg mx-auto">
        {pipe(
          store.deadlyAssault,
          map(([id, boss]) => (
            <li className="flex-1" key={id}>
              <button
                onClick={onBossClick}
                type="button"
                value={id}
                className={pipe(
                  ['card', 'rounded-2xl', 'p-2', 'cursor-pointer', 'overflow-hidden'],
                  concat(id === props.bossId ? ['active'] : []),
                  concat(['disabled:grayscale-100', 'disabled:cursor-not-allowed']),
                  join(' ')
                )}
                disabled={id !== props.bossId && includes(id, selectBoss)}
              >
                <img className="bg-ink block w-full rounded-xl relative z-1" src={boss.src} />
              </button>
            </li>
          )),
          toArray
        )}
      </ul>
    </Dialog>
  )
}

export default BossDialog
