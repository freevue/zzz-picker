import Wrap from './Wrap'
import {
  concat,
  join,
  pipe,
  flatMap,
  isUndefined,
  values,
  map,
  groupBy,
  head,
  size,
  toArray,
  max,
  filter,
  isNumber,
} from '@fxts/core'
import { Typo } from '@zzz-picker/components/v2'
import type { HistoryData } from '@zzz-picker/constant'
import { useStore } from '@zzz-picker/provider/hooks'
import { useState, useMemo } from 'react'

type Props = {
  history: Array<HistoryData>
}

const BestBan: React.FC<Props> = (props) => {
  const [isActive, setIsActive] = useState(false)
  const { agents } = useStore()
  const bestBan = useMemo(() => {
    const forked = pipe(
      props.history,
      flatMap(({ banList }) => banList),
      groupBy(({ agentId }) => agentId),
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
      map(({ agentId }) => agentId),
      filter(isNumber),
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
        <Typo.Body className="text-ink heading-huge">가장 많이 밴된 캐릭터</Typo.Body>
        <div className="flex gap-4">
          {pipe(
            bestBan,
            map((agentId) => agents.get(agentId)),
            filter((agent) => !isUndefined(agent)),
            map((agent) => (
              <img
                key={agent.id}
                className={pipe(
                  ['max-w-lg', 'flex-1', 'block', 'transition-opacity', 'duration-300'],
                  concat(isActive ? ['opacity-100', 'delay-300'] : ['opacity-0']),
                  join(' ')
                )}
                src={agent.banner.url}
                alt={agent.nameKo}
              />
            )),
            toArray
          )}
        </div>
      </div>
    </Wrap>
  )
}

export default BestBan
