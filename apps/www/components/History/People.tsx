import Wrap from './Wrap'
import { concat, join, pipe } from '@fxts/core'
import { Typo, Increase } from '@zzz-picker/components/v2'
import { useState } from 'react'

type Props = {
  count: number
}

const People: React.FC<Props> = (props) => {
  const [isActive, setIsActive] = useState(false)

  const onChange = (isActive: boolean) => {
    setIsActive(isActive)
  }

  return (
    <Wrap onChange={onChange}>
      <div
        className={pipe(
          ['transition-opacity', 'duration-300', 'flex', 'gap-1'],
          concat(['group-[.active]:opacity-100', 'opacity-0']),
          join(' ')
        )}
      >
        <Increase
          className={pipe(['heading-huge', 'text-primary'], join(' '))}
          value={props.count}
          fixed={0}
          isActive={isActive}
        />
        <Typo.Body className="text-ink heading-huge">분께서 참가하였습니다.</Typo.Body>
      </div>
    </Wrap>
  )
}

export default People
