import { Context as SettingContext } from './Setting'
import { map, pipe, range, toArray } from '@fxts/core'
import { createContext, useContext, useEffect, useState } from 'react'

type Props = {
  children: React.ReactNode
}
type State = {
  banList: Array<number | null>
  setBan: (index: number, id: number | null) => void
  reset: () => void
}

export const Context = createContext<State>({ banList: [], setBan: () => {}, reset: () => {} })

const Provider = (props: Props) => {
  const { setting } = useContext(SettingContext)
  const [banList, setBanList] = useState<Array<number | null>>([])

  useEffect(() => {
    pipe(
      setting.banCount,
      range,
      map(() => null),
      toArray,
      (list) => setBanList(list)
    )
  }, [setting])

  return (
    <Context.Provider
      value={{
        banList,
        setBan: (index, id) => {
          setBanList((prev) => {
            const newList = [...prev]
            newList[index] = id

            return newList
          })
        },
        reset: () => {
          setBanList([])
        },
      }}
    >
      {props.children}
    </Context.Provider>
  )
}

export default Provider
