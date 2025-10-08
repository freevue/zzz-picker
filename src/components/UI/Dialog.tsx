import { useEffect } from 'react'

type Props = {
  children: React.ReactNode
  className?: string
  onClose?: () => void
}

const Dialog: React.FC<Props> = (props) => {
  const onBgClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()

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

    document.body.style.overflow = 'hidden'

    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = 'auto'
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <div
      className="bg-base/50 fixed top-0 left-0 w-full h-full z-30 backdrop-blur-sm flex items-center justify-center"
      onClick={onBgClick}
    >
      <div onClick={onContentClick} className={props.className || ''}>
        {props.children}
      </div>
    </div>
  )
}

export default Dialog
