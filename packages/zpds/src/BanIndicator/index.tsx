import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useAgent } from '@zzz-picker/provider/hooks'
import type { AgentId } from '@zzz-picker/constant'

type BanIndicatorProps = {
  banList: AgentId[]
  side: 'A' | 'B'
  label?: string
  className?: string
}

export const BanIndicator: React.FC<BanIndicatorProps> = ({
  banList,
  side,
  label,
  className = ''
}) => {
  const defaultLabel = label || `선수 ${side} 밴 목록`

  return (
    <div className={`flex flex-col gap-2 bg-[var(--color-content)] p-3.5 rounded-2xl border border-[var(--color-netural)]/60 shadow-[var(--v3-border-glow)] ${className}`}>
      
      {/* 라벨 */}
      <span className="text-[10px] font-black text-[var(--color-ink)]/50 tracking-wider uppercase">
        {defaultLabel}
      </span>

      {/* 밴 캐릭터 리스트 */}
      <div className="flex gap-2 items-center min-h-[52px]">
        {banList.length > 0 ? (
          banList.map((agentId) => (
            <BanItem key={agentId} agentId={agentId} />
          ))
        ) : (
          <span className="text-xs text-[var(--color-ink)]/20 font-bold ml-1">
            지정된 밴 카드 없음
          </span>
        )}
      </div>
    </div>
  )
}

const BanItem: React.FC<{ agentId: AgentId }> = ({ agentId }) => {
  const agent = useAgent(agentId)

  return (
    <div className="relative size-12 bg-[var(--color-base)] rounded-xl border border-[var(--color-tertiary)]/40 overflow-hidden flex items-center justify-center shadow-inner group cursor-help">
      
      {/* 밴 프로필 이미지 */}
      {agent?.profile?.url ? (
        <img
          src={agent.profile.url}
          alt={agent.nameKo}
          className="size-full object-cover grayscale opacity-60"
        />
      ) : (
        <span className="text-[8px] text-[var(--color-ink)]/30">BAN</span>
      )}

      {/* 기계식 금지 사선 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[var(--color-tertiary)]/20 to-transparent pointer-events-none" />
      <div className="absolute w-[150%] h-[2px] bg-[var(--color-tertiary)] rotate-45 transform origin-center" />

      {/* 툴팁 */}
      <div className="absolute bottom-0 left-0 right-0 bg-[var(--color-tertiary)] text-[var(--color-base)] text-[9px] font-black text-center truncate py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {agent?.nameKo || 'BAN'}
      </div>
    </div>
  )
}

export default BanIndicator
