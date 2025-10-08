import type { Side } from '.'
import Drop from './Drop'
import { pipe, join, concat, map, toArray, zipWithIndex, findIndex } from '@fxts/core'
import { useState } from 'react'

type Props = {
  side: Side
}

type AgentID = number | null

const Pick: React.FC<Props> = (props) => {
  const [agentList, setAgentList] = useState<[AgentID, AgentID, AgentID]>([null, null, null])

  const onChange = (id: AgentID, index: number) => {
    setAgentList((prev) => {
      const findAgentIndex = pipe(
        prev,
        findIndex((agentId) => agentId === id)
      )
      const newList: [AgentID, AgentID, AgentID] = [...prev]

      if (findAgentIndex !== -1) {
        newList[findAgentIndex] = null
      }

      newList[index] = id

      return newList
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <div className={pipe(['flex'], concat(props.side === 'A' ? ['pl-4'] : ['pr-4']), join(' '))}>
        {pipe(
          agentList,
          zipWithIndex,
          map(([index, agentId]) => (
            <Drop key={index} {...props} index={index} defaultValue={agentId} onChange={onChange} />
          )),
          toArray
        )}
      </div>
    </div>
  )
}

export default Pick
