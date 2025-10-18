import { pipe, reduceLazy } from '@fxts/core'
import { getAgent, getBoss, getDeadlyAssault, type Agent } from '@zzz-picker/sheets'
import { createContext, useEffect, useState } from 'react'

type Props = {
  children: React.ReactNode
}
type State = {
  agent: Map<number, Agent>
}

export const Context = createContext<State>({
  agent: new Map(),
})

const Provider = (props: Props) => {
  const [agent, setAgent] = useState<Map<number, Agent>>(new Map())

  useEffect(() => {
    pipe(
      getAgent(),
      reduceLazy((prev, agent) => {
        prev.set(agent.zzzId, agent)

        return prev
      }, new Map()),
      (agent) => setAgent(agent)
    )
  }, [])

  return <Context.Provider value={{ agent }}>{props.children}</Context.Provider>
}

export default Provider
