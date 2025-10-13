import Pick from './Pick'
import { UI } from '@/components'
import { usePlay } from '@/hooks'

type Props = {
  children: React.ReactNode
  round: string
}

const Round: React.FC<Props> = (props) => {
  const { pickList } = usePlay()

  return (
    <>
      <div className="">
        <UI.Typo.Heading className="text-2xl font-bold dark:text-text-primary text-center">
          {props.children}
        </UI.Typo.Heading>
        <div className="flex justify-between items-center">
          <Pick side="A" round={props.round} pickList={pickList.get(props.round)!} />
          <div className="flex items-center">
            {/* <button
              className="size-8 block cursor-pointer focus:outline-none group"
              type="button"
              onClick={onResetClick}
            >
              <Refresh className="stroke-white block w-full group-hover:stroke-primary" />
            </button> */}
          </div>
          <Pick side="B" round={props.round} pickList={pickList.get(props.round)!} />
        </div>
      </div>
    </>
  )
}

export default Round
