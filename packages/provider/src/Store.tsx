import { each, map, pipe, prop, toArray } from '@fxts/core'
import type { DeadlyAssault } from '@zzz-picker/constant'
import {
  AGENT_LIST,
  BOSS_LIST,
  DEADLY_ASSAULT_LIST,
  ENGINE_LIST,
  useQuery,
  type GQL_AgentList,
  type GQL_EngineList,
  type GQL_Engine,
  type GQL_Agent,
  type GQL_BossList,
  type GQL_Boss,
  type GQL_DeadlyAssaultList,
  type GQL_Attribute,
} from '@zzz-picker/graphql'
import dayjs, { type Dayjs } from 'dayjs'
import { createContext, useMemo } from 'react'

type Props = {
  children: React.ReactNode
}
type State = {
  agents: Map<number, GQL_Agent>
  gqlBosses: Map<number, GQL_Boss<Array<GQL_Attribute>>>
  gqlEngines: Map<number, GQL_Engine>
  loading: boolean
  deadlyAssaultList: Array<DeadlyAssault & { open: Dayjs }>
}

export const Context = createContext<State>({
  agents: new Map(),
  gqlBosses: new Map(),
  gqlEngines: new Map(),
  loading: false,
  deadlyAssaultList: [],
})

const Provider = (props: Props) => {
  const { loading: engineLoading, data: engineData } = useQuery<GQL_EngineList>(ENGINE_LIST)
  const { loading: agentLoading, data: agentData } = useQuery<GQL_AgentList>(AGENT_LIST)
  const { loading: bossLoading, data: bossData } = useQuery<GQL_BossList>(BOSS_LIST)
  const { loading: deadlyAssaultLoading, data: deadlyAssaultData } =
    useQuery<GQL_DeadlyAssaultList>(DEADLY_ASSAULT_LIST)

  return (
    <Context.Provider
      value={{
        loading: useMemo(
          () => agentLoading || bossLoading || deadlyAssaultLoading || engineLoading,
          [agentLoading, bossLoading, deadlyAssaultLoading, engineLoading]
        ),
        gqlEngines: useMemo(() => {
          const currentMap = new Map()

          if (engineLoading) return currentMap

          pipe(
            engineData?.enginesCollection?.edges || [],
            map(prop('node')),
            each((engine) => {
              currentMap.set(Number(engine.id), engine)
            })
          )

          return currentMap
        }, [engineData, engineLoading]),
        agents: useMemo(() => {
          const currentMap = new Map()

          if (agentLoading) return currentMap

          pipe(
            agentData?.agentsCollection?.edges || [],
            map(prop('node')),
            each((agent) => {
              currentMap.set(Number(agent.id), agent)
            })
          )

          return currentMap
        }, [agentData, agentLoading]),
        gqlBosses: useMemo(() => {
          const currentMap = new Map()

          if (bossLoading) return currentMap

          pipe(
            bossData?.bossCollection?.edges || [],
            map(prop('node')),
            map((boss) => ({
              ...boss,
              resistance: pipe(
                boss.resistance.edges,
                map(prop('node')),
                map(prop('attributes')),
                toArray
              ),
              weakness: pipe(
                boss.weakness.edges,
                map(prop('node')),
                map(prop('attributes')),
                toArray
              ),
            })),
            each((boss) => {
              currentMap.set(Number(boss.id), boss)
            })
          )

          return currentMap
        }, [bossData, bossLoading]),
        deadlyAssaultList: useMemo(() => {
          if (deadlyAssaultLoading) return []

          return pipe(
            deadlyAssaultData?.deadlyAssault?.edges || [],
            map(prop('node')),
            map((deadlyAssault) => ({
              ...deadlyAssault,
              version: Number(deadlyAssault.version),
              open: dayjs(deadlyAssault.openAt),
              boss1: Number(deadlyAssault.boss1),
              boss2: Number(deadlyAssault.boss2),
              boss3: Number(deadlyAssault.boss3),
            })),
            toArray
          )
        }, [deadlyAssaultData, deadlyAssaultLoading]),
      }}
    >
      {props.children}
    </Context.Provider>
  )
}

export default Provider
