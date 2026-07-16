import { concat, join, pipe } from '@fxts/core'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  children: React.ReactNode
  active: boolean
  className?: string
  onClose?: () => void
  onOpen?: () => void
}

const Dialog: React.FC<Props> = (props) => {
  const [open, setOpen] = useState<boolean>(false)

  const onTransitionEnd = () => {
    if (!props.active) setOpen(false)
  }

  useEffect(() => {
    if (props.active) setOpen(true)
  }, [props.active])

  return createPortal(
    open || props.active ? (
      <div
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
        <div role="dialog">{props.children}</div>
      </div>
    ) : null,
    document.body
  )
}

export default Dialog
