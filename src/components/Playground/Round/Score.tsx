import { pipe, concat, join } from '@fxts/core'

type Props = {
  className?: string
}

const Score: React.FC<Props> = (props) => {
  return (
    <div
      className={pipe(
        [
          'text-xl',
          'font-bold',
          'dark:text-text-primary',
          'flex',
          'items-center',
          'gap-2',
          'w-2/3',
        ],
        concat([props.className || '']),
        join(' ')
      )}
    >
      <label className="block w-full">
        <input
          placeholder="라운드 점수"
          className="border-2 w-full px-4 py-2 border-text-primary block focus:outline-none focus:border-secondary"
          type="number"
          min={0}
          max={70_000}
        />
      </label>
    </div>
  )
}

export default Score
