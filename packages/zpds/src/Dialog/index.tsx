import React, { useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import ClientOnly from '../ClientOnly'

type DialogProps = {
  isOpen: boolean
  once?: boolean
  name?: string
  children: React.ReactNode
  className?: string
  closeable?: boolean
  onOpen?: () => void
  onClose?: () => void
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  once,
  name,
  children,
  className = '',
  closeable = true,
  onOpen,
  onClose
}) => {
  const open = useMemo(() => {
    if (typeof window === 'undefined') return isOpen
    if (once === undefined) return isOpen

    const openHistory = window.localStorage.getItem(`zzz-picker-dialog-open-${name || 'default'}`)
    if (openHistory === 'true') return false

    if (isOpen) {
      window.localStorage.setItem(`zzz-picker-dialog-open-${name || 'default'}`, 'true')
    }
    return isOpen
  }, [isOpen, once, name])

  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()
    onClose?.()
  }

  const onContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.()
      }
    }

    if (open) {
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
  }, [open])

  return (
    <ClientOnly fallback={null}>
      {() =>
        createPortal(
          <AnimatePresence>
            {open ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={onBackdropClick}
                className="fixed left-0 top-0 w-full h-full bg-[var(--color-base)]/75 z-50 flex items-start justify-center overflow-y-auto backdrop-blur-md px-4 py-12 sm:px-8 sm:py-24"
              >
                <motion.div
                  onAnimationComplete={onOpen}
                  initial={{ opacity: 0, scale: 0.93 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.93 }}
                  transition={{ duration: 0.2 }}
                  className={`min-w-fit max-w-full bg-[var(--color-content)] text-[var(--color-ink)] overflow-hidden p-6 sm:p-8 relative rounded-2xl border border-[var(--color-netural)] shadow-[var(--v3-border-glow)] ${className}`}
                  onClick={onContentClick}
                >
                  {closeable && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="absolute top-6 right-6 cursor-pointer z-10 p-1 text-[var(--color-ink)]/50 hover:text-[var(--color-primary)] transition-colors"
                    >
                      <svg className="size-6 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  {children}
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>,
          document.body
        )
      }
    </ClientOnly>
  )
}

export default Dialog
