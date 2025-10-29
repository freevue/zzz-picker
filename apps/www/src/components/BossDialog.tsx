import { useStore } from '@/hooks'
import { pipe, map, toArray, concat, join, find, sort, zipWithIndex } from '@fxts/core'
import { Button, Typo } from '@zzz-picker/components'
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
      <Typo.Heading primary>Boss</Typo.Heading>
      <ul className="flex flex-wrap mt-8 w-full justify-between">
        {pipe(
          currentDeadlyAssault,
          zipWithIndex,
          map(([index, boss]) => (
            <motion.li
              key={boss.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.2 }}
            >
              <Button className="w-52 group" type="button" value={boss.id} onClick={props.onClick}>
                <div
                  className={pipe(
                    [
                      'w-full',
                      'aspect-[3/4]',
                      'overflow-hidden',
                      'rounded-bl-2xl',
                      'rounded-tr-2xl',
                      'border-2',
                    ],
                    concat(
                      props.active === boss.id
                        ? ['border-primary']
                        : ['border-base', 'hover:border-secondary']
                    ),
                    join(' ')
                  )}
                >
                  <img className="block w-full" src={`/images/boss/${boss.id}.webp`} alt="" />
                </div>
                <span className="text-base text-lg font-extrabold mt-4 block w-full text-center group-hover:text-secondary">
                  {boss.nameKo}
                </span>
              </Button>
            </motion.li>
          )),
          toArray
        )}
      </ul>
    </div>
  )
}

export default BossDialog
