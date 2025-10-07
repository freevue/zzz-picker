// import { useAgents } from '../../hooks'
import { getAgentSquareImage } from '../../utils'
import { join, pipe } from '@fxts/core'
import { useState } from 'react'

type Props = {}

const Drop: React.FC<Props> = () => {
  // const { agents } = useAgents()
  const [agentId, setAgentId] = useState<number | null>(null)

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
    } catch {
      setAgentId(null)
    }
  }
  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{}}
      className={pipe(['size-24', 'overflow-hidden', 'flex', 'items-start'], join(' '))}
    >
      {agentId && <img className="block w-full" src={getAgentSquareImage(agentId)} alt="agent" />}
    </div>
  )
}

export default Drop
