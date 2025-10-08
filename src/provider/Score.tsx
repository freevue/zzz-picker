import { useSetting } from '@/hooks'
import { pipe, map, fromEntries } from '@fxts/core'
import { createContext, useEffect, useState } from 'react'

type Props = {
  children: React.ReactNode
}
type Score = {
  score: number
  time: string
}

type ScoreContextType = {
  score: Record<string, Score>
  setScore: (round: string, score: Score) => void
}

export const ScoreContext = createContext<ScoreContextType>({
  score: {},
  setScore: () => {},
})

const ScoreProvider: React.FC<Props> = (props) => {
  const { roundList } = useSetting()
  const [score, setScore] = useState<Record<string, Score>>({})

  useEffect(() => {
    pipe(
      roundList,
      map((round) => [round, { score: 0, time: '00분 00초' }] as const),
      fromEntries,
      (data) => setScore(data)
    )
  }, [roundList])

  return (
    <ScoreContext.Provider
      value={{
        score,
        setScore: (round: string, score: Score) => {
          setScore((prev) => ({ ...prev, [round]: score }))
        },
      }}
    >
      {props.children}
    </ScoreContext.Provider>
  )
}

export default ScoreProvider
