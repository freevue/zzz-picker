import { concat, join, pipe } from '@fxts/core'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  children: React.ReactNode
  active: boolean
  bgClose?: boolean
  className?: string
  onClose?: () => void
  onOpen?: () => void
}

const Dialog: React.FC<Props> = (props) => {
  const [open, setOpen] = useState<boolean>(false)

  const onTransitionEnd = () => {
    if (!props.active) setOpen(false)
    if (!open) props.onClose?.()
  }
  const onBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
    console.log(event)

    if (props.bgClose) setOpen(false)
  }
  const onContentClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
  }

  useEffect(() => {
    if (props.active) setOpen(true)
  }, [props.active])
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    if (open) {
      document.addEventListener('keydown', onKeyDown)
    } else {
      document.removeEventListener('keydown', onKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, props.onClose])

  return createPortal(
    open || props.active ? (
      <div
        onClick={onBackgroundClick}
        onTransitionEnd={onTransitionEnd}
        className={pipe(
          [
            'fixed',
            'opacity-0',
            'duration-300',
            'inset-0',
            'z-30',
            'backdrop-blur-sm',
            props.className || '',
          ],
          concat(open && props.active ? ['opacity-100'] : ['opacity-0']),
          join(' ')
        )}
      >
        <div role="dialog" className="w-fit mx-auto" onClick={onContentClick}>
          {props.children}
        </div>
      </div>
    ) : null,
    document.body
  )
}

export default Dialog
