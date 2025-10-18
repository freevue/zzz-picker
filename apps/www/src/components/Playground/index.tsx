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
      <div className="sticky bottom-0 left-0 w-full p-4 bg-bg-base/50 backdrop-blur-sm">
        <Ban />
        <button
          type="reset"
          onClick={onResetClick}
          className="size-6 cursor-pointer group absolute right-4 top-4"
        >
          <Refresh className="w-full h-full stroke-text-secondary group-hover:stroke-secondary" />
        </button>
      </div>
    </form>
  )
}

export default Side
