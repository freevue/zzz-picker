import BossDialog from './BossDialog'
import CommonBoss from './CommonBoss'
import { pipe, isUndefined } from '@fxts/core'
import { useMemo, useState } from 'react'
import { Icon } from '~/components'
import { BossType, MatchType } from '~/constant'
import { useStore, useMatch } from '~/hooks'
import type { PlayerRole } from '~/type'

type Props = {
  round: number
  role: PlayerRole
}

const BossSelector: React.FC<Props> = (props) => {
  const store = useStore()
  const { match, currentPlay } = useMatch()
  const [open, setOpen] = useState<boolean>(false)
  const commonBossData = useMemo(() => {
    if (isUndefined(currentPlay)) return undefined

    const bossData = pipe(
      currentPlay.boss,
      (boss) => boss[props.round],
      (bossId) => store.deadlyAssault.get(bossId || '')!
    )

    if (isUndefined(bossData)) return undefined
    if (bossData.type === BossType.ADVERSITY) return bossData
    if (match.matchType === MatchType.UNLIMITED) return undefined
    if (props.round === 0) return undefined

    return pipe(
      currentPlay.boss,
      (boss) => boss[props.round],
      (bossId) => store.deadlyAssault.get(bossId || '')!
    )
  }, [match, currentPlay, props.round])
  const bossData = useMemo(() => {
    if (isUndefined(currentPlay)) return undefined

    return pipe(
      currentPlay.boss,
      (boss) => boss[props.round],
      (bossId) => store.deadlyAssault.get(bossId || '')
    )
  }, [currentPlay, store, props.round])
  const onEmptyBossClick = () => {
    setOpen(true)
  }

  return (
    <>
      <div className="max-w-lg mt-4 mx-auto card p-4 rounded-3xl">
        <h2 className="text-2xl font-bold text-primary ft-ria mb-4">Boss</h2>
        {isUndefined(commonBossData) ? (
          <button
            onClick={onEmptyBossClick}
            className="cursor-pointer text-8xl bg-accent size-48 flex items-center justify-center rounded-2xl overflow-hidden"
          >
            {isUndefined(bossData) ? (
              <Icon.Plus className="scale-75" />
            ) : (
              <div className="w-full h-full">
                <img
                  className="block w-full aspect-144/199 bg-accent-foreground"
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
        role={props.role}
        onClose={() => {
          setOpen(false)
        }}
        round={props.round}
      />
    </>
  )
}

export default BossSelector
