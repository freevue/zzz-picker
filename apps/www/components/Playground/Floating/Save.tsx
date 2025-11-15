import { pipe, join } from '@fxts/core'
import { Icons } from '@zzz-picker/components'
import { usePlay } from '@zzz-picker/provider/hooks'
import dayjs from 'dayjs'

const Save: React.FC = () => {
  const { state, cost } = usePlay()

  const onSaveClick = () => {
    pipe(
      {
        state,
        cost: { A: [...cost.A.entries()], B: [...cost.B.entries()] },
      },
      (data) => JSON.stringify(data, null, 2),
      (data) => new Blob([data], { type: 'application/json' }),
      URL.createObjectURL,
      (url) => {
        const link = document.createElement('a')

        link.href = url
        link.download = `zzz-picker-${dayjs().format('YYYY-MM-DD-HH-mm-ss')}.json`

        return { link, url }
      },
      ({ link, url }) => {
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }
    )
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
