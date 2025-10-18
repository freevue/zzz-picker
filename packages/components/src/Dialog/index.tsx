import { pipe, join, concat } from '@fxts/core'
import { createPortal } from 'react-dom'

type Props = {
  isOpen: boolean
  children: React.ReactNode
  className?: string
}

const Dialog: React.FC<Props> = (props) => {
  return props.isOpen
    ? createPortal(
        <div
          className={pipe(
            [
              'fixed',
              'left-0',
              'top-0',
              'w-full',
              'h-full',
              'bg-black/50',
              'z-50',
              'flex',
              'items-center',
              'justify-center',
              'backdrop-blur-lg',
            ],
            concat([props.className || '']),
            join(' ')
          )}
        >
          {props.children}
        </div>,
        document.body
      )
    : null
}

export default Dialog
