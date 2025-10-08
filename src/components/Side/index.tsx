import Nickname from './Nickname'
import Pick from './Pick'

export type Side = 'A' | 'B'

type Props = {}

const Side: React.FC<Props> = (props) => {
  return (
    <div className="w-2xl">
      <div className="flex w-full gap-4 items-center mb-4">
        <Nickname side="A" />
        <span className="text-2xl font-bold dark:text-white/70">VS</span>
        <Nickname side="B" />
      </div>
      <div className="mb-4 flex flex-col gap-2">
        <h3 className="text-2xl font-bold dark:text-white text-center">1라운드</h3>
        <div className="flex justify-between">
          <Pick side="A" />
          <Pick side="B" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-bold dark:text-white text-center">2라운드</h3>
        <div className="flex justify-between">
          <Pick side="A" />
          <Pick side="B" />
        </div>
      </div>
    </div>
  )
}

export default Side
