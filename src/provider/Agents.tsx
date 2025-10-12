import type { Agent, Boss } from '@/types'
import { pipe } from '@fxts/core'
import { createContext, useEffect, useState } from 'react'

type Context = {
  agents: Array<Agent>
  boss: Array<Boss>
}

export const AgentsContext = createContext<Context>({ agents: [], boss: [] })

type Props = {
  children: React.ReactNode
}

const AgentsProvider: React.FC<Props> = (props) => {
  const [agents, setAgents] = useState<Array<Agent>>([])
  const [boss, setBoss] = useState<Array<Boss>>([])

  useEffect(() => {
    pipe(
      '/agents.json',
      (url) => fetch(url),
      (response) => response.json(),
      (data) => {
        setAgents(data)
      }
    )
    pipe(
      '/boss.json',
      (url) => fetch(url),
      (response) => response.json(),
      (data) => {
        setBoss(data)
      }
    )
  }, [])

  return <AgentsContext.Provider value={{ agents, boss }}>{props.children}</AgentsContext.Provider>
}

export default AgentsProvider
