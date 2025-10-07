import { useAgents } from '../hooks'
import { filter, map, pipe, toArray } from '@fxts/core'
import { createContext, useEffect, useState } from 'react'

type Context = {
  banList: Array<number>
  noBanList: Array<number>
  setBanList: (id: number) => void
}

export const BanContext = createContext<Context>({
  banList: [],
  noBanList: [],
  setBanList: () => {},
})

type Props = {
  children: React.ReactNode
}

const BanProvider: React.FC<Props> = (props) => {
  const { agents } = useAgents()
  const [banList, setBanList] = useState<Array<number>>([])
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
        setBanList: (id: number) => setBanList((prev) => [...prev, id]),
      }}
    >
      {props.children}
    </BanContext.Provider>
  )
}

export default BanProvider
