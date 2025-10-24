import { filter, head, isNull, map, pipe, reduceLazy, toArray } from '@fxts/core'
import {
  getAgent,
  getBoss,
  getDeadlyAssault,
  type Agent,
  type Boss,
  type DeadlyAssault,
} from '@zzz-picker/sheets'
import dayjs from 'dayjs'
import { createContext, useEffect, useMemo, useState } from 'react'

type Props = {
  children: React.ReactNode
}
type State = {
  agent: Map<number, Agent>
  boss: Map<number, Boss>
  deadlyAssault: [Boss, Boss, Boss] | null
  deadlyAssaultList: Array<DeadlyAssault>
}

export const Context = createContext<State>({
  agent: new Map(),
  boss: new Map(),
  deadlyAssault: null,
  deadlyAssaultList: [],
})

const Provider = (props: Props) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [agent, setAgent] = useState<Map<number, Agent>>(new Map())
  const [boss, setBoss] = useState<Map<number, Boss>>(new Map())
  const [deadlyAssault, setDeadlyAssault] = useState<[number, number, number] | null>(null)
  const [deadlyAssaultList, setDeadlyAssaultList] = useState<Array<DeadlyAssault>>([])

  useEffect(() => {
    pipe(
      getAgent(),
      reduceLazy((prev, agent) => {
        prev.set(agent.zzzId, agent)

        return prev
      }, new Map()),
      (agent) => {
        setAgent(agent)
        setIsLoaded(true)
      }
    )
    pipe(
      getBoss(),
      reduceLazy((prev, boss) => {
        prev.set(boss.bossId, boss)

        return prev
      }, new Map()),
      (boss) => setBoss(boss)
    )
    pipe(getDeadlyAssault(), toArray, (list) => setDeadlyAssaultList(list))
  }, [])

  useEffect(() => {
    if (deadlyAssaultList.length === 0) return

    pipe(
      deadlyAssaultList,
      filter(({ date }) => dayjs(date).isBefore(dayjs())),
      toArray,
      head as (list: Array<DeadlyAssault>) => DeadlyAssault,
      ({ boss1, boss2, boss3 }) => [boss1, boss2, boss3] as [number, number, number],
      (list) => setDeadlyAssault(list)
    )
  }, [deadlyAssaultList])

  return (
    <Context.Provider
      value={{
        agent,
        boss,
        deadlyAssaultList,
        deadlyAssault: useMemo(() => {
          if (isNull(deadlyAssault)) return deadlyAssault

          return pipe(
            deadlyAssault,
            map((bossId) => boss.get(bossId)!),
            toArray
          ) as [Boss, Boss, Boss]
        }, [boss, deadlyAssault]),
      }}
    >
      {isLoaded ? props.children : null}
    </Context.Provider>
  )
}

export default Provider
