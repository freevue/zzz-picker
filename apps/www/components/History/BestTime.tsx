import Wrap from './Wrap'
import {
  concat,
  join,
  pipe,
  isUndefined,
  map,
  toArray,
  filter,
  sortBy,
  isEmpty,
  isNull,
  last,
  zipWithIndex,
  flatMap,
} from '@fxts/core'
import { Typo, Increase } from '@zzz-picker/components/v2'
import type { HistoryData } from '@zzz-picker/constant'
import { useStore, useHistoryRecord } from '@zzz-picker/provider/hooks'
import { useState, useMemo } from 'react'

type Props = {
  history: Array<HistoryData>
}

const BestTime: React.FC<Props> = (props) => {
  const { agents } = useStore()
  const data = useHistoryRecord(props.history)
  const [isActive, setIsActive] = useState(false)
  const bestTime = useMemo(() => {
    if (isEmpty(data)) return null

    return pipe(
      data,
      flatMap((item) => [item.aSide, item.bSide]),
      sortBy(({ remainingTime }) => remainingTime),
      last
    )!
  }, [data])

  const onChange = (isActive: boolean) => {
    setIsActive(isActive)
  }

  if (isNull(bestTime)) return null

  return (
    <Wrap onChange={onChange}>
      <div
        className={pipe(
          ['transition-opacity', 'duration-300', 'flex', 'gap-8', 'flex-col', 'items-center'],
          concat(['group-[.active]:opacity-100', 'opacity-0']),
          join(' ')
        )}
      >
        <Typo.Body className="text-ink heading-6xl">가장 빨리 퇴근한 시간은</Typo.Body>
        <div className="flex gap-16 items-center">
          <div className="flex flex-col gap-8 items-center">
            {pipe(
              bestTime.playData,
              map((playData) => [
                playData.select_1.agentId,
                playData.select_2.agentId,
                playData.select_3.agentId,
              ]),
              zipWithIndex,
              map(([index, agentIdList]) => (
                <div key={index} className="flex gap-8 items-end">
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
            <div className="flex gap-2 items-center mt-8">
              <Increase
                value={(bestTime.remainingTime) / 60}
                className="heading-6xl text-primary"
                isActive={isActive}
                fixed={0}
              />
              <Typo.Body className="text-ink heading-6xl mr-4">분</Typo.Body>
              <Increase
                value={(bestTime.remainingTime) % 60}
                className="heading-6xl text-primary"
                isActive={isActive}
                fixed={0}
              />
              <Typo.Body className="text-ink heading-6xl">초만에 퇴근하셨습니다.</Typo.Body>
            </div>
          </div>
        </div>
      </div>
    </Wrap>
  )
}

export default BestTime
