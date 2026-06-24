import React, { useState, useMemo } from 'react'
import type { AgentId } from '@zzz-picker/constant'
import { AgentCard } from '../AgentCard'

type AgentInfo = {
  id: AgentId
  attribute?: 'Slash' | 'Strike' | 'Pierce' | 'Fire' | 'Electric' | 'Ice' | 'Physical' | 'Ether' // 속성 예시
  specialty?: 'Dps' | 'Stun' | 'Support' | 'Anomaly' | 'Defense' // 역할군 예시
  nameKo?: string
}

type AgentGridProps = {
  agents: AgentInfo[]
  banList?: AgentId[]
  pickList?: AgentId[]
  onSelect: (id: AgentId) => void
  activeId?: AgentId | null
  className?: string
}

export const AgentGrid: React.FC<AgentGridProps> = ({
  agents,
  banList = [],
  pickList = [],
  onSelect,
  activeId = null,
  className = ''
}) => {
  const [filterAttr, setFilterAttr] = useState<string>('ALL')
  const [filterSpec, setFilterSpec] = useState<string>('ALL')

  // 캐릭터 필터링 로직
  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchAttr = filterAttr === 'ALL' || agent.attribute === filterAttr
      const matchSpec = filterSpec === 'ALL' || agent.specialty === filterSpec
      return matchAttr && matchSpec
    })
  }, [agents, filterAttr, filterSpec])

  const attributes = ['ALL', 'Fire', 'Electric', 'Ice', 'Physical', 'Ether']
  const specialties = ['ALL', 'Dps', 'Stun', 'Support', 'Anomaly', 'Defense']

  return (
    <div className={`flex flex-col gap-4 bg-[var(--color-content)] p-5 rounded-2xl border border-[var(--color-netural)]/60 shadow-[var(--v3-border-glow)] ${className}`}>
      
      {/* 필터 헤더 */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--color-netural)] pb-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[var(--color-ink)]/50 font-bold">속성 필터:</span>
          {attributes.map((attr) => (
            <button
              key={attr}
              onClick={() => setFilterAttr(attr)}
              className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                filterAttr === attr
                  ? 'bg-[var(--color-primary)] text-[var(--color-base)]'
                  : 'bg-[var(--color-base)] text-[var(--color-ink)]/60 hover:bg-[var(--color-netural)]'
              }`}
            >
              {attr === 'ALL' ? '전체' : attr}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 flex-wrap mt-1 sm:mt-0">
          <span className="text-[var(--color-ink)]/50 font-bold">역할 필터:</span>
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setFilterSpec(spec)}
              className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                filterSpec === spec
                  ? 'bg-[var(--color-secondary)] text-[var(--color-base)]'
                  : 'bg-[var(--color-base)] text-[var(--color-ink)]/60 hover:bg-[var(--color-netural)]'
              }`}
            >
              {spec === 'ALL' ? '전체' : spec}
            </button>
          ))}
        </div>
      </div>

      {/* 에이전트 목록 바둑판 */}
      {filteredAgents.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {filteredAgents.map((agent) => {
            const isBanned = banList.includes(agent.id)
            const isPicked = pickList.includes(agent.id)
            const isActive = activeId === agent.id

            return (
              <AgentCard
                key={agent.id}
                agentId={agent.id}
                disabled={isBanned}
                active={isActive || isPicked}
                onClick={() => onSelect(agent.id)}
              />
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-xs text-[var(--color-ink)]/30 font-semibold">
          필터링 조건에 부합하는 에이전트가 존재하지 않습니다.
        </div>
      )}
    </div>
  )
}

export default AgentGrid
