import { pipe, join } from '@fxts/core'
import { Icons } from '@zzz-picker/components'

// import { usePlay } from '@zzz-picker/provider/hooks'

const Save: React.FC = () => {
  // const { state } = usePlay()

  const onSaveClick = () => {
    alert('서비스 준비중입니다.')
  }

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
      onClick={onSaveClick}
    >
      <Icons.Save className="size-7 stroke-content" />
    </button>
  )
}

export default Save
