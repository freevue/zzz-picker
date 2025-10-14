import type { Side } from '@/types'
import { pipe, concat, join } from '@fxts/core'

type Props = {
  className?: string
  round: string
  side: Side
}

const Time: React.FC<Props> = (props) => {
  return (
    <div
      className={pipe(
        [
          'text-xl',
          'font-bold',
          'dark:text-text-primary',
          'flex',
          'items-center',
          'gap-4',
          'w-2/3',
        ],
        concat([props.className || '']),
        join(' ')
      )}
    >
      <label className="w-1/3">
        <input
          placeholder="분"
          className="border-2 w-full text-center px-4 py-2 border-text-primary block focus:outline-none focus:border-secondary"
          type="number"
        />
      </label>
      <span className="text-center">:</span>
      <label className="w-1/3">
        <input
          placeholder="초"
          className="border-2 w-full text-center px-4 py-2 border-text-primary block focus:outline-none focus:border-secondary"
          type="number"
        />
      </label>
    </div>
  )
}

export default Time
