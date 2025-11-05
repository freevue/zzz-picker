import { useStore } from '@/hooks'
import { pipe, map, toArray, join, find, sort, zipWithIndex, when } from '@fxts/core'
import { Typo } from '@zzz-picker/components/v2'
import dayjs from 'dayjs'
import { motion } from 'motion/react'
import { useMemo } from 'react'

type Props = {
  active: number | null
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const BossDialog: React.FC<Props> = (props) => {
  const { deadlyAssaultList, gqlBosses, loading } = useStore()
  const currentDeadlyAssault = useMemo(() => {
    if (loading) return []

    return pipe(
      deadlyAssaultList,
      sort((prev, curr) => curr.open.diff(prev.open)),
      find((deadlyAssault) => dayjs(deadlyAssault.open).isBefore(dayjs())),
      (deadlyAssault) =>
        deadlyAssault
          ? [
              gqlBosses.get(deadlyAssault.boss1)!,
              gqlBosses.get(deadlyAssault.boss2)!,
              gqlBosses.get(deadlyAssault.boss3)!,
            ]
          : []
    )
  }, [deadlyAssaultList, gqlBosses, loading])

  return (
    <div className="w-2xl">
      <Typo.Heading className="heading-4xl text-primary">Boss</Typo.Heading>
      <ul className="flex flex-wrap mt-8 w-full justify-between">
        {pipe(
          currentDeadlyAssault,
          when(
            (list) => list.length === 0,
            () => [null, null, null]
          ),
          zipWithIndex,
          map(([index, boss]) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.2 }}
            >
              <button
                className="w-52 aspect-[3/4] group block focus:outline-none cursor-pointer"
                type="button"
                value={boss?.id}
                onClick={props.onClick}
              >
                <div
                  className={pipe(
                    ['w-full', 'overflow-hidden', 'rounded-bl-4xl', 'rounded-tr-4xl', 'bg-netural'],
                    join(' ')
                  )}
                >
                  {boss && (
                    <img className="block w-full" src={`/images/boss/${boss.id}.webp`} alt="" />
                  )}
                </div>
                <span className="text-ink heading-lg mt-4 block w-full text-center group-hover:text-primary break-keep">
                  {boss?.nameKo || '-'}
                </span>
              </button>
            </motion.li>
          )),
          toArray
        )}
      </ul>
    </div>
  )
}

export default BossDialog
