import ClientOnly from '../ClientOnly'
import Agents from './Agents'
import Engines from './Engines'
import { pipe, join, concat, isUndefined } from '@fxts/core'
import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  isOpen: boolean
  once?: boolean
  name?: string
  children: React.ReactNode
  className?: string
  onClose?: () => void
}
type DialogType = React.FC<Props> & {
  Agents: typeof Agents
  Engines: typeof Engines
}

const Dialog: DialogType = (props) => {
  const open = useMemo(() => {
    if (typeof window === 'undefined') return props.isOpen
    if (isUndefined(props.once)) return props.isOpen

    const openHistory = window.localStorage.getItem(`zzz-picker-dialog-open`)

    if (openHistory === 'true') return false

    props.isOpen && window.localStorage.setItem(`zzz-picker-dialog-open`, 'true')

    return props.isOpen
  }, [props.isOpen, props.once, props.name])

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
          <AnimatePresence initial={false}>
            {open ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
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
                    'px-8',
                    'justify-center',
                    'overflow-y-auto',
                    'backdrop-blur-lg',
                    'scrollbar-hidden',
                  ],
                  concat([props.className || '']),
                  join(' ')
                )}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className={pipe(
                    [
                      'min-w-fit',
                      'rounded-bl-4xl',
                      'rounded-tr-4xl',
                      'bg-content',
                      'text-foreground',
                      'overflow-hidden',
                      'p-8',
                    ],
                    join(' ')
                  )}
                  onClick={onContentClick}
                >
                  {props.children}
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

Dialog.Agents = Agents
Dialog.Engines = Engines

export default Dialog
