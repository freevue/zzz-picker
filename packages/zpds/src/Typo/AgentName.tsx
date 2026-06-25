import React from 'react'
import { useAgent } from '@zzz-picker/provider/hooks'
import type { AgentId } from '@zzz-picker/constant'

type AgentNameProps = {
  agentId?: AgentId
  name?: string
  rarity?: 'S' | 'A'
  size?: 'sm' | 'md' | 'lg'
  className?: string
} & React.HTMLAttributes<HTMLSpanElement>

const sizeClasses = {
  sm: 'text-xs font-bold',
  md: 'text-sm font-extrabold',
  lg: 'text-base font-black',
}

export const AgentName: React.FC<AgentNameProps> = ({
  agentId,
  name,
  rarity,
  size = 'md',
  className = '',
  ...rest
}) => {
  const agent = useAgent(agentId ?? 0)
  const displayName = name || (agentId ? agent?.nameKo : undefined) || '—'
  const displayRarity = rarity || (agentId ? agent?.rarity : undefined)

  const rarityColor =
    displayRarity === 'S'
      ? 'text-[var(--color-tertiary)]'
      : 'text-[var(--color-secondary)]'

  return (
    <span
      className={`${sizeClasses[size]} ${rarityColor} truncate max-w-full ${className}`}
      {...rest}
    >
      {displayName}
    </span>
  )
}

export default AgentName
