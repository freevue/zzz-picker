import { concat, join, pipe } from '@fxts/core'
import { useMotionValue } from 'motion/react'
import { useTransform } from 'motion/react'
import { animate, motion } from 'motion/react'
import { useEffect } from 'react'

type Props = {
  value: number
  className?: string
  fixed: number
  prefix?: string
  isHide?: boolean
  isActive?: boolean
}

const Increase: React.FC<Props> = (props) => {
  const count = useMotionValue(props.value)
  const rounded = useTransform(() => {
    const value = Number(count.get().toFixed(props.fixed)).toLocaleString('ko-KR')

    if (props.prefix) return `${value} ${props.prefix}`

    return value
  })

  useEffect(() => {
    if (!props.isActive) {
      const controls = animate(count, 0, { duration: 0 })

      return () => controls.stop()
    }

    const controls = animate(count, props.value, { duration: 1 })

    return () => controls.stop()
  }, [props.value, props.isActive])

  return (
    <motion.p
      className={pipe(
        ['cursor-default'],
        concat([props.className || 'text-ink heading-3xl']),
        join(' ')
      )}
    >
      {rounded}
    </motion.p>
  )
}

export default Increase
