import { concat, join, pipe } from '@fxts/core'
import { Icons } from '@zzz-picker/components'
import { Dialog } from '@zzz-picker/components/v2'
import { usePlay, useStore } from '@zzz-picker/provider/hooks'
import { useMemo, useState } from 'react'
import { BossDialog } from '~/components'

const Common: React.FC = () => {
  const { boss } = useStore()
  const { state, setState } = usePlay()
  const [isOpen, setIsOpen] = useState(false)
  const bossData = useMemo(() => {
    if (state['common'].boss === null) return undefined

    return boss.get(state['common'].boss)
  }, [state, boss])

  const onBossClick = () => {
    setIsOpen(true)
  }
  const onBossChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    pipe(Number(event.currentTarget.value), (boss) => {
      setState((prev) => ({
        ...prev,
        common: { ...prev.common, boss },
      }))
      setIsOpen(false)
    })
  }

  return (
    <>
      <button
        className={pipe(
          [
            'w-20',
            'aspect-[3/4]',
            'overflow-hidden',
            'group',
            'card-2',
            'inverse',
            'focus:outline-none',
            'cursor-pointer',
          ],
          concat(
            state.common.boss
              ? ['bg-netural']
              : ['items-center', 'justify-center', 'flex', 'bg-content']
          ),
          join(' ')
        )}
        type="button"
        onClick={onBossClick}
      >
        {bossData ? (
          <img className="block w-full" src={bossData.images.src} alt={bossData.nameKo} />
        ) : (
          <Icons.Plus className="stroke-ink block size-10 group-hover:stroke-primary" />
        )}
      </button>
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <BossDialog active={1} onClick={onBossChange} />
      </Dialog>
    </>
  )
}

export default Common
