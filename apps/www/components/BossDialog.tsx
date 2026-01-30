import {
  pipe,
  map,
  toArray,
  join,
  find,
  sort,
  zipWithIndex,
  isUndefined,
  throwIf,
} from '@fxts/core'
import { Typo } from '@zzz-picker/components/v2'
import { useStore } from '@zzz-picker/provider/hooks'
import dayjs from 'dayjs'
import { motion } from 'motion/react'
import { useMemo } from 'react'

type Props = {
  active: number | null
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const BossDialog: React.FC<Props> = (props) => {
  const { deadlyAssaultList, boss } = useStore()
  const currentDeadlyAssault = useMemo(() => {
    try {
      return pipe(
        deadlyAssaultList,
        sort((prev, curr) => curr.open.diff(prev.open)),
        find((deadlyAssault) => dayjs(deadlyAssault.open).isBefore(dayjs())),
        throwIf(isUndefined, () => Error('')),
        ({ boss1, boss2, boss3 }) => [boss1, boss2, boss3]
      )
    } catch {
      return [null, null, null]
    }
  }, [deadlyAssaultList, boss])

  return (
    <div className="max-w-2xl">
      <Typo.Heading className="heading-4xl text-primary">Boss</Typo.Heading>
      <ul className="flex flex-wrap mt-8 gap-6 w-full justify-between">
        {pipe(
          currentDeadlyAssault,
          zipWithIndex,
          map(([index, boss]) => (
            <motion.li
              key={index}
              className="mx-auto"
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
