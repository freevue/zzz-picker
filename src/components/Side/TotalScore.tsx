import type { Side } from '@/types'
import { pipe, join, concat } from '@fxts/core'

type Props = {
  side: Side
}

const TotalScore: React.FC<Props> = (props) => {
  return (
    <div className="flex-3/4 border-b-4 border-primary p-2">
      <label className="block w-full">
        <input
          type="number"
          placeholder="총 점수를 입력해주세요."
          className={pipe(
            [
              'dark:placeholder:text-white/50',
              'focus:outline-none',
              'placeholder:text-xl',
              'placeholder:font-medium',
              'text-primary',
              'text-3xl',
              'font-semibold',
              'block',
              'w-full',
            ],
            concat(props.side === 'A' ? ['text-right'] : []),
            join(' ')
          )}
        />
      </label>
    </div>
  )
}

export default TotalScore
