import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useStore } from '@zzz-picker/provider/hooks'

type BossCardProps = {
  bossId: number
  onClick?: () => void
  disabled?: boolean
  active?: boolean
  className?: string
}

export const BossCard: React.FC<BossCardProps> = ({
  bossId,
  onClick,
  disabled = false,
  active = false,
  className = ''
}) => {
  const { boss: bossMap } = useStore()
  const boss = bossMap?.get(bossId)

  const cardBorderClass = active
    ? 'border-[var(--color-primary)] shadow-[var(--v3-magenta-glow)]'
    : 'border-[var(--color-netural)] hover:border-[var(--color-secondary)]/50 hover:shadow-[var(--v3-border-glow)]'

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`relative select-none overflow-hidden transition-all duration-200 cursor-pointer flex flex-col bg-[var(--color-content)] border rounded-2xl p-4 gap-3 ${cardBorderClass} ${
        disabled ? 'opacity-35 cursor-not-allowed grayscale' : ''
      } ${className}`}
    >
      {/* 보스 일러스트 */}
      <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-[var(--color-base)] flex items-center justify-center border border-[var(--color-netural)]/50">
        <AnimatePresence mode="wait">
          {boss?.profile?.url ? (
            <motion.img
              key={bossId}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              src={boss.profile.url}
              alt={boss.nameKo}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[10px] text-[var(--color-ink)]/20">NO IMAGE</span>
          )}
        </AnimatePresence>
      </div>

      {/* 보스 이름 */}
      <div className="text-center font-extrabold text-sm text-[var(--color-ink)] truncate z-10">
        {boss?.nameKo || '미지정 보스'}
      </div>
    </div>
  )
}

export default BossCard
