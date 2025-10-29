import type { Side } from '@/types'
import { pipe, join, concat } from '@fxts/core'

type Props = {
  side: Side
}

const Nickname: React.FC<Props> = (props) => {
  return (
    <label className="block">
      <input
        type="text"
        placeholder="닉네임을 입력해주세요"
        className={pipe(
          [
            'placeholder:text-foreground/70',
            'placeholder:text-3xl',
            'focus:outline-none',
            'focus:border-secondary',
            'text-primary',
            'text-4xl',
            'font-black',
            'block',
            'w-full',
            'border-4',
            'border-primary',
            'px-4',
            'py-2',
          ],
          concat(props.side === 'A' ? ['text-right'] : []),
          join(' ')
        )}
      />
    </label>
  )
}

export default Nickname
