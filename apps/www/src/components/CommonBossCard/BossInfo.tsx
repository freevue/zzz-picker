import { usePlay, useStore } from '@/hooks'
import { pipe, sort, toArray, map, size, transpose, filter, sum, zipWithIndex } from '@fxts/core'
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
          <p className="text-foreground text-3xl font-bold">{bossData?.nameKo}</p>
          <div className="flex gap-2">
            <div className="flex-1 flex gap-1 items-center">
              <p className="text-foreground text-lg font-semibold">약점:</p>
              <Attributes attributes={bossData?.weakness || []} />
            </div>

            <div className="flex-1 flex gap-1 items-center">
              <p className="text-foreground text-lg font-semibold">저항:</p>
              <Attributes attributes={bossData?.resistance || []} />
            </div>
          </div>
          <div className="mt-auto border-t border-foreground/30 pt-2">
            <p className="text-foreground text-xl font-semibold mb-2">강습전 출현 횟수</p>
            <div className="flex items-end">
              <ul className="flex flex-col text-foreground text-xl font-semibold">
                {pipe(
                  counts,
                  zipWithIndex,
                  map(([index, count]) => (
                    <li key={index} className="flex items-end gap-1">
                      <span>{index + 1}라운드:</span>
                      <span className="text-secondary text-2xl font-bold">{count}</span>
                      <span>회</span>
                    </li>
                  )),
                  toArray
                )}
              </ul>
              <p className="flex-1 text-5xl font-bold flex gap-2 items-end justify-end text-foreground">
                <span>총</span>
                <span className="text-secondary text-7xl font-black">{sum(counts)}</span>
                <span>회</span>
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default BossInfo
