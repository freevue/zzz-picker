import BossInfo from './BossInfo'
import { Plus } from '@/Icons'
import { BossDialog } from '@/components'
import { usePlay, useRouter } from '@/hooks'
import { pipe, concat, join } from '@fxts/core'
import { Button, Dialog, Typo } from '@zzz-picker/components'
import { useEffect, useState } from 'react'

const BossSelect = () => {
  const { state, setState } = usePlay()
  const [isOpen, setIsOpen] = useState(false)

  const onBossClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setState((prev) => ({
      ...prev,
      common: { ...prev.common, boss: Number(event.currentTarget.value) },
    }))
  }

  useEffect(() => {
    setIsOpen(false)
  }, [state.common.boss])

  return (
    <>
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
              'border-foreground',
              'rounded-bl-4xl',
              'rounded-tr-4xl',
              'overflow-hidden',
              'backdrop-blur-md',
            ],
            concat(state.common.boss === null ? [] : ['border-primary']),
            join(' ')
          )}
          type="button"
          onClick={() => setIsOpen(true)}
        >
          {state.common.boss !== null ? (
            <img src={`/images/boss/${state.common.boss}.webp`} alt="" className="blick w-full" />
          ) : (
            <Plus className="stroke-foreground size-14 group-hover:stroke-secondary" />
          )}
        </Button>
        {state.common.boss !== null && <BossInfo />}
      </div>
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <BossDialog active={state.common.boss} onClick={onBossClick} />
      </Dialog>
    </>
  )
}
const Boss: React.FC = () => {
  const { path } = useRouter()

  return (
    <div className="p-4">
      <Typo.Heading primary className="mb-4 flex items-center gap-4">
        {path === '/unlimited' ? '공허사냥꾼 리그' : '공용 무대'}
      </Typo.Heading>
      {path === '/unlimited' ? (
        <div className="flex gap-4">
          <img className="rounded-4xl block w-full alice:opacity-0" src="/images/07.jpg" alt="" />
        </div>
      ) : (
        <BossSelect />
      )}
    </div>
  )
}

export default Boss
