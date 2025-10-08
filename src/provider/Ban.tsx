import { useAgents } from '../hooks'
import { filter, map, pipe, toArray } from '@fxts/core'
import { createContext, useEffect, useState } from 'react'

type AgentID = number | null
type Context = {
  banList: [AgentID, AgentID]
  noBanList: Array<number>
  setBanList: (id: number | null, index: number) => void
}

export const BanContext = createContext<Context>({
  banList: [null, null],
  noBanList: [],
  setBanList: () => {},
})

type Props = {
  children: React.ReactNode
}

const BanProvider: React.FC<Props> = (props) => {
  const { agents } = useAgents()
  const [banList, setBanList] = useState<[AgentID, AgentID]>([null, null])
  const [noBanList, setNoBanList] = useState<Array<number>>([])

  useEffect(() => {
    pipe(
      agents,
      filter((agent) => agent.is_up),
      map((agent) => agent.avatar.id),
      toArray,
      (list) => setNoBanList(list)
    )
  }, [agents])

  return (
    <BanContext.Provider
      value={{
        banList,
        noBanList,
        setBanList: (id: number | null, index: number) => {
          if (id && noBanList.includes(id)) return

          setBanList((prev) => {
            const newList: [AgentID, AgentID] = [...prev]
            newList[index] = id

            return newList
          })
        },
      }}
    >
      {props.children}
    </BanContext.Provider>
  )
}

export default BanProvider
