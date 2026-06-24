import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useEngine } from '@zzz-picker/provider/hooks'
import type { EngineId } from '@zzz-picker/constant'

type EngineCardProps = {
  engineId: EngineId
  rate?: number // 1~5재련
  onClick?: () => void
  disabled?: boolean
  active?: boolean
  className?: string
}

export const EngineCard: React.FC<EngineCardProps> = ({
  engineId,
  rate = 1,
  onClick,
  disabled = false,
  active = false,
  className = ''
}) => {
  const engine = useEngine(engineId)

  const cardBorderClass = active
    ? 'border-[var(--color-secondary)] shadow-[var(--v3-border-glow)]'
    : 'border-[var(--color-netural)] hover:border-[var(--color-primary)]/60'

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`relative select-none overflow-hidden transition-all duration-200 cursor-pointer flex items-center bg-[var(--color-content)] border rounded-xl p-2.5 gap-3 ${cardBorderClass} ${
        disabled ? 'opacity-35 cursor-not-allowed grayscale' : ''
      } ${className}`}
    >
      {/* 썸네일 */}
      <div className="size-12 rounded-lg bg-[var(--color-base)] overflow-hidden flex items-center justify-center shrink-0 border border-[var(--color-netural)]">
        <AnimatePresence mode="wait">
          {engine?.profile?.url ? (
            <motion.img
              key={engineId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              src={engine.profile.url}
              alt={engine.nameKo}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[8px] text-[var(--color-ink)]/20">W</span>
          )}
        </AnimatePresence>
      </div>

      {/* 정보 영역 */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex justify-between items-center">
          <span className={`text-[8px] font-black px-1 rounded tracking-wide ${
            engine?.rank === 'S' 
              ? 'bg-[var(--color-tertiary)]/15 text-[var(--color-tertiary)]' 
              : engine?.rank === 'A'
              ? 'bg-[var(--color-secondary)]/15 text-[var(--color-secondary)]'
              : 'bg-[var(--color-ink)]/10 text-[var(--color-ink)]/60'
          }`}>
            {engine?.rank || 'B'}급
          </span>
          <span className="text-[8px] font-bold text-[var(--color-secondary)] font-mono">
            {rate}재련
          </span>
        </div>
        <span className="text-xs font-bold text-[var(--color-ink)]/90 truncate mt-1">
          {engine?.nameKo || '무기 명칭'}
        </span>
      </div>
    </div>
  )
}

export default EngineCard
