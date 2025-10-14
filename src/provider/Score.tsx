import { useSetting } from '@/hooks'
import { usePlay } from '@/hooks'
import type { Side, PickState } from '@/types'
import { pipe, map, sum, values, toArray } from '@fxts/core'
import { createContext, useEffect, useMemo, useState } from 'react'

type Props = {
  children: React.ReactNode
}
type Score = {
  score: number
  time: string
}

type Context = {
  score: Map<string, Record<Side, Score>>
  totalCost: Record<Side, number>
  totalScore: Record<Side, number>
  setScore: (round: string, side: Side, score: Score) => void
}

export const ScoreContext = createContext<Context>({
  score: new Map(),
  totalCost: { A: 0, B: 0 },
  totalScore: { A: 0, B: 0 },
  setScore: () => {},
})

const ScoreProvider: React.FC<Props> = (props) => {
  const { roundList, costTable } = useSetting()
  const { pickList } = usePlay()
  const [score, setScore] = useState<Map<string, Record<Side, Score>>>(new Map())

  useEffect(() => {
    pipe(
      roundList,
      map(
        (round) =>
          [
            round,
            { A: { score: 0, time: '00분 00초' }, B: { score: 0, time: '00분 00초' } },
          ] as const
      ),
      toArray,
      (data) => setScore(new Map(data))
    )
  }, [roundList])

  return (
    <ScoreContext.Provider
      value={{
        score,
        totalCost: useMemo(() => {
          function roundTotalCost(pickState: PickState[keyof PickState]) {
            return pipe(
              pickState,
              map(({ setting, id }) => {
                if (id === null) return 0

                const { pickup, agentRate, engineType, engineRate } = setting

                const agentCost = pipe(
                  costTable.agent[pickup],
                  ({ used, rate }) => used + rate * agentRate
                )

                if (engineType === null) return agentCost

                const engineCost = pipe(
                  costTable.engine[engineType],
                  ({ used, rate }) => used + rate * engineRate
                )

                return agentCost + engineCost
              }),
              sum
            )
          }

          const result = { A: 0, B: 0 }

          for (const [, { A, B }] of pickList) {
            result.A += roundTotalCost(A)
            result.B += roundTotalCost(B)
          }

          return result
        }, [pickList, costTable]),
        totalScore: useMemo(() => {
          return { A: 0, B: 0 }
        }, [score]),
        setScore: (round: string, side: Side, score: Score) => {
          setScore((prev) => {
            const data = new Map(prev)

            data.set(round, { ...data.get(round)!, [side]: score })

            return data
          })
        },
      }}
    >
      {props.children}
    </ScoreContext.Provider>
  )
}

export default ScoreProvider
