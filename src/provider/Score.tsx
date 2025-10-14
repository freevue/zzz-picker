import { DEFAULT_COST_RATE } from '@/constant'
import { useSetting } from '@/hooks'
import { usePlay } from '@/hooks'
import type { Side, PickState, CostTable } from '@/types'
import { pipe, map, sum, toArray } from '@fxts/core'
import { createContext, useEffect, useMemo, useState } from 'react'

type Props = {
  children: React.ReactNode
}
type Score = {
  score: number
  time: number
}

type Context = {
  score: Map<string, Record<Side, Score>>
  totalCost: Record<Side, number>
  costBonusRate: Record<Side, number>
  roundTotalScore: Record<Side, number>
  roundTotalTimeBonus: Record<Side, number>
  totalScore: Record<Side, number>
  setScore: (round: string, side: Side, score: number) => void
  setTime: (round: string, side: Side, time: number) => void
}

export const ScoreContext = createContext<Context>({
  score: new Map(),
  totalCost: { A: 0, B: 0 },
  costBonusRate: { A: 0, B: 0 },
  roundTotalScore: { A: 0, B: 0 },
  roundTotalTimeBonus: { A: 0, B: 0 },
  totalScore: { A: 0, B: 0 },
  setScore: () => {},
  setTime: () => {},
})

function roundTotalCost(pickState: PickState[keyof PickState], costTable: CostTable) {
  return pipe(
    pickState,
    map(({ setting, id }) => {
      if (id === null) return 0

      const { pickup, agentRate, engineType, engineRate } = setting

      const agentCost = pipe(costTable.agent[pickup], ({ used, rate }) => used + rate * agentRate)

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
function getTimeBonus(time: number) {
  return pipe(
    180 - time,
    (value) => {
      if (value <= 0) return 0

      return value
    },
    (value) => value * 333
  )
}

const ScoreProvider: React.FC<Props> = (props) => {
  const { roundList, costTable, state } = useSetting()
  const { pickList } = usePlay()
  const [score, setScore] = useState<Map<string, Record<Side, Score>>>(new Map())
  const totalCost = useMemo(() => {
    const result = { A: 0, B: 0 }

    for (const [, { A, B }] of pickList) {
      result.A += roundTotalCost(A, costTable)
      result.B += roundTotalCost(B, costTable)
    }

    return result
  }, [pickList, costTable])
  const roundTotalScore = useMemo(() => {
    const result = { A: 0, B: 0 }

    for (const [, { A, B }] of score) {
      result.A += A.score
      result.B += B.score
    }

    return result
  }, [score])
  const roundTotalTimeBonus = useMemo(() => {
    const result = { A: 0, B: 0 }

    for (const [, { A, B }] of score) {
      result.A += getTimeBonus(A.time)
      result.B += getTimeBonus(B.time)
    }

    return result
  }, [score])
  const costBonusRate = useMemo(() => {
    return {
      A: 1 + (state.totalCost - totalCost.A) * DEFAULT_COST_RATE,
      B: 1 + (state.totalCost - totalCost.B) * DEFAULT_COST_RATE,
    }
  }, [totalCost, state.totalCost])

  useEffect(() => {
    pipe(
      roundList,
      map((round) => [round, { A: { score: 0, time: 0 }, B: { score: 0, time: 0 } }] as const),
      toArray,
      (data) => setScore(new Map(data))
    )
  }, [roundList])

  return (
    <ScoreContext.Provider
      value={{
        score,
        totalCost,
        roundTotalScore,
        roundTotalTimeBonus,
        costBonusRate,
        totalScore: useMemo(() => {
          return {
            A: roundTotalScore.A + roundTotalTimeBonus.A, // - totalCost.A,
            B: roundTotalScore.B + roundTotalTimeBonus.B, // - totalCost.B,
          }
        }, [totalCost, roundTotalScore, roundTotalTimeBonus]),
        setScore: (round: string, side: Side, score: number) => {
          setScore((prev) => {
            const data = new Map(prev)

            data.set(round, { ...data.get(round)!, [side]: { ...data.get(round)![side], score } })

            return data
          })
        },
        setTime: (round: string, side: Side, time: number) => {
          setScore((prev) => {
            const data = new Map(prev)
            const currentRound = data.get(round)

            if (currentRound) {
              data.set(round, {
                ...currentRound,
                [side]: { ...currentRound[side], time },
              })
            }

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
