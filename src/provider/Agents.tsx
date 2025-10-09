import type { Agent } from '../types'
import { pipe } from '@fxts/core'
import { createContext, useEffect, useState } from 'react'

type Context = {
  agents: Array<Agent>
}

export const AgentsContext = createContext<Context>({ agents: [] })

type Props = {
  children: React.ReactNode
}

const AgentsProvider: React.FC<Props> = (props) => {
  const [agents, setAgents] = useState<Array<Agent>>([])

  useEffect(() => {
    pipe(
      '/agents.json',
      (url) => fetch(url),
      (response) => response.json(),
      (data) => {
        setAgents(data)
      }
    )
  }, [])

  return <AgentsContext.Provider value={{ agents }}>{props.children}</AgentsContext.Provider>
}

export default AgentsProvider
