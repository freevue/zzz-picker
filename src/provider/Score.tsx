import { useSetting } from '@/hooks'
import type { Side } from '@/types'
import { pipe, map, fromEntries, sum, values } from '@fxts/core'
import { createContext, useEffect, useMemo, useState } from 'react'

type Props = {
  children: React.ReactNode
}
type Score = {
  score: number
  time: string
}

type ScoreContextType = {
  score: Record<string, Record<Side, Score>>
  totalScore: Record<Side, number>
  setScore: (round: string, side: Side, score: Score) => void
}

export const ScoreContext = createContext<ScoreContextType>({
  score: {},
  totalScore: { A: 0, B: 0 },
  setScore: () => {},
})

const ScoreProvider: React.FC<Props> = (props) => {
  const { roundList } = useSetting()
  const [score, setScore] = useState<Record<string, Record<Side, Score>>>({})

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
      fromEntries,
      (data) => setScore(data)
    )
  }, [roundList])

  return (
    <ScoreContext.Provider
      value={{
        score,
        totalScore: useMemo(() => {
          return {
            A: pipe(
              score,
              values,
              map((score) => score.A.score),
              sum
            ),
            B: pipe(
              score,
              values,
              map((score) => score.B.score),
              sum
            ),
          }
        }, [score]),
        setScore: (round: string, side: Side, score: Score) => {
          setScore((prev) => ({ ...prev, [round]: { ...prev[round], [side]: score } }))
        },
      }}
    >
      {props.children}
    </ScoreContext.Provider>
  )
}

export default ScoreProvider
