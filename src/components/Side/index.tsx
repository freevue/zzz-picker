import Nickname from './Nickname'
import Pick from './Pick'
import TotalScore from './TotalScore'

export type Side = 'A' | 'B'

type Props = {}

const Side: React.FC<Props> = () => {
  return (
    <div className="w-2xl">
      <div className="flex w-full gap-4 items-center">
        <Nickname side="A" />
        <span className="text-2xl font-bold dark:text-white/70">VS</span>
        <Nickname side="B" />
      </div>
      <div className="mt-8 flex flex-col gap-2">
        <h3 className="text-2xl font-bold dark:text-white text-center">1라운드</h3>
        <div className="flex justify-between">
          <Pick side="A" />
          <Pick side="B" />
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <h3 className="text-2xl font-bold dark:text-white text-center">2라운드</h3>
        <div className="flex justify-between">
          <Pick side="A" />
          <Pick side="B" />
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-12">
        <h3 className="text-2xl font-bold dark:text-white text-center">종합</h3>
        <div>
          <div className="flex items-end justify-between gap-12">
            <p className="flex-3/4 text-right text-primary text-3xl font-semibold">10</p>
            <p className="text-2xl text-center flex-1/4 font-bold dark:text-white/70">Cost</p>
            <p className="flex-3/4 text-left text-primary text-3xl font-semibold">10</p>
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
