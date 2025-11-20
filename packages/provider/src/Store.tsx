import type { DeadlyAssault, Boss, Engine, Agent } from './type'
import { DB } from './utils'
import { each, map, pipe, toArray } from '@fxts/core'
import dayjs, { type Dayjs } from 'dayjs'
import { createContext, use, useMemo, Suspense } from 'react'

type Props = {
  children: React.ReactNode
  deadlyAssaultList: Promise<Array<DeadlyAssault>>
  getBoss: Promise<Array<Boss>>
  getEngine: Promise<Array<Engine>>
  getAgent: Promise<Array<Agent>>
}
type State = {
  agents: Map<number, Agent>
  boss: Map<number, Boss>
  engines: Map<number, Engine>
  deadlyAssaultList: Array<Omit<DeadlyAssault, 'open'> & { open: Dayjs }>
}

export const Context = createContext<State>({
  agents: new Map(),
  boss: new Map(),
  engines: new Map(),
  deadlyAssaultList: [],
})

const Content: React.FC<Props> = (props) => {
  const deadlyAssaultList = use(props.deadlyAssaultList)
  const boss = use(props.getBoss)
  const engine = use(props.getEngine)
  const agent = use(props.getAgent)

  return (
    <Context.Provider
      value={{
        engines: useMemo(() => {
          const currentMap = new Map<number, Engine>()

          pipe(
            engine,
            map((engine) => ({ ...engine, id: Number(engine.id) })),
            each((engine) => currentMap.set(engine.id, engine))
          )

          return currentMap
        }, [engine]),
        agents: useMemo(() => {
          const currentMap = new Map<number, Agent>()

          pipe(
            agent,
            map((agent) => ({ ...agent, id: Number(agent.id) })),
            each((agent) => currentMap.set(agent.id, agent))
          )

          return currentMap
        }, [agent]),
        boss: useMemo(() => {
          const currentMap = new Map<number, Boss>()

          pipe(
            boss,
            map((boss) => ({ ...boss, id: Number(boss.id) })),
            each((boss) => currentMap.set(boss.id, boss))
          )

          return currentMap
        }, [boss]),
        deadlyAssaultList: useMemo(() => {
          return pipe(
            deadlyAssaultList,
            map((deadlyAssault) => ({
              ...deadlyAssault,
              open: dayjs(deadlyAssault.open),
            })),
            toArray
          )
        }, [deadlyAssaultList]),
      }}
    >
      {props.children}
    </Context.Provider>
  )
}

const Provider: React.FC<Pick<Props, 'children'>> = (props) => {
  return (
    <Suspense fallback={null}>
      <Content
        deadlyAssaultList={DB.getDeadlyAssaultList()}
        getBoss={DB.getBoss()}
        getEngine={DB.getEngine()}
        getAgent={DB.getAgent()}
      >
        {props.children}
      </Content>
    </Suspense>
  )
}

export default Provider
