import { pipe, concat, join } from '@fxts/core'

const Pulse: React.FC = () => {
  return (
    <span
      className={pipe(
        ['absolute', '-right-1.5', '-top-1.5', 'w-6', 'h-6', 'rounded-full', 'block', 'bg-primary'],
        concat(['animate-pulse']),
        join(' ')
      )}
    ></span>
  )
}

export default Pulse
