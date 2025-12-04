import Wrap from './Wrap'
import {
  concat,
  join,
  pipe,
  isUndefined,
  map,
  head,
  toArray,
  filter,
  sortBy,
  isEmpty,
  isNull,
  zipWithIndex,
} from '@fxts/core'
import { Typo, Increase } from '@zzz-picker/components/v2'
import type { HistoryData } from '@zzz-picker/constant'
import { useStore, useHistoryRecord } from '@zzz-picker/provider/hooks'
import { useState, useMemo } from 'react'

type Props = {
  history: Array<HistoryData>
}

const BestMatch: React.FC<Props> = (props) => {
  const { agents } = useStore()
  const data = useHistoryRecord(props.history)
  const [isActive, setIsActive] = useState(false)
  const bestMatch = useMemo(() => {
    if (isEmpty(data)) return null

    return pipe(
      data,
      map((item) => ({
        ...item,
        diff: Math.abs(item.aSide.totalScore - item.bSide.totalScore),
      })),
      sortBy(({ diff }) => diff),
      head
    )!
  }, [data])

  const onChange = (isActive: boolean) => {
    setIsActive(isActive)
  }

  if (isNull(bestMatch)) return null

  return (
    <Wrap onChange={onChange}>
      <div
        className={pipe(
          ['transition-opacity', 'duration-300', 'flex', 'gap-8', 'flex-col', 'items-center'],
          concat(['group-[.active]:opacity-100', 'opacity-0']),
          join(' ')
        )}
      >
        <Typo.Body className="text-ink heading-huge">가장 치열했던 경기는</Typo.Body>
        <div className="flex gap-16 items-center">
          <div className="flex flex-col items-center">
            {pipe(
              bestMatch.aSide.playData,
              map((playData) => [
                playData.select_1.agentId,
                playData.select_2.agentId,
                playData.select_3.agentId,
              ]),
              zipWithIndex,
              map(([index, agentIdList]) => (
                <div key={index} className="flex items-end">
                  {pipe(
                    agentIdList,
                    map((agentId) => agents.get(agentId)),
                    filter((agent) => !isUndefined(agent)),
                    map((agent) => (
                      <div key={agent.id}>
                        <img src={agent.banner.url} className="w-40 block" />
                        {/* <Typo.Body className="text-ink heading-4xl">{agent.nameKo}</Typo.Body> */}
                      </div>
                    )),
                    toArray
                  )}
                </div>
              )),
              toArray
            )}
            <Increase
              value={bestMatch.aSide.totalScore}
              className="mt-8 heading-4xl text-ink"
              isActive={isActive}
              fixed={0}
            />
          </div>
          <div className="text-center w-3xs">
            <Typo.Body className="text-ink heading-2xl">차이</Typo.Body>
            <Increase
              className="heading-6xl text-primary"
              value={bestMatch.diff}
              isActive={isActive}
              fixed={0}
            />
          </div>
          <div className="flex flex-col items-center">
            {pipe(
              bestMatch.bSide.playData,
              map((playData) => [
                playData.select_1.agentId,
                playData.select_2.agentId,
                playData.select_3.agentId,
              ]),
              zipWithIndex,
              map(([index, agentIdList]) => (
                <div key={index} className="flex items-end">
                  {pipe(
                    agentIdList,
                    map((agentId) => agents.get(agentId)),
                    filter((agent) => !isUndefined(agent)),
                    map((agent) => (
                      <div key={agent.id}>
                        <img src={agent.banner.url} className="w-40 block" />
                        {/* <Typo.Body className="text-ink heading-4xl">{agent.nameKo}</Typo.Body> */}
                      </div>
                    )),
                    toArray
                  )}
                </div>
              )),
              toArray
            )}
            <Increase
              value={bestMatch.bSide.totalScore}
              className="mt-8 heading-4xl text-ink"
              isActive={isActive}
              fixed={0}
            />
          </div>
        </div>
      </div>
    </Wrap>
  )
}

export default BestMatch
