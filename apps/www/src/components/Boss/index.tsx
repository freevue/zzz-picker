import { Plus } from '@/Icons'
import { BossDialog } from '@/components'
import { UI } from '@/components'
import { useStore } from '@/hooks'
import {
  pipe,
  concat,
  join,
  toArray,
  map,
  size,
  transpose,
  filter,
  sum,
  split,
  zipWithIndex,
} from '@fxts/core'
import { Button, Dialog } from '@zzz-picker/components'
import { useMemo, useState } from 'react'

const Boss: React.FC = () => {
  const { boss, deadlyAssaultList } = useStore()
  const [selected, setSelected] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const bossData = useMemo(() => {
    if (selected === null) return undefined
    if (boss.get(selected) === undefined) return undefined

    return pipe(boss.get(selected), (data) => ({
      ...data,
      weakness: data!.weakness ? pipe(data!.weakness, split(','), toArray) : [],
      resistance: data!.resistance ? pipe(data!.resistance, split(','), toArray) : [],
    }))
  }, [boss, selected])
  const counts = useMemo(() => {
    if (deadlyAssaultList === null) return [0, 0, 0]
    if (selected === null) return [0, 0, 0]

    return pipe(
      deadlyAssaultList,
      map(({ boss1, boss2, boss3 }) => [boss1, boss2, boss3]),
      toArray,
      (list) => transpose(...list),
      map((list) => filter((bossId) => bossId === selected, list)),
      map(size),
      toArray
    )
  }, [deadlyAssaultList, selected])

  console.log(bossData)

  const onBossClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSelected(Number(event.currentTarget.value))
    setIsOpen(false)
  }

  return (
    <>
      <div className="p-4">
        <UI.Typo.Heading primary className="mb-4 flex items-center gap-4">
          공용 무대
        </UI.Typo.Heading>
        <div className="flex h-fit gap-4">
          <Button
            className={pipe(
              [
                'group',
                'min-w-40',
                'w-40',
                'aspect-[3/4]',
                'flex',
                'items-center',
                'justify-center',
                'border-2',
                'border-gray-50',
                'rounded-bl-2xl',
                'rounded-tr-2xl',
                'overflow-hidden',
              ],
              concat(bossData ? ['border-primary'] : ['hover:border-secondary']),
              join(' ')
            )}
            type="button"
            onClick={() => setIsOpen(true)}
          >
            {selected !== null && bossData ? (
              <img
                src={`/boss/${bossData.image}`}
                alt={bossData.fullNameEn}
                className="blick w-full"
              />
            ) : (
              <Plus className="stroke-text-primary size-14 group-hover:stroke-secondary" />
            )}
          </Button>
          <div className="flex flex-1 h-auto flex-col">
            {!!selected && (
              <>
                <p className="text-gray-50 text-3xl font-bold">
                  {bossData?.fullNameKo || bossData?.fullNameEn || ''}
                </p>
                <div className="flex gap-2">
                  <div className="flex-1 flex gap-1 items-center">
                    <p className="text-gray-50 text-lg font-semibold">약점:</p>
                    <ul className="flex gap-1">
                      {pipe(
                        bossData?.weakness || [],
                        map((weakness) => (
                          <li key={weakness}>
                            <img
                              className="block size-5"
                              src={`/attribute/Icon_${weakness}.webp`}
                              alt={weakness}
                            />
                          </li>
                        )),
                        toArray
                      )}
                    </ul>
                  </div>

                  <div className="flex-1 flex gap-1 items-center">
                    <p className="text-gray-50 text-lg font-semibold">강점:</p>
                    <ul className="flex gap-1">
                      {pipe(
                        bossData?.resistance || [],
                        map((resistance) => (
                          <li key={resistance}>
                            <img
                              className="block size-5"
                              src={`/attribute/Icon_${resistance}.webp`}
                              alt={resistance}
                            />
                          </li>
                        )),
                        toArray
                      )}
                    </ul>
                  </div>
                </div>
                <div className="mt-auto border-t border-gray-500 pt-2">
                  <p className="text-gray-50 text-xl font-semibold mb-2">강습전 출현 횟수</p>
                  <div className="flex items-end">
                    <ul className="flex flex-col text-gray-50 text-xl font-semibold">
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
                    <p className="flex-1 text-5xl font-bold flex gap-2 items-end justify-end">
                      <span>총</span>
                      <span className="text-secondary text-7xl font-black">{sum(counts)}</span>
                      <span>회</span>
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <BossDialog active={selected} onChange={onBossClick} />
      </Dialog>
    </>
  )
}

export default Boss
