import { concat, join, pipe } from '@fxts/core'
import { Icons } from '@zzz-picker/components'
import type { Side } from '@zzz-picker/constant'
import { useStore } from '@zzz-picker/provider/hooks'
import { useMemo } from 'react'

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
  isPersonal?: boolean
  side?: Side
}> = ({ bossId, isPersonal, side }) => {
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

export const AdminBoss: React.FC<Props> = ({ roundId, boss, singleSide }) => {
  return (
    <div className="w-full px-4">
      <div className="flex overflow-hidden rounded-bl-2xl rounded-tr-2xl w-44 mx-auto">
        {roundId === 'common' ? (
          <SingleBossButton bossId={boss?.common ?? null} />
        ) : (
          <>
            {(!singleSide || singleSide === 'A') && (
              <SingleBossButton bossId={boss?.A ?? null} isPersonal side="A" />
            )}
            {(!singleSide || singleSide === 'B') && (
              <SingleBossButton bossId={boss?.B ?? null} isPersonal side="B" />
            )}
          </>
        )}
      </div>
    </div>
  )
}
