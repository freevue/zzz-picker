import { pipe, concat, join } from '@fxts/core'

type Props = {
  className: string
}

const Score: React.FC<Props> = (props) => {
  return (
    <div
      className={pipe(['flex h-14 bg-accent rounded-2xl w-46', props.className || ''], join(' '))}
    >
      <input
        type="number"
        max={65000}
        min={0}
        className={pipe(
          ['appearance-none', 'flex-1', 'w-20', 'h-full', 'px-4'],
          concat(['text-center', 'text-primary', 'text-2xl', 'ft-ria']),
          concat(['active:outline-0', 'focus:outline-0']),
          join(' ')
        )}
      />
    </div>
  )
}

export default Score
