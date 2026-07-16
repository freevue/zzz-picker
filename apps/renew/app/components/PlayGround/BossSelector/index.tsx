import BossDialog from './BossDialog'
import CommonBoss from './CommonBoss'
import { isNull, pipe, find, not, isUndefined } from '@fxts/core'
import { useMemo, useState } from 'react'
import { MatchType } from '~/constant'
import { useStore, useMatchState } from '~/hooks'
import type { PlayerRole } from '~/type'

type Props = {
  round: number
}

const BossSelector: React.FC<Props> = (props) => {
  const store = useStore()
  const matchState = useMatchState()
  const [open, setOpen] = useState<boolean>(false)
  const commonBossData = useMemo(() => {
    if (matchState.state.matchType === MatchType.UNLIMITED) return undefined
    if (props.round === 0) return undefined

    return pipe(
      matchState.player!.role as PlayerRole,
      (role) => matchState.state.boss[role],
      (boss) => boss[props.round],
      (bossId) => store.deadlyAssault.get(bossId || '')!
    )
  }, [matchState, props.round, store])
  const bossData = useMemo(() => {
    return pipe(
      matchState.player!.role as PlayerRole,
      (role) => matchState.state.boss[role],
      (bossState) => bossState[props.round],
      (bossId) => store.deadlyAssault.get(bossId || '')
    )
  }, [matchState, store, props.round])
  const onEmptyBossClick = () => {
    setOpen(true)
  }

  return (
    <>
      <div className="max-w-lg mx-auto mt-4 flex gap-4">
        {isUndefined(commonBossData) ? (
          <button
            onClick={onEmptyBossClick}
            className="cursor-pointer focus:outline-0 active:outline-0 text-8xl card size-48 flex items-center justify-center rounded-2xl overflow-hidden p-2"
          >
            {isUndefined(bossData) ? (
              '+'
            ) : (
              <div className="w-full h-full overflow-hidden rounded-xl">
                <img
                  className="block w-full aspect-144/199 bg-ink"
                  src={bossData.src}
                  alt={bossData.nameKo}
                />
              </div>
            )}
          </button>
        ) : (
          <CommonBoss boss={commonBossData} />
        )}
      </div>
      <BossDialog
        active={open}
        bossId={bossData?.id}
        onClose={() => {
          setOpen(false)
        }}
        round={props.round}
      />
    </>
  )
}

export default BossSelector
