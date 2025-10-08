import { useAgents, useSetting } from '@/hooks'
import { filter, findIndex, map, pipe, range, toArray } from '@fxts/core'
import { createContext, useEffect, useState } from 'react'

type AgentID = number | null
type Context = {
  banList: Array<AgentID>
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
  const { banCount } = useSetting()
  const [banList, setBanList] = useState<Array<AgentID>>([null, null])
  const [noBanList, setNoBanList] = useState<Array<number>>([])

  useEffect(() => {
    // pipe(
    //   agents,
    //   filter((agent) => agent.is_up),
    //   map((agent) => agent.avatar.id),
    //   toArray,
    //   (list) => setNoBanList(list)
    // )
  }, [agents])
  useEffect(() => {
    pipe(
      banCount,
      range,
      map(() => null),
      toArray,
      (list) => setBanList(list)
    )
  }, [banCount])

  return (
    <BanContext.Provider
      value={{
        banList,
        noBanList,
        setBanList: (id: number | null, index: number) => {
          if (id && noBanList.includes(id)) return

          setBanList((prev) => {
            const currentAgentIndex = pipe(
              prev,
              findIndex((item) => item === id)
            )

            return pipe([...prev], (list) => {
              list[index] = id

              if (currentAgentIndex !== -1) {
                list[currentAgentIndex] = null

                return list
              }

              return list
            })
          })
        },
      }}
    >
      {props.children}
    </BanContext.Provider>
  )
}

export default BanProvider
