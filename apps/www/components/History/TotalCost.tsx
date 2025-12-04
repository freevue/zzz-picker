import Wrap from './Wrap'
import { concat, join, pipe, map, isEmpty, flatMap, sum } from '@fxts/core'
import { Typo, Increase } from '@zzz-picker/components/v2'
import type { HistoryData } from '@zzz-picker/constant'
import { useHistoryRecord } from '@zzz-picker/provider/hooks'
import { useState, useMemo } from 'react'

type Props = {
  history: Array<HistoryData>
}

const TotalCost: React.FC<Props> = (props) => {
  const data = useHistoryRecord(props.history)
  const [isActive, setIsActive] = useState(false)
  const totalCost = useMemo(() => {
    if (isEmpty(data)) return 0

    return pipe(
      data,
      flatMap((item) => [item.aSide, item.bSide]),
      map(({ totalCost }) => totalCost),
      sum
    )!
  }, [data])

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
        <div className="flex gap-4 justify-start">
          <Typo.Body className="text-ink heading-huge">총</Typo.Body>
          <Increase
            className={pipe(['heading-huge', 'text-primary'], join(' '))}
            value={totalCost}
            fixed={0}
            isActive={isActive}
          />
          <Typo.Body className="text-ink heading-huge">코스트를</Typo.Body>
        </div>
        <div>
          <Typo.Body className="text-ink heading-huge">사용하였으며,</Typo.Body>
        </div>
      </div>
    </Wrap>
  )
}

export default TotalCost
