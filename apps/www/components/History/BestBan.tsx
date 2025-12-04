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
      map((list) => ({ ...head(list)!, count: size(list) })),
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
      map(({ agentId, count }) => ({ agentId, count })),
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
          ['transition-opacity', 'duration-300', 'flex', 'gap-8', 'flex-col', 'items-center'],
          concat(['group-[.active]:opacity-100', 'opacity-0']),
          join(' ')
        )}
      >
        <Typo.Body className="text-ink heading-6xl">가장 많이 밴된 캐릭터</Typo.Body>
        <div className="flex gap-4">
          {pipe(
            bestBan,
            map(({ agentId, count }) => ({ agent: agents.get(agentId)!, count })),
            filter((agent) => !isUndefined(agent)),
            map(({ agent, count }) => (
              <div key={agent.id} className="flex flex-col gap-4 items-center">
                <img
                  className={pipe(
                    ['max-w-md', 'flex-1', 'block', 'transition-opacity', 'duration-300'],
                    concat(isActive ? ['opacity-100', 'delay-300'] : ['opacity-0']),
                    join(' ')
                  )}
                  src={agent.banner.url}
                  alt={agent.nameKo}
                />
                <Typo.Body className="text-ink heading-4xl">{count}번 버림받음</Typo.Body>
              </div>
            )),
            toArray
          )}
        </div>
      </div>
    </Wrap>
  )
}

export default BestBan
