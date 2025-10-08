import type { Side } from '.'
import { pipe, concat, join } from '@fxts/core'

type Props = {
  side: Side
}

const Time: React.FC<Props> = (props) => {
  return (
    <div className="">
      <label
        className={pipe(
          ['flex', 'w-full', 'gap-4'],
          concat(props.side === 'A' ? ['flex-row-reverse'] : []),
          join(' ')
        )}
      >
        <span className="text-xl font-bold dark:text-white/70">시간</span>
        <input
          type="text"
          placeholder="시간을 입력해주세요."
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

export default Time
