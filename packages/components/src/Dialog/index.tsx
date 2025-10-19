import { pipe, join, concat } from '@fxts/core'
import { motion, AnimatePresence } from 'motion/react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  isOpen: boolean
  children: React.ReactNode
  className?: string
  onClose?: () => void
}

const Dialog: React.FC<Props> = (props) => {
  const onBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    event.preventDefault()

    props.onClose?.()
  }
  const onContentClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        props.onClose?.()
      }
    }

    if (props.isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKeyDown)
    } else {
      document.body.style.overflow = 'auto'
      window.removeEventListener('keydown', onKeyDown)
    }

    return () => {
      document.body.style.overflow = 'auto'
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [props.isOpen])

  return props.isOpen
    ? createPortal(
        <div
          onClick={onBackdropClick}
          className={pipe(
            [
              'fixed',
              'left-0',
              'top-0',
              'w-full',
              'h-full',
              'bg-base/70',
              'z-50',
              'flex',
              'items-start',
              'py-24',
              'justify-center',
              'overflow-y-auto',
              'backdrop-blur-lg',
              'scrollbar-hidden',
            ],
            concat([props.className || '']),
            join(' ')
          )}
        >
          <AnimatePresence>
            {props.isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={pipe(
                  [
                    'rounded-bl-4xl',
                    'rounded-tr-4xl',
                    'dark:bg-content',
                    'dark:text-gray-50',
                    'overflow-hidden',
                    'p-8',
                  ],
                  join(' ')
                )}
                onClick={onContentClick}
              >
                {props.children}
              </motion.div>
            )}
          </AnimatePresence>
        </div>,
        document.body
      )
    : null
}

export default Dialog
