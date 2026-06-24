import React from 'react'
import { Increase } from '../Increase'

type CostIndicatorProps = {
  currentCost: number
  maxCost?: number
  label?: string
  className?: string
}

export const CostIndicator: React.FC<CostIndicatorProps> = ({
  currentCost,
  maxCost = 24,
  label = '코스트 합계 지표',
  className = ''
}) => {
  const ratio = Math.min(100, (currentCost / maxCost) * 100)
  const isOver = currentCost > maxCost

  // 게이지 바 컬러 바인딩
  const barColorClass = isOver 
    ? 'bg-gradient-to-r from-[var(--color-tertiary)] to-[var(--color-primary)] animate-pulse'
    : 'bg-[var(--color-secondary)]'

  const textColorClass = isOver
    ? 'text-[var(--color-tertiary)]'
    : 'text-[var(--color-primary)]'

  return (
    <div className={`flex flex-col gap-2.5 bg-[var(--color-content)] p-4 rounded-xl border border-[var(--color-netural)]/60 shadow-[var(--v3-border-glow)] ${className}`}>
      
      {/* 헤더 */}
      <div className="flex justify-between items-center text-xs font-bold">
        <span className="text-[10px] font-black text-[var(--color-ink)]/50 tracking-wider uppercase">{label}</span>
        <div className="font-mono text-sm">
          <span className={`${textColorClass} font-black`}>
            <Increase value={currentCost} />
          </span>
          <span className="text-[var(--color-ink)]/30 font-semibold"> / {maxCost} Cost</span>
        </div>
      </div>

      {/* 게이지 트랙 */}
      <div className="w-full h-2 bg-[var(--color-base)] rounded-full overflow-hidden border border-[var(--color-netural)]/60 relative">
        <div 
          className={`h-full rounded-full transition-all duration-300 ${barColorClass}`}
          style={{ width: `${ratio}%` }}
        />
      </div>

      {/* 경고 플래시 가이드 */}
      {isOver && (
        <span className="text-[10px] text-[var(--color-tertiary)] font-black animate-pulse flex items-center gap-1.5 mt-0.5">
          <span>⚠️</span> 24 Cost 규격을 초과하여 밴픽이 제출 불가능한 상태입니다!
        </span>
      )}
    </div>
  )
}

export default CostIndicator
