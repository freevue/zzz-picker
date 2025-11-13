import Select from './Select'
import { pipe, concat, join } from '@fxts/core'
import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

type Props = {
  value: number
  onChange?: (value: number) => void
  className?: string
}

const Time: React.FC<Props> = (props) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [minute, setMinute] = useState(0)
  const [second, setSecond] = useState(0)

  const onMinuteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMinute(Number(event.target.value))

    props.onChange?.(Number(event.target.value) * 60 + second)
  }
  const onSecondChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSecond(Number(event.target.value))

    props.onChange?.(minute * 60 + Number(event.target.value))
  }

  useEffect(() => {
    setMinute(() => {
      const value = Math.floor(props.value / 60)

      if (value > 3) return 3
      if (value < 0) return 0

      return value
    })
    setSecond(() => {
      const value = props.value % 60

      if (value > 59) return 59
      if (value < 0) return 0

      return value
    })
  }, [props.value])
  useEffect(() => {
    if (!isOpen) return

    const onClose = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', onClose)

    return () => {
      document.removeEventListener('click', onClose)
    }
  }, [isOpen])

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={pipe(
          [
            'heading-3xl',
            'text-ink',
            'flex',
            'gap-1',
            'items-center',
            'justify-center',
            'cursor-pointer',
            'focus:outline-none',
          ],
          concat([props.className || '']),
          join(' ')
        )}
      >
        <span className="flex-1 text-center">{minute}</span>
        <span className="px-2">:</span>
        <span className="flex-1 text-center tracking-widest">
          {second < 10 ? `0${second}` : second}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={contentRef}
            className={pipe(
              [
                'absolute',
                'flex',
                'items-center',
                'justify-center',
                'left-0',
                'top-1/2',
                '-translate-y-1/2',
                'z-10',
                'rounded-tr-2xl',
                'rounded-bl-2xl',
                'w-full',
                'bg-content',
                'h-[200%]',
                'overflow-hidden',
                'backdrop-blur-lg',
                'shadow-2xl',
              ],
              concat(['heading-3xl', 'text-ink']),
              join(' ')
            )}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1.1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Select
              className="block h-full flex-1"
              value={minute}
              max={4}
              onChange={onMinuteChange}
            />
            <span className="px-2">:</span>
            <Select
              className="block h-full flex-1"
              value={second}
              max={60}
              onChange={onSecondChange}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Time
