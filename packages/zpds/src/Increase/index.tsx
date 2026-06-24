import React, { useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'motion/react'

type IncreaseProps = {
  value: number
  className?: string
  fixed?: number
  prefix?: string
  isActive?: boolean
}

export const Increase: React.FC<IncreaseProps> = ({
  value,
  className = '',
  fixed = 0,
  prefix = '',
  isActive = true
}) => {
  const count = useMotionValue(0)
  const rounded = useTransform(() => {
    const formatted = Number(count.get().toFixed(fixed)).toLocaleString('ko-KR')
    return prefix ? `${formatted} ${prefix}` : formatted
  })

  useEffect(() => {
    if (!isActive) {
      const controls = animate(count, 0, { duration: 0 })
      return () => controls.stop()
    }

    const controls = animate(count, value, { duration: 0.8, ease: 'easeOut' })
    return () => controls.stop()
  }, [value, isActive])

  return (
    <motion.span className={`cursor-default font-extrabold ${className}`}>
      {rounded}
    </motion.span>
  )
}

export default Increase
