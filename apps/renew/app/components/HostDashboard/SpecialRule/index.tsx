import CardTitle from '../CardTitle'
import { pipe, join, concat } from '@fxts/core'

const SpecialRule: React.FC = () => {
  return (
    <div className="card p-4 rounded-3xl">
      <label>
        <CardTitle>Rule</CardTitle>
        <textarea
          name="rule"
          className={pipe(
            [
              'w-full',
              'block',
              'h-30',
              'rounded-2xl',
              'text-3xl',
              'font-bold',
              'p-4',
              'resize-none',
              'scrollbar-hidden',
            ],
            concat(['border-2', 'border-solid', 'border-primary']),
            concat(['active:outline-0', 'focus:outline-0']),
            join(' ')
          )}
        ></textarea>
      </label>
    </div>
  )
}

export default SpecialRule
