import BottomSheet from './BottomSheet'
import Nickname from './Nickname'
import Reset from './Reset'
import Round from './Round'
import TotalScore from './TotalScore'
import { usePlay } from '@/hooks'
import { map, pipe, toArray } from '@fxts/core'

const Side: React.FC = () => {
  const { round } = usePlay()

  return (
    <>
      <div className="flex w-full p-4 gap-5 items-center sticky top-0 bg-black z-10">
        <Nickname side="A" />
        <span className="text-3xl font-extrabold dark:text-gray-400">VS</span>
        <Nickname side="B" />
      </div>
      <div className="p-4 flex flex-col gap-20 mt-8">
        {pipe(
          round,
          map(([index, round]) => <Round key={index} id={index} round={round} />),
          toArray
        )}
      </div>
      <div className="p-4 my-8">
        <TotalScore />
      </div>
      <BottomSheet />
      <Reset />
    </>
  )
}

export default Side
