import type { Side } from '.'
import { pipe, concat, join } from '@fxts/core'

type Props = {
  side: Side
}

const Score: React.FC<Props> = (props) => {
  return (
    <div className="">
      <label
        className={pipe(
          ['flex', 'w-full', 'gap-4'],
          concat(props.side === 'A' ? ['flex-row-reverse'] : []),
          join(' ')
        )}
      >
        <span className="text-xl font-bold dark:text-white/70">점수</span>
        <input
          type="number"
          placeholder="점수를 입력해주세요."
          className={pipe(
            [
              'text-md',
              'flex-1',
              'font-bold',
              'dark:text-white',
              'border-b-2',
              'border-white/70',
              'focus:outline-none',
            ],
            concat(props.side === 'A' ? ['text-right'] : []),
            join(' ')
          )}
        />
      </label>
    </div>
  )
}

export default Score
