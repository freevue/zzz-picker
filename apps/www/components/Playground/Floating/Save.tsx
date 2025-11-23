import { pipe, join } from '@fxts/core'
import { Icons } from '@zzz-picker/components'
import { usePlay, useStore } from '@zzz-picker/provider/hooks'

const Save: React.FC = () => {
  const { save } = useStore()
  const { state, cost } = usePlay()

  const onSaveClick = async () => {
    await save(state, { A: [...cost.A.entries()], B: [...cost.B.entries()] })

    alert('저장되었습니다.')
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
