import Wrap from './Wrap'
import { concat, join, pipe } from '@fxts/core'
import { Typo, Increase } from '@zzz-picker/components/v2'
import { useState } from 'react'

type Props = {
  count: number
}

const BanCount: React.FC<Props> = (props) => {
  const [isActive, setIsActive] = useState(false)

  const onChange = (isActive: boolean) => {
    setIsActive(isActive)
  }

  return (
    <Wrap onChange={onChange}>
      <div
        className={pipe(
          ['transition-opacity', 'duration-300'],
          concat(['group-[.active]:opacity-100', 'opacity-0']),
          join(' ')
        )}
      >
        <div className="flex gap-1 justify-start">
          <Typo.Body className="text-ink heading-huge">총</Typo.Body>
          <Increase
            className={pipe(['heading-huge', 'text-primary'], join(' '))}
            value={props.count}
            fixed={0}
            isActive={isActive}
          />
          <Typo.Body className="text-ink heading-huge">종류의</Typo.Body>
        </div>
        <div>
          <Typo.Body className="text-ink heading-huge">캐릭터가 밴되었으며,</Typo.Body>
        </div>
      </div>
    </Wrap>
  )
}

export default BanCount
