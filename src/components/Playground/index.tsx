import Ban from './Ban'
import Nickname from './Nickname'
import Round from './Round'
import TotalScore from './TotalScore'
import { Refresh } from '@/Icons'
import { useBan, useSetting } from '@/hooks'
import { map, pipe, toArray, zipWithIndex } from '@fxts/core'

type Props = {}

const Side: React.FC<Props> = () => {
  const { roundList } = useSetting()
  const { reset } = useBan()

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  const onResetClick = () => {
    reset()
  }

  return (
    <form onSubmit={onSubmit} className="block w-full">
      <div className="flex w-full p-4 gap-4 items-center sticky top-0 bg-black z-10">
        <Nickname side="A" />
        <span className="text-2xl font-bold dark:text-text-secondary">VS</span>
        <Nickname side="B" />
      </div>
      <div className="p-4 flex flex-col gap-6 mt-8">
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
      </div>
      <div className="p-4 my-8">
        <TotalScore />
      </div>
      <div className="sticky bottom-0 left-0 w-full p-4 bg-bg-base">
        <Ban />
        <button
          type="reset"
          onClick={onResetClick}
          className="size-6 cursor-pointer group absolute right-4 top-4"
        >
          <Refresh className="w-full h-full stroke-text-secondary group-hover:stroke-secondary" />
        </button>
      </div>
      {/* <div className="p-4">
        <div className="flex flex-col gap-2 mt-16">
          <h3 className="text-3xl font-bold dark:text-white text-center">종합</h3>
          <div className="flex items-end justify-between gap-12">
            <p className="flex-3/4 text-right dark:text-white text-3xl font-semibold">
              {totalScore.A}
            </p>
            <p className="text-xl text-center font-bold flex-2/4 dark:text-white/70">라운드 점수</p>
            <p className="flex-3/4 text-left dark:text-white text-3xl font-semibold">
              {totalScore.B}
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
      </div> */}
    </form>
  )
}

export default Side
