import { concat, join, pipe } from '@fxts/core'
import { useInView } from 'motion/react'
import { useEffect, useRef } from 'react'

type Props = {
  children: React.ReactNode
  onChange?: (isActive: boolean) => void
}

const Wrap: React.FC<Props> = (props) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { margin: '0px 0px -70% 0px' })

  useEffect(() => {
    props.onChange?.(isInView)
  }, [isInView])

  return (
    <div
      ref={ref}
      className={pipe(
        ['w-screen', 'h-screen', 'flex', 'flex-col', 'items-center', 'justify-center', 'group'],
        concat(isInView ? ['active'] : []),
        join(' ')
      )}
    >
      {props.children}
    </div>
  )
}

export default Wrap
