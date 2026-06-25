import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useAgent } from '@zzz-picker/provider/hooks'
import type { AgentId } from '@zzz-picker/constant'
import { AgentName } from '../Typo/AgentName'

type AgentProfileProps = {
  agentId: AgentId
  size?: 'xs' | 'sm' | 'md' | 'lg'
  showName?: boolean
  flat?: boolean
  className?: string
}

const sizeMap = {
  xs: 'size-10',
  sm: 'size-14',
  md: 'size-20',
  lg: 'size-28',
}

export const AgentProfile: React.FC<AgentProfileProps> = ({
  agentId,
  size = 'md',
  showName = false,
  flat = false,
  className = '',
}) => {
  const agent = useAgent(agentId)
  const roundedClass = flat ? 'rounded-lg' : 'rounded-2xl'

  return (
    <div className={`flex flex-col items-center gap-1.5 ${className}`}>
      <div
        className={`${sizeMap[size]} ${roundedClass} overflow-hidden flex items-end shrink-0`}
        style={{ backgroundColor: agent?.color || 'var(--color-netural)' }}
      >
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
            <span className="w-full text-center text-[8px] text-[var(--color-ink)]/25 pb-1">—</span>
          )}
        </AnimatePresence>
      </div>

      {showName && (
        <AgentName agentId={agentId} size={size === 'lg' ? 'md' : 'sm'} />
      )}
    </div>
  )
}

export default AgentProfile
