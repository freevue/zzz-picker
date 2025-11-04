import BossInfo from './BossInfo'
import { Plus } from '@/Icons'
import { usePlay } from '@/hooks'
import { pipe, concat, join } from '@fxts/core'
import { useLocation } from '@remix-run/react'
import { Dialog, Typo } from '@zzz-picker/components/v2'
import { useState } from 'react'
import { BossDialog } from '~/components'

const BossSelect = () => {
  const { state, setState } = usePlay()
  const [isOpen, setIsOpen] = useState(false)

  const onBossClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    pipe(Number(event.currentTarget.value), (boss) => {
      setState((prev) => ({ ...prev, common: { ...prev.common, boss } }))
      setIsOpen(false)
    })
  }

  return (
    <>
      <div className="flex h-fit gap-4 alice:opacity-20">
        <button
          className={pipe(
            [
              'group',
              'items-center',
              'justify-center',
              'rounded-bl-4xl',
              'rounded-tr-4xl',
              'overflow-hidden',
              'cursor-pointer',
              'focus:outline-none',
            ],
            concat(
              state.common.boss === null
                ? ['bg-base/70', 'aspect-[4/2]', 'max-h-64', 'w-full', 'flex']
                : ['bg-transparent', 'block']
            ),
            join(' ')
          )}
          type="button"
          onClick={() => setIsOpen(true)}
        >
          {state.common.boss !== null ? (
            <div className="size-64 flex items-start bg-netural">
              <img src={`/images/boss/${state.common.boss}.webp`} alt="" className="block w-full" />
            </div>
          ) : (
            <Plus className="stroke-ink size-1/3 group-hover:stroke-primary" />
          )}
        </button>
        {state.common.boss !== null && <BossInfo />}
      </div>
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <BossDialog active={state.common.boss} onClick={onBossClick} />
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
