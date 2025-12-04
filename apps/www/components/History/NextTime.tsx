import Wrap from './Wrap'
import { concat, join, pipe } from '@fxts/core'
import { Typo } from '@zzz-picker/components/v2'

type Props = {}

const NextTime: React.FC<Props> = () => {
  return (
    <Wrap>
      <div
        className={pipe(
          ['transition-opacity', 'duration-300', 'flex', 'gap-8', 'flex-col', 'items-center'],
          concat(['group-[.active]:opacity-100', 'opacity-0']),
          join(' ')
        )}
      >
        <img src="/images/bg.jpg" className="w-5xl rounded-tr-4xl rounded-bl-4xl" alt="" />
        <Typo.Body className="text-ink heading-6xl">
          그러면 다음 엔강대 결과로 찾아오겠습니다.
        </Typo.Body>
        <Typo.Body className="text-ink/50 heading-xs">
          앨리스 팬아트 수집기 만들까 고민중...
        </Typo.Body>
      </div>
    </Wrap>
  )
}

export default NextTime
