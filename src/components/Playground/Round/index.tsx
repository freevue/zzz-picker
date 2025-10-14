import Pick from './Pick'
import { Plus } from '@/Icons'
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
      <div className="w-full">
        <UI.Typo.Heading className="text-2xl font-bold dark:text-text-primary text-center">
          {props.children}
        </UI.Typo.Heading>
        <div className="flex justify-between items-center">
          <Pick side="A" round={props.round} pickList={pickList.get(props.round)!} />
          <div className="flex items-center flex-1">
            <button
              className="h-22 w-18 border-2 items-center justify-center border-text-primary hover:border-secondary flex cursor-pointer focus:outline-none group"
              type="button"
              // onClick={onResetClick}
            >
              <Plus className="stroke-white block size-10 group-hover:stroke-secondary" />
            </button>
          </div>
          <Pick side="B" round={props.round} pickList={pickList.get(props.round)!} />
        </div>
      </div>
    </>
  )
}

export default Round
