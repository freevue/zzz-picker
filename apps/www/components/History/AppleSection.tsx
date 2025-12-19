import { motion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState, Children, useMemo } from 'react'

type Props = {
  children: React.ReactNode
}

const AppleSection: React.FC<Props> = (props) => {
  const ref = useRef<HTMLDivElement>(null)
  const [container, setContainer] = useState<HTMLElement | null>(null)

  const childrenArray = useMemo(() => Children.toArray(props.children), [props.children])
  const count = childrenArray.length

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

  return (
    <div ref={ref} style={{ height: `${(count + 1) * 100}vh` }} className="w-full relative">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {childrenArray.map((child, index) => (
          <FadeItem key={index} progress={scrollYProgress} index={index} total={count}>
            {child}
          </FadeItem>
        ))}
      </div>
    </div>
  )
}

type ItemProps = {
  children: React.ReactNode
  progress: any
  index: number
  total: number
}

const FadeItem: React.FC<ItemProps> = ({ children, progress, index, total }) => {
  // 각 아이템의 활성화 구간 계산
  // 0.2 ~ 0.8 구간을 N등분하여 배분
  const start = 0.1 + (index / total) * 0.8
  const end = 0.1 + ((index + 1) / total) * 0.8
  const middle = (start + end) / 2

  // 페이드 인: start -> middle
  // 페이드 아웃: middle -> end
  const opacity = useTransform(progress, [start, middle - 0.05, middle + 0.05, end], [0, 1, 1, 0])

  const scale = useTransform(progress, [start, middle], [0.95, 1])

  return (
    <motion.div
      style={{ opacity, scale }}
      className="absolute inset-0 flex flex-col items-center justify-center px-6"
    >
      {children}
    </motion.div>
  )
}

export default AppleSection
