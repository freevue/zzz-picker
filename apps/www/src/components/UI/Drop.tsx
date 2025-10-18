type Props = {
  onDrop?: (agentId: string) => void
  className?: string
  children: React.ReactNode
}

const Drop: React.FC<Props> = (props) => {
  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()

    props.onDrop?.(event.dataTransfer.getData('text/plain'))
  }
  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      draggable={false}
      className={props.className || ''}
    >
      {props.children}
    </div>
  )
}

export default Drop
