import { pipe, join } from '@fxts/core'
import { Save as SaveIcon } from '@zzz-picker/components/icons'

type Props = {
  onSave: () => void
}

const Save: React.FC<Props> = (props) => {
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
      onClick={props.onSave}
    >
      <SaveIcon className="size-7 stroke-content" />
    </button>
  )
}

export default Save
