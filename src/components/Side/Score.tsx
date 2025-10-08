import type { Side } from '.'
import { pipe, concat, join } from '@fxts/core'

type Props = {
  side: Side
}

const Score: React.FC<Props> = (props) => {
  return (
    <label className={pipe(['flex-3/4'], join(' '))}>
      <input
        type="number"
        placeholder="점수를 입력해주세요."
        className={pipe(
          [
            'text-md',
            'font-bold',
            'dark:text-white',
            'border-b-2',
            'border-white/70',
            'focus:outline-none',
            'block',
            'w-full',
          ],
          concat(props.side === 'A' ? ['text-right'] : []),
          join(' ')
        )}
      />
    </label>
  )
}

export default Score
