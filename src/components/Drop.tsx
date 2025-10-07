// import { useAgents } from '../../hooks'
import { getAgentSquareImage } from '../utils'
import { join, pipe } from '@fxts/core'
import { useState } from 'react'

type Props = {
  defaultValue?: number
  onChange?: (id: number | null) => void
}

const Drop: React.FC<Props> = (props) => {
  // const { agents } = useAgents()
  const [agentId, setAgentId] = useState<number | null>(props.defaultValue ?? null)

  // const agent = useMemo(() => {
  //   return pipe(
  //     agents,
  //     find((agent) => agent.avatar.id === agentId)
  //   )
  // }, [agents, agentId])

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const agentId = event.dataTransfer.getData('text/plain')

    try {
      setAgentId(Number(agentId))
      props.onChange?.(Number(agentId))
    } catch {
      setAgentId(null)
      props.onChange?.(null)
    }
  }
  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      draggable={false}
      style={{}}
      className={pipe(['size-32', 'overflow-hidden', 'flex', 'items-start'], join(' '))}
    >
      {agentId && (
        <img
          className="block w-full"
          draggable={false}
          src={getAgentSquareImage(agentId)}
          alt="agent"
        />
      )}
    </div>
  )
}

export default Drop
