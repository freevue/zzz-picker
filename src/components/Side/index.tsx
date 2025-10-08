import Nickname from './Nickname'
import Round from './Round'
import TotalScore from './TotalScore'
import { useSetting, useScore } from '@/hooks'
import { entries, map, pipe, sum, toArray, zipWithIndex } from '@fxts/core'
import { useMemo } from 'react'

export type Side = 'A' | 'B'

type Props = {}

const Side: React.FC<Props> = () => {
  const { roundList } = useSetting()
  const { score } = useScore()

  return (
    <div className="w-3xl">
      <div className="flex w-full gap-4 items-center">
        <Nickname side="A" />
        <span className="text-2xl font-bold dark:text-white/70">VS</span>
        <Nickname side="B" />
      </div>
      {pipe(
        roundList,
        zipWithIndex,
        map(([index, round]) => (
          <Round key={index} round={round}>
            {round}
          </Round>
        )),
        toArray
      )}
      <div className="flex flex-col gap-2 mt-16">
        <h3 className="text-2xl font-bold dark:text-white text-center">종합</h3>
        <div>
          <div className="flex items-end justify-between gap-12">
            <p className="flex-3/4 text-right text-primary text-3xl font-semibold">{0}</p>
            <p className="text-2xl text-center flex-1/4 font-bold dark:text-white/70">Cost</p>
            <p className="flex-3/4 text-left text-primary text-3xl font-semibold">{0}</p>
          </div>
        </div>
        <div className="flex items-end justify-between gap-12">
          <TotalScore side="A" />
          <p className="text-2xl text-center font-bold flex-1/4 dark:text-white/70">점수</p>
          <TotalScore side="B" />
        </div>
      </div>
    </div>
  )
}

export default Side
