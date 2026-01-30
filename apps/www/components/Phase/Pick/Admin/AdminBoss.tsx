import { concat, join, pipe } from '@fxts/core'
import { Icons } from '@zzz-picker/components'
import { Dialog } from '@zzz-picker/components/v2'
import type { Side } from '@zzz-picker/constant'
import { useStore } from '@zzz-picker/provider/hooks'
import { useMemo, useState } from 'react'
import { BossDialog } from '~/components'

type Props = {
  roundId: 'personal' | 'common'
  boss?: {
    A?: number | null
    B?: number | null
    common?: number | null
  }
  singleSide?: Side
  onUpdate: (updates: { side?: Side; bossId: number; isCommon?: boolean }) => void
}

const SingleBossButton: React.FC<{
  bossId: number | null
  onClick: () => void
  isPersonal?: boolean
  side?: Side
}> = ({ bossId, onClick, isPersonal, side }) => {
  const { boss } = useStore()
  const bossData = useMemo(() => (bossId === null ? undefined : boss.get(bossId)), [boss, bossId])

  return (
    <button
      className={pipe(
        ['aspect-[3/4] group focus:outline-none cursor-pointer relative flex-1'],
        concat(bossData ? ['bg-netural'] : ['items-center justify-center flex bg-content']),
        concat(
          isPersonal && side === 'A'
            ? [
                'not-last:after:content-[""] not-last:after:block not-last:after:absolute not-last:after:w-1 not-last:after:h-2/3 not-last:after:bg-netural not-last:after:rounded-full not-last:after:right-0 not-last:after:top-1/2 not-last:after:-translate-y-1/2 not-last:after:translate-x-1/2 not-last:after:z-1',
              ]
            : []
        ),
        join(' ')
      )}
      type="button"
      onClick={onClick}
    >
      {bossData ? (
        <img
          className="block w-full"
          src={`/images/boss/${bossData.id}.webp`}
          alt={bossData.nameKo}
        />
      ) : (
        <Icons.Plus className="stroke-ink block size-10 group-hover:stroke-primary" />
      )}
    </button>
  )
}

export const AdminBoss: React.FC<Props> = ({ roundId, boss, singleSide, onUpdate }) => {
  const [target, setTarget] = useState<Side | 'common' | null>(null)

  const onBossChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!target) return
    const bossId = Number(event.currentTarget.value)
    onUpdate({
      side: target === 'common' ? undefined : target,
      bossId,
      isCommon: target === 'common',
    })
    setTarget(null)
  }

  return (
    <div className="w-full px-4">
      <div className="flex overflow-hidden rounded-bl-2xl rounded-tr-2xl w-44 mx-auto">
        {roundId === 'common' ? (
          <SingleBossButton bossId={boss?.common ?? null} onClick={() => setTarget('common')} />
        ) : (
          <>
            {(!singleSide || singleSide === 'A') && (
              <SingleBossButton
                bossId={boss?.A ?? null}
                isPersonal
                side="A"
                onClick={() => setTarget('A')}
              />
            )}
            {(!singleSide || singleSide === 'B') && (
              <SingleBossButton
                bossId={boss?.B ?? null}
                isPersonal
                side="B"
                onClick={() => setTarget('B')}
              />
            )}
          </>
        )}
      </div>
      <Dialog isOpen={!!target} onClose={() => setTarget(null)}>
        <BossDialog
          active={(target === 'common' ? boss?.common : target ? boss?.[target] : null) ?? null}
          onClick={onBossChange}
        />
      </Dialog>
    </div>
  )
}
