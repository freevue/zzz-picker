import { DB } from './utils'
import { each, isNull, map, pipe, toArray, throwIf, toAsync, filter } from '@fxts/core'
import type {
  Engine,
  Agent,
  DeadlyAssault,
  Boss,
  PlayState,
  AgentCostSetting,
} from '@zzz-picker/constant'
import dayjs, { type Dayjs } from 'dayjs'
import { createContext, use, useMemo, Suspense } from 'react'

type Cost = {
  A: Array<[number, AgentCostSetting]>
  B: Array<[number, AgentCostSetting]>
}
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
  save: (state: PlayState, cost: Cost) => Promise<void>
  authCheck: (password: string) => Promise<boolean>
}

export const Context = createContext<State>({
  agents: new Map(),
  boss: new Map(),
  engines: new Map(),
  deadlyAssaultList: [],
  save: async () => {},
  authCheck: async () => false,
})

const Content: React.FC<Props> = (props) => {
  const deadlyAssaultList = use(props.deadlyAssaultList)
  const boss = use(props.getBoss)
  const engine = use(props.getEngine)
  const agent = use(props.getAgent)

  // useEffect(() => {
  //   DB.getMatchLog(6).then((matchLog) => {
  //     console.log({ ...matchLog, mach_at: dayjs(matchLog.mach_at).format('YYYY-MM-DD HH:mm:ss') })
  //   })
  // }, [])

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
        save: async (state, cost) => {
          try {
            const matchId = await pipe(
              DB.postMatch(state),
              throwIf(isNull, () => Error('매치 로그 저장 실패')),
              (matchId) => matchId
            )

            await pipe(
              [
                await DB.postPersonalRound(state, cost),
                await DB.postCommonRound(state, cost),
                await DB.postUnlimitedRound(state, cost),
              ],
              toAsync,
              filter((id) => !isNull(id)),
              toArray,
              DB.postPlayLog(matchId)
            )
            await pipe(
              state.banList,
              filter((agentId) => !isNull(agentId)),
              toArray,
              DB.postBanLog(matchId)
            )
          } catch (error: any) {
            console.error(error.message)
          }
        },
        authCheck: async (password: string) => {
          try {
            return await DB.authCheck(password)
          } catch {
            return false
          }
        },
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
