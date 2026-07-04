import { pipe, concat, join } from '@fxts/core'
import { Plus } from '@zzz-picker/components/icons'
import type { SelectBoss } from '@zzz-picker/constant'
import { useStore } from '@zzz-picker/provider'
import { useMemo } from 'react'

type Props = {
  bossId: SelectBoss
  onClick?: () => void
}

/**
 * Boss 슬롯 컴포넌트
 */
const BossSlot: React.FC<Props> = ({ bossId, onClick }) => {
  const { boss } = useStore()
  const bossData = useMemo(() => (bossId === null ? undefined : boss.get(bossId)), [boss, bossId])

  return (
    <button
      type="button"
      onClick={onClick}
      className={pipe(
        [
          'aspect-[3/4]',
          'cursor-pointer',
          'focus:outline-none',
          'group',
          'overflow-hidden',
          'card-2',
          'inverse',
          'w-full',
          'transition-all',
          'duration-200',
        ],
        concat(
          bossData
            ? ['bg-netural', 'ring-2', 'ring-transparent', 'hover:ring-primary']
            : ['bg-content', 'flex', 'items-center', 'justify-center']
        ),
        join(' ')
      )}
    >
      {bossData ? (
        <img className="block w-full" src={bossData.images.src} alt={bossData.nameKo} />
      ) : (
        <Plus className="size-1/2 stroke-ink group-hover/button:stroke-primary" />
      )}
    </button>
  )
}

export default BossSlot
