import { DEFAULT_PICKS } from '@/constant'
import { useSetting } from '@/hooks'
import type { Side, SelectAgent } from '@/types'
import { fromEntries, map, pipe, sum, values, flat } from '@fxts/core'
import { createContext, useEffect, useMemo, useState } from 'react'

type PickState = {}

type Context = {
  pickList: Record<string, Record<Side, SelectAgent>>
}

export const PlayContext = createContext<Context>({
  pickList: {},
})

type Props = {
  children: React.ReactNode
}

const PlayProvider: React.FC<Props> = (props) => {
  const { roundList } = useSetting()
  const [pickList, setPickList] = useState<Record<string, Record<Side, SelectAgent>>>({})

  useEffect(() => {}, [roundList])

  return (
    <PlayContext.Provider
      value={{
        pickList,
      }}
    >
      {props.children}
    </PlayContext.Provider>
  )
}

export default PlayProvider
