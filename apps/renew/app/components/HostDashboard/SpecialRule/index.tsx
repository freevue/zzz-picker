import { pipe, join, concat } from '@fxts/core'

const SpecialRule: React.FC = () => {
  return (
    <div className="card p-4 rounded-3xl">
      <label>
        <h2 className="ft-ria text-primary text-6xl mb-4">Rule</h2>
        <textarea
          name="rule"
          className={pipe(
            ['w-full', 'card', 'block', 'h-40', 'rounded-2xl', 'text-5xl', 'font-bold', 'p-4'],
            concat(['border-4', 'border-solid', 'border-primary']),
            concat(['active:outline-0', 'focus:outline-0']),
            join(' ')
          )}
        ></textarea>
      </label>
    </div>
  )
}

export default SpecialRule
