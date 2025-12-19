import { motion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

type Props = {
  children: React.ReactNode
}

const AppleWrap: React.FC<Props> = (props) => {
  const ref = useRef<HTMLDivElement>(null)
  const [container, setContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (ref.current) {
      const parent = ref.current.closest('.overflow-auto')
      if (parent) setContainer(parent as HTMLElement)
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: ref,
    container: container ? { current: container } : undefined,
    offset: ['start end', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.4], [0.9, 1])

  return (
    <div ref={ref} className="h-[200vh] w-full relative">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ opacity, scale }}
          className="flex flex-col items-center justify-center px-6"
        >
          {props.children}
        </motion.div>
      </div>
    </div>
  )
}

export default AppleWrap
