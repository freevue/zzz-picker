import { concat, filter, includes, isString, join, map, pipe, toArray, uniq } from '@fxts/core'
import { useMemo } from 'react'
import { Dialog } from '~/components'
import { BroadcastEvent } from '~/constant'
import { useMatchState, useStore } from '~/hooks'
import type { PlayerRole } from '~/type'

type Props = {
  round: number
  active: boolean
  bossId?: string
  onClose: () => void
}

const BossDialog: React.FC<Props> = (props) => {
  const store = useStore()
  const matchState = useMatchState()
  const selectBoss = useMemo(() => {
    return pipe(matchState.pick.boss, filter(isString), uniq, toArray)
  }, [matchState])

  const onBossClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    matchState.send(BroadcastEvent.BOSS_SELECT, {
      bossId: event.currentTarget.value,
      round: props.round,
      side: matchState.player!.role as PlayerRole,
    })
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
                  concat(['active:outline-0', 'focus:outline-0']),
                  concat(['disabled:grayscale-100', 'disabled:cursor-not-allowed']),
                  join(' ')
                )}
                disabled={id !== props.bossId && includes(id, selectBoss)}
              >
                <img className="bg-ink block w-full rounded-xl" src={boss.src} />
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
