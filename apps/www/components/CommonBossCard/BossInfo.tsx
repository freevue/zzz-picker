import { usePlay, useStore } from '@/hooks'
import { pipe, sort, toArray, map, size, transpose, filter, sum, zipWithIndex } from '@fxts/core'
import { Typo } from '@zzz-picker/components/v2'
import type { GQL_Attribute } from '@zzz-picker/graphql'
import dayjs from 'dayjs'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo } from 'react'

const Attributes: React.FC<{ attributes: Array<GQL_Attribute> }> = (props) => {
  return (
    <ul className="flex gap-1">
      {pipe(
        props.attributes,
        map((weakness) => (
          <li key={weakness.id}>
            <img
              className="block size-5"
              src={`/images/attribute/${weakness.id}.webp`}
              alt={weakness.nameKo}
            />
          </li>
        )),
        toArray
      )}
    </ul>
  )
}
const BossInfo: React.FC = () => {
  const { state } = usePlay()
  const { gqlBosses, deadlyAssaultList, loading } = useStore()

  const bossData = useMemo(() => {
    if (loading) return undefined

    return pipe(state.common.boss!, (boss) => gqlBosses.get(boss))
  }, [gqlBosses, state.common.boss, loading])
  const counts = useMemo(() => {
    if (loading) return [0, 0, 0]
    if (deadlyAssaultList === null) return [0, 0, 0]

    return pipe(
      deadlyAssaultList,
      sort((prev, curr) => curr.open.diff(prev.open)),
      filter((deadlyAssault) => dayjs(deadlyAssault.open).isBefore(dayjs())),
      map(({ boss1, boss2, boss3 }) => [boss1, boss2, boss3]),
      toArray,
      (list) => transpose(...list),
      map((list) => filter((bossId) => bossId === state.common.boss!, list)),
      map(size),
      toArray
    )
  }, [deadlyAssaultList, state.common.boss, loading])

  return (
    <AnimatePresence>
      {loading ? null : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-1 h-auto flex-col"
        >
          <Typo.Heading className="heading-3xl text-primary">{bossData?.nameKo}</Typo.Heading>
          <div className="flex gap-2">
            <div className="flex-1 flex gap-1 items-center">
              <Typo.Body className="body-lg text-ink">약점:</Typo.Body>
              <Attributes attributes={bossData?.weakness || []} />
            </div>

            <div className="flex-1 flex gap-1 items-center">
              <Typo.Body className="body-lg text-ink">저항:</Typo.Body>
              <Attributes attributes={bossData?.resistance || []} />
            </div>
          </div>
          <div className="mt-auto border-t border-ink/30 pt-2">
            <Typo.Body className="body-xl text-ink mb-2">강습전 출현 횟수</Typo.Body>
            <div className="flex items-end">
              <div className="">
                {pipe(
                  counts,
                  zipWithIndex,
                  map(([index, count]) => (
                    <Typo.Body key={index} className="text-ink body-lg flex tabular-nums">
                      <span className="w-2.5 text-center">{index + 1}</span>
                      <span>라운드:</span>
                      <span className="w-10 text-right">{count < 10 ? `0${count}` : count}회</span>
                    </Typo.Body>
                  )),
                  toArray
                )}
              </div>
              <Typo.Body className="flex-1 heading-4xl flex gap-2 items-end justify-end text-primary">
                <span className="text-ink tabular-nums">총</span>
                <span className="text-primary heading-4xl text-7xl tabular-nums">
                  {sum(counts)}
                </span>
                <span className="text-ink tabular-nums">회</span>
              </Typo.Body>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default BossInfo
