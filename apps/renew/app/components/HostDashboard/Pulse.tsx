import { pipe, concat, join } from '@fxts/core'

const Pulse: React.FC = () => {
  return (
    <span
      className={pipe(
        // ['absolute', '-right-1.5', '-top-1.5', 'w-6', 'h-6', 'rounded-full', 'block', 'bg-primary'],
        [
          'absolute',
          'inset-0',
          '-z-1',
          'border-2',
          'border-solid',
          'border-secondary',
          // 'bg-secondary/10',
          'block',
          'rounded-3xl',
        ],
        concat(['animate-pulse']),
        join(' ')
      )}
    ></span>
  )
}

export default Pulse
