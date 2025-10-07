import type { Agent as AgentType } from '../types'
import { createContext, useEffect, useState } from 'react'

type Context = {
  agents: Array<AgentType>
}

export const AgentsContext = createContext<Context>({ agents: [] })

type Props = {
  children: React.ReactNode
}

const AgentsProvider: React.FC<Props> = (props) => {
  const [agents, setAgents] = useState<Array<AgentType>>([])

  useEffect(() => {
    fetch('/agents.json')
      .then((res) => res.json())
      .then((data) => setAgents(data))
  }, [])

  return <AgentsContext.Provider value={{ agents }}>{props.children}</AgentsContext.Provider>
}

export default AgentsProvider
