import { selectDeadlyAssault, selectAgent } from '@/lib/DB'
import { type Boss, type Agent } from '@/type'
import { map, pipe, toArray } from '@fxts/core'
import { createContext, useEffect, useState } from 'react'

type Props = {
  children: React.ReactNode
}
type State = {
  deadlyAssault: Array<Boss>
  agents: Map<number, Agent>
}

export const Context = createContext<State>({
  deadlyAssault: [],
  agents: new Map([]),
})

const Store: React.FC<Props> = (props) => {
  const [deadlyAssault, setDeadlyAssault] = useState<Array<Boss>>([])
  const [agents, setAgents] = useState<Map<number, Agent>>(new Map([]))

  useEffect(() => {
    pipe(selectDeadlyAssault(), setDeadlyAssault)
    pipe(
      selectAgent(),
      map((agent) => [agent.id, agent] as [number, Agent]),
      toArray,
      (list) => setAgents(new Map(list))
    )
  }, [])

  return <Context.Provider value={{ deadlyAssault, agents }}>{props.children}</Context.Provider>
}

export default Store
