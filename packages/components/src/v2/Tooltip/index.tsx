import { pipe, concat, join } from '@fxts/core'
import { motion, AnimatePresence } from 'motion/react'
import { useMemo, useState } from 'react'

type Props = {
  children: React.ReactNode
  tip: React.ReactNode
  className?: string
  tag?: keyof HTMLElementTagNameMap
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

const Tooltip: React.FC<Props> = (props) => {
  const [isHovered, setIsHovered] = useState(false)
  const Tag = (props.tag || 'div') as keyof HTMLElementTagNameMap
  const placement = useMemo(() => {
    switch (props.placement) {
      case 'top':
        return 'bottom-full mb-2'
      case 'bottom':
        return 'top-full mt-2'
      case 'left':
        return 'right-full mr-2'
      case 'right':
        return 'left-full ml-2'
      default:
        return 'top-full mt-2'
    }
  }, [props.placement])

  return (
    <Tag
      className={pipe(['relative', 'group'], concat([props.className || '']), join(' '))}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {props.children}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={pipe(
              ['absolute', 'left-1/2', '-translate-x-1/2', 'z-50', 'pointer-events-none', 'w-max'],
              concat([
                placement,
                'bg-content',
                'px-2',
                'py-1',
                'rounded-lg',
                'text-ink',
                'body-sm',
              ]),
              join(' ')
            )}
          >
            {props.tip}
          </motion.div>
        )}
      </AnimatePresence>
    </Tag>
  )
}

export default Tooltip
