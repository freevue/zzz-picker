import Nickname from './Nickname'
import Round from './Round'
import TotalScore from './TotalScore'
import { useSetting, useScore, usePick } from '@/hooks'
import { entries, map, pipe, sum, toArray, zipWithIndex } from '@fxts/core'

type Props = {}

const Side: React.FC<Props> = () => {
  const { roundList, totalCost: settingTotalCost } = useSetting()
  const { score } = useScore()
  const { totalCost } = usePick()

  return (
    <div className="w-3xl overflow-auto scrollbar-hidden">
      <div className="flex w-full gap-4 items-center sticky top-0 bg-black z-10 p-4">
        <Nickname side="A" />
        <span className="text-2xl font-bold dark:text-white/70">VS</span>
        <Nickname side="B" />
      </div>
      <div className="p-4">
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
          <h3 className="text-3xl font-bold dark:text-white text-center">종합</h3>
          <div className="flex items-end justify-between gap-12">
            <p className="flex-3/4 text-right dark:text-white text-3xl font-semibold">
              {pipe(
                score,
                entries,
                map(([, score]) => score.A.score),
                sum
              )}
            </p>
            <p className="text-xl text-center font-bold flex-2/4 dark:text-white/70">라운드 점수</p>
            <p className="flex-3/4 text-left dark:text-white text-3xl font-semibold">
              {pipe(
                score,
                entries,
                map(([, score]) => score.B.score),
                sum
              )}
            </p>
          </div>
          <div className="flex items-end justify-between gap-12">
            <p className="flex-3/4 text-right dark:text-white text-3xl font-semibold">
              {settingTotalCost - totalCost.A}
            </p>
            <p className="text-xl text-center flex-2/4 font-bold dark:text-white/70">잔여 Cost</p>
            <p className="flex-3/4 text-left dark:text-white text-3xl font-semibold">
              {settingTotalCost - totalCost.B}
            </p>
          </div>
          <div className="flex items-end justify-between gap-12 mt-10 pb-10">
            <TotalScore side="A" />
            <p className="text-2xl text-center font-bold flex-1/4 dark:text-white/70">총점</p>
            <TotalScore side="B" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Side
