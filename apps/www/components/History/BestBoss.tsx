import Wrap from './Wrap'
import {
  concat,
  join,
  pipe,
  flatMap,
  toArray,
  map,
  groupBy,
  size,
  max,
  filter,
  values,
  head,
} from '@fxts/core'
import { Typo } from '@zzz-picker/components/v2'
import type { HistoryData } from '@zzz-picker/constant'
import { useState, useMemo } from 'react'

type Props = {
  history: Array<HistoryData>
}

const BestBoss: React.FC<Props> = (props) => {
  const [isActive, setIsActive] = useState(false)
  const bestBoss = useMemo(() => {
    const forked = pipe(
      props.history,
      flatMap(({ playList }) => playList),
      flatMap(({ aParty, bParty }) => [aParty, bParty]),
      map(({ boss }) => boss),
      groupBy(({ id }) => id),
      values,
      map((list) => ({ ...head(list), count: size(list) })),
      toArray
    )
    const maxCount = pipe(
      forked,
      map(({ count }) => count),
      max
    )

    return pipe(
      forked,
      filter(({ count }) => count === maxCount),
      // map(({ id }) => id),
      // filter(isNumber),
      toArray
    )
  }, [props.history])

  const onChange = (isActive: boolean) => {
    setIsActive(isActive)
  }

  return (
    <Wrap onChange={onChange}>
      <div
        className={pipe(
          ['transition-opacity', 'duration-300', 'flex', 'gap-2', 'flex-col', 'items-center'],
          concat(['group-[.active]:opacity-100', 'opacity-0']),
          join(' ')
        )}
      >
        <Typo.Body className="text-ink heading-huge">가장 많이 죽은 녀석</Typo.Body>
        <div className="flex gap-4">
          {pipe(
            bestBoss,
            map((boss) => (
              <div key={boss.id} className="flex flex-col gap-4 items-center">
                <img
                  className={pipe(
                    [
                      'max-w-md',
                      'flex-1',
                      'block',
                      'transition-opacity',
                      'duration-300',
                      'bg-ink',
                      'rounded-tr-4xl',
                      'rounded-bl-4xl',
                    ],
                    concat(isActive ? ['opacity-100', 'delay-300'] : ['opacity-0']),
                    join(' ')
                  )}
                  src={`/images/boss/${boss.id}.webp`}
                  alt={boss.nameKo}
                />
                <div className="flex gap-2">
                  <Typo.Heading className="text-primary heading-4xl">{boss.nameKo}</Typo.Heading>
                  <Typo.Body className="text-ink heading-4xl">{boss.count}번 죽음</Typo.Body>
                </div>
              </div>
            )),
            toArray
          )}
        </div>
      </div>
    </Wrap>
  )
}

export default BestBoss
