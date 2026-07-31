import { selectDeadlyAssault, selectAgent, selectEngine } from '@/lib/DB'
import { type Boss, type Agent, type Engine } from '@/type'
import { map, pipe, toArray } from '@fxts/core'
import { createContext, useEffect, useMemo, useState } from 'react'
import { Loading } from '~/components'

type Props = {
  children: React.ReactNode
}
type State = {
  deadlyAssault: Map<string, Boss>
  agents: Map<number, Agent>
  engines: Map<string, Engine>
}

export const Context = createContext<State>({
  deadlyAssault: new Map([]),
  agents: new Map([]),
  engines: new Map([]),
})

const Store: React.FC<Props> = (props) => {
  const [deadlyAssault, setDeadlyAssault] = useState<Map<string, Boss>>(new Map([]))
  const [agents, setAgents] = useState<Map<number, Agent>>(new Map([]))
  const [engines, setEngines] = useState<Map<string, Engine>>(new Map([]))
  const loading = useMemo(
    () => agents.size === 0 || deadlyAssault.size === 0 || engines.size === 0,
    [agents, deadlyAssault, engines]
  )

  useEffect(() => {
    pipe(
      selectDeadlyAssault(),
      map((boss) => [boss.id, boss] as [string, Boss]),
      toArray,
      (list) => setDeadlyAssault(new Map(list)),
      () => selectAgent(),
      map((agent) => [agent.id, agent] as [number, Agent]),
      toArray,
      (list) => setAgents(new Map(list)),
      () => selectEngine(),
      map((engine) => [engine.id, engine] as [string, Engine]),
      toArray,
      (list) => setEngines(new Map(list))
    )
  }, [])

  return (
    <Context.Provider value={{ deadlyAssault, agents, engines }}>
      {loading ? <Loading /> : props.children}
    </Context.Provider>
  )
}

export default Store
