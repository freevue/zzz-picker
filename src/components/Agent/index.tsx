import type { AgentAvatar } from '../../types'
import Avatar from './Avatar'
import { concat, join, pipe } from '@fxts/core'
import { useState } from 'react'

type Props = {
  disabled?: boolean
} & AgentAvatar

const Agent: React.FC<Props> = (props) => {
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
        join(' ')
      )}
      onDrag={onDrag}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <Avatar {...props} />
      <p
        className={pipe(
          ['text-xs font-bold', 'dark:text-white'],
          concat(props.disabled ? ['opacity-50'] : ['opacity-80']),
          join(' ')
        )}
      >
        {props.name_mi18n}
      </p>
    </div>
  )
}

export default Agent
