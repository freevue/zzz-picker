import { DEFAULT_PICKS } from '@/constant'
import { useSetting } from '@/hooks'
import type { Side, AgentPick } from '@/types'
import { fromEntries, map, pipe } from '@fxts/core'
import { createContext, useEffect, useState } from 'react'

type PickContextType = {
  pickList: Record<string, Record<Side, AgentPick>>
  onPickChange: (round: string, side: Side, list: AgentPick) => void
}

export const PickContext = createContext<PickContextType>({
  pickList: {},
  onPickChange: () => {},
})

type Props = {
  children: React.ReactNode
}

const PickProvider: React.FC<Props> = (props) => {
  const { roundList } = useSetting()
  const [pickList, setPickList] = useState<Record<string, Record<Side, AgentPick>>>({})

  useEffect(() => {
    pipe(
      roundList,
      map(
        (round) =>
          [round, { A: DEFAULT_PICKS, B: DEFAULT_PICKS }] as [string, Record<Side, AgentPick>]
      ),
      fromEntries,
      (data) => {
        setPickList(data)
      }
    )
  }, [roundList])

  return (
    <PickContext.Provider
      value={{
        pickList,
        onPickChange: (round: string, side: Side, list: AgentPick) => {
          setPickList((prev) => ({
            ...prev,
            [round]: { ...prev[round], [side]: list },
          }))
        },
      }}
    >
      {props.children}
    </PickContext.Provider>
  )
}

export default PickProvider
