import Pick from './Pick'
import { Refresh } from '@/Icons'
import { useScore } from '@/hooks'

type Props = {
  children: React.ReactNode
  round: string
}

const Round: React.FC<Props> = (props) => {
  const { setScore } = useScore()

  const onResetClick = () => {
    setScore(props.round, 'A', { score: 0, time: '00분 00초' })
    setScore(props.round, 'B', { score: 0, time: '00분 00초' })
  }

  return (
    <>
      <div className="mt-12 flex flex-col gap-2">
        <h3 className="text-3xl font-bold dark:text-white text-center">{props.children}</h3>
        <div className="flex justify-between items-center">
          <Pick side="A" round={props.round} />
          <div className="flex items-center">
            <button
              className="size-8 block cursor-pointer focus:outline-none group"
              type="button"
              onClick={onResetClick}
            >
              <Refresh className="stroke-white block w-full group-hover:stroke-primary" />
            </button>
          </div>
          <Pick side="B" round={props.round} />
        </div>
      </div>
    </>
  )
}

export default Round
