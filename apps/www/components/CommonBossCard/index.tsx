import BossInfo from './BossInfo'
import { pipe, concat, join, find } from '@fxts/core'
import { useLocation } from '@remix-run/react'
import { Icons } from '@zzz-picker/components'
import { Dialog, Typo } from '@zzz-picker/components/v2'
import { usePlay, useStore } from '@zzz-picker/provider/hooks'
import { useMemo, useState } from 'react'
import { BossDialog } from '~/components'

const BossSelect = () => {
  const { state, setState } = usePlay()
  const { boss } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const bossId = useMemo(() => {
    return state.common.boss
  }, [state.common.boss])
  const bossData = useMemo(() => {
    return bossId ? boss.get(bossId) : undefined
  }, [boss, bossId])

  const onBossClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    pipe(Number(event.currentTarget.value), (boss) => {
      setState((prev) => ({ ...prev, common: { ...prev.common, boss } }))
      setIsOpen(false)
    })
  }

  return (
    <>
      <div className="flex h-fit gap-4 alice:opacity-10">
        <button
          className={pipe(
            [
              'group',
              'items-center',
              'justify-center',
              'card',
              'cursor-pointer',
              'focus:outline-none',
            ],
            concat(
              bossId === null
                ? ['bg-base/70', 'aspect-[4/2]', 'max-h-64', 'w-full', 'flex']
                : ['bg-transparent', 'block']
            ),
            join(' ')
          )}
          type="button"
          onClick={() => setIsOpen(true)}
        >
          {bossId === null ? (
            <Icons.Plus className="stroke-ink size-1/3 group-hover:stroke-primary" />
          ) : (
            <div className="size-64 flex items-start bg-netural">
              <img src={bossData?.images.src} alt="" className="block w-full" />
            </div>
          )}
        </button>
        {bossId !== null && <BossInfo />}
      </div>
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <BossDialog active={bossId} onClick={onBossClick} />
      </Dialog>
    </>
  )
}
const Boss: React.FC = () => {
  const { pathname } = useLocation()

  if (pathname === '/unlimited') return null

  return (
    <div className="p-4">
      <Typo.Heading className="heading-3xl text-primary mb-4">공용 무대</Typo.Heading>
      <BossSelect />
    </div>
  )
}

export default Boss
