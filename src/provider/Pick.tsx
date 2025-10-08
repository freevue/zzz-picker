import { DEFAULT_PICKS } from '@/constant'
import { useSetting } from '@/hooks'
import type { Side, AgentPick } from '@/types'
import { fromEntries, map, pipe, sum, values, flat } from '@fxts/core'
import { createContext, useEffect, useMemo, useState } from 'react'

type PickContextType = {
  pickList: Record<string, Record<Side, AgentPick>>
  totalCost: Record<Side, number>
  onPickChange: (round: string, side: Side, list: AgentPick) => void
}

export const PickContext = createContext<PickContextType>({
  pickList: {},
  totalCost: { A: 0, B: 0 },
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
        totalCost: useMemo(() => {
          return {
            A: pipe(
              pickList,
              values,
              map((pick) => pick.A),
              flat,
              map((pick) => pick.cost),
              sum
            ),
            B: pipe(
              pickList,
              values,
              map((pick) => pick.B),
              flat,
              map((pick) => pick.cost),
              sum
            ),
          }
        }, [pickList]),
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
