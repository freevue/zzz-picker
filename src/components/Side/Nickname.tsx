import type { Side } from '@/types'
import { pipe, join, concat } from '@fxts/core'

type Props = {
  side: Side
}

const Nickname: React.FC<Props> = (props) => {
  return (
    <div className="flex-1 border-b-4 border-primary p-2">
      <label className="block w-full">
        <input
          type="text"
          placeholder="닉네임을 입력해주세요"
          className={pipe(
            [
              'dark:placeholder:text-white/50',
              'focus:outline-none',
              'placeholder:text-2xl',
              'placeholder:font-medium',
              'text-primary',
              'text-3xl',
              'font-semibold',
              'block',
              'w-full',
            ],
            concat(props.side === 'A' ? ['text-right'] : []),
            join(' ')
          )}
        />
      </label>
    </div>
  )
}

export default Nickname
