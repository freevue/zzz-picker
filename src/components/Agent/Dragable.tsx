import type { AgentAvatar } from '../../types'
import Avatar from './Avatar'
import { concat, join, pipe } from '@fxts/core'
import { useState } from 'react'

type Props = {
  disabled?: boolean
  onClick?: (id: number) => void
  className?: string
} & AgentAvatar

const Dragable: React.FC<Props> = (props) => {
  const [isDragging, setIsDragging] = useState(false)

  const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('text/plain', `${props.id}`)
  }
  const onDrag = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }
  const onDragEnd = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.clearData()
    setIsDragging(false)
  }

  return (
    <div
      draggable={!props.disabled}
      className={pipe(
        ['text-center', 'flex', 'flex-col', 'items-center', 'gap-1'],
        concat(isDragging ? ['cursor-grabbing'] : ['cursor-grab']),
        concat(props.disabled ? ['filter', 'grayscale', 'cursor-not-allowed'] : []),
        concat(props.className ? [props.className] : []),
        join(' ')
      )}
      onDrag={onDrag}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={() => !props.disabled && props.onClick?.(props.id)}
    >
      <Avatar {...props} />
      <p
        className={pipe(
          ['text-md font-bold', 'dark:text-white'],
          concat(props.disabled ? ['opacity-50'] : ['opacity-80']),
          join(' ')
        )}
      >
        {props.name_mi18n}
      </p>
    </div>
  )
}

export default Dragable
