import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

type TooltipProps = {
  children: React.ReactNode
  content: React.ReactNode
  className?: string
  tag?: keyof HTMLElementTagNameMap
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  className = '',
  tag = 'div',
  placement = 'top'
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const Tag = tag as any

  const placementClass = useMemo(() => {
    switch (placement) {
      case 'top': return 'bottom-full mb-2.5 left-1/2 -translate-x-1/2'
      case 'bottom': return 'top-full mt-2.5 left-1/2 -translate-x-1/2'
      case 'left': return 'right-full mr-2.5 top-1/2 -translate-y-1/2'
      case 'right': return 'left-full ml-2.5 top-1/2 -translate-y-1/2'
      default: return 'bottom-full mb-2.5 left-1/2 -translate-x-1/2'
    }
  }, [placement])

  return (
    <Tag
      className={`relative group inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 pointer-events-none w-max max-w-xs bg-[var(--color-content)] text-[var(--color-ink)] border border-[var(--color-netural)] px-3 py-1.5 rounded-lg text-xs tracking-normal shadow-[var(--v3-border-glow)] ${placementClass}`}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </Tag>
  )
}
export default Tooltip
