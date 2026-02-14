import { pipe, concat, join } from '@fxts/core'
import type { Boss } from '@zzz-picker/constant'
import { motion } from 'motion/react'

type Props = {
  index: number
  boss: Boss
  isSelected: boolean
  isPlayerB: boolean
  currentBossId: number | null
  onClick: () => void
}

const BossCard: React.FC<Props> = ({
  index,
  boss,
  isSelected,
  isPlayerB,
  currentBossId,
  onClick,
}) => {
  return (
    <motion.li
      className="min-w-3xs"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.2 }}
    >
      <button
        className={pipe(
          ['w-full', 'group', 'block', 'focus:outline-none', 'relative'],
          concat(isPlayerB ? ['cursor-pointer'] : ['cursor-default']),
          join(' ')
        )}
        type="button"
        onClick={onClick}
        disabled={!isPlayerB}
      >
        <div
          className={pipe(
            ['w-full', 'md:card', 'card-2', 'bg-netural', 'border-4', 'transition-all'],
            concat(
              isSelected
                ? ['border-primary shadow-xl shadow-primary/20 scale-105']
                : isPlayerB
                  ? ['group-hover:border-primary/50', 'border-transparent', 'grayscale']
                  : ['border-transparent', 'grayscale', 'opacity-50']
            ),
            concat(currentBossId && currentBossId !== boss.id ? ['grayscale opacity-50'] : []),
            join(' ')
          )}
        >
          <img
            className="block w-full aspect-[3/4] object-cover"
            src={`/images/boss/${boss.id}.webp`}
            alt={boss.nameKo}
          />
        </div>
        <span
          className={pipe(
            ['text-ink heading-xl mt-6 block w-full text-center break-keep transition-colors'],
            concat(isSelected ? ['text-primary'] : ['group-hover:text-primary']),
            join(' ')
          )}
        >
          {boss.nameKo}
        </span>
      </button>
    </motion.li>
  )
}

export default BossCard
