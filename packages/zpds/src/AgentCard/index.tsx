import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useAgent, useEngine } from '@zzz-picker/provider/hooks'
import type { AgentId, EngineId } from '@zzz-picker/constant'

type AgentCardProps = {
  agentId: AgentId
  rate?: number // 0~6돌
  engineId?: EngineId | null
  engineRate?: number // 1~5재
  onClick?: () => void
  disabled?: boolean
  active?: boolean
  className?: string
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agentId,
  rate = 0,
  engineId = null,
  engineRate = 1,
  onClick,
  disabled = false,
  active = false,
  className = ''
}) => {
  const agent = useAgent(agentId)
  const engine = useEngine(engineId || 0)

  const cardBorderClass = active
    ? 'border-[var(--color-primary)] shadow-[var(--v3-magenta-glow)]'
    : 'border-[var(--color-netural)] hover:border-[var(--color-secondary)]/60 hover:shadow-[var(--v3-border-glow)]'

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`relative select-none overflow-hidden transition-all duration-200 cursor-pointer flex flex-col bg-[var(--color-content)] border rounded-tr-3xl rounded-bl-3xl p-3.5 gap-2.5 ${cardBorderClass} ${
        disabled ? 'opacity-35 cursor-not-allowed grayscale' : ''
      } ${className}`}
    >
      {/* 캐릭터 헤더 (등급 & 돌파) */}
      <div className="flex justify-between items-center z-10">
        <span className={`text-[10px] font-black px-2 py-0.5 rounded tracking-widest ${
          agent?.rarity === 'S' 
            ? 'bg-[var(--color-tertiary)]/15 text-[var(--color-tertiary)]' 
            : 'bg-[var(--color-secondary)]/15 text-[var(--color-secondary)]'
        }`}>
          {agent?.rarity || 'A'}급
        </span>
        <span className="text-[10px] font-bold text-[var(--color-primary)] font-mono">
          {rate > 0 ? `${rate}돌` : '명함'}
        </span>
      </div>

      {/* 캐릭터 일러스트/프로필 */}
      <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-[var(--color-base)] flex items-end justify-center">
        <AnimatePresence mode="wait">
          {agent?.profile?.url ? (
            <motion.img
              key={agentId}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.2 }}
              src={agent.profile.url}
              alt={agent.nameKo}
              className="w-full object-cover select-none pointer-events-none"
            />
          ) : (
            <span className="text-[10px] text-[var(--color-ink)]/25 mb-4">NO PROFILE</span>
          )}
        </AnimatePresence>
      </div>

      {/* 캐릭터 이름 */}
      <div className="text-center font-bold text-xs text-[var(--color-ink)] z-10 truncate">
        {agent?.nameKo || '로딩 중...'}
      </div>

      {/* 장착 무기/W-엔진 스펙 */}
      {engineId && engine && (
        <div className="bg-[var(--color-base)] px-2 py-1 rounded border border-[var(--color-netural)] flex items-center justify-between text-[9px] font-medium text-[var(--color-secondary)]">
          <span className="truncate max-w-[80px]">{engine.nameKo}</span>
          <span className="font-bold shrink-0">{engineRate}재련</span>
        </div>
      )}
    </div>
  )
}

export default AgentCard
