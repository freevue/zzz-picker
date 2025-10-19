import { useSetting, useSetting2 } from '@/hooks'
import type { SelectAgent } from '@/types'
import { findIndex, map, pipe, range, toArray } from '@fxts/core'
import { createContext, useEffect, useState } from 'react'

type Context = {
  banList: Array<SelectAgent>
  setBanList: (id: number | null, index: number) => void
  reset: () => void
}

export const BanContext = createContext<Context>({
  banList: [null, null],
  setBanList: () => {},
  reset: () => {},
})

type Props = {
  children: React.ReactNode
}

const BanProvider: React.FC<Props> = (props) => {
  const { setting } = useSetting2()
  const [banList, setBanList] = useState<Array<SelectAgent>>([null, null])

  useEffect(() => {
    pipe(
      setting.banCount,
      range,
      map(() => null),
      toArray,
      (list) => setBanList(list)
    )
  }, [setting.banCount])

  return (
    <BanContext.Provider
      value={{
        banList,
        reset: () => {
          pipe(
            setting.banCount,
            range,
            map(() => null),
            toArray,
            (list) => setBanList(list)
          )
        },
        setBanList: (id: number | null, index: number) => {
          if (id && setting.allowAgent.includes(id)) return

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
