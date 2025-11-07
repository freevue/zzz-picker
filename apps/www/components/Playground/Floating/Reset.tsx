import { pipe, join } from '@fxts/core'
import { Icons } from '@zzz-picker/components'
import { usePlay } from '@zzz-picker/provider/hooks'

const Reset: React.FC = () => {
  const { reset } = usePlay()

  return (
    <button
      type="button"
      className={pipe(
        [
          'size-12',
          'rounded-full',
          'bg-primary',
          'flex',
          'items-center',
          'justify-center',
          'cursor-pointer',
          'focus:outline-none',
        ],
        join(' ')
      )}
      onClick={reset}
    >
      <Icons.Refresh className="size-7 stroke-content" />
    </button>
  )
}

export default Reset
