import { concat, join, pipe } from '@fxts/core'
import { useRef, useState } from 'react'

type Props = {
  children: React.ReactNode
}

const Table: React.FC<Props> = (props) => {
  const [isDrag, setIsDrag] = useState<boolean>(false)
  const startX = useRef<number>(0)
  const startY = useRef<number>(0)
  const moveX = useRef<number>(0)
  const moveY = useRef<number>(0)

  const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    setIsDrag(true)

    startX.current = event.currentTarget.scrollLeft
    startY.current = event.currentTarget.scrollTop
    moveX.current = event.clientX
    moveY.current = event.clientY
  }
  const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (!isDrag) return

    event.currentTarget.scrollTo({
      left: startX.current + (moveX.current - event.clientX),
      top: startY.current + (moveY.current - event.clientY),
    })
  }
  const onMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (!isDrag) return

    setIsDrag(false)
  }
  const onMouseLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (!isDrag) return

    setIsDrag(false)
  }

  return (
    <div
      className={pipe(
        ['flex-1', 'w-full', 'overflow-auto', 'scrollbar-hidden', 'rounded-3xl', 'card'],
        concat(isDrag ? ['cursor-grabbing'] : ['cursor-grab']),
        join(' ')
      )}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      <table className="min-w-max table-fixed w-full select-none">{props.children}</table>
    </div>
  )
}

export default Table
