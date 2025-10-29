import { Plus } from '@/Icons'
import { BossDialog } from '@/components'
import { usePlay, useStore } from '@/hooks'
import { concat, join, pipe } from '@fxts/core'
import { Button, Dialog } from '@zzz-picker/components'
import { useMemo, useState } from 'react'

const Common: React.FC = () => {
  const { gqlBosses } = useStore()
  const { state, setState } = usePlay()
  const [isOpen, setIsOpen] = useState(false)
  const bossData = useMemo(() => {
    if (state['common'].boss === null) return undefined

    return gqlBosses.get(state['common'].boss)
  }, [state, gqlBosses])

  const onBossClick = () => {
    setIsOpen(true)
  }
  const onBossChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    setState((prev) => ({
      ...prev,
      common: { ...prev.common, boss: Number(event.currentTarget.value) },
    }))
    setIsOpen(false)
  }

  return (
    <>
      <Button
        className={pipe(
          [
            'w-20',
            'aspect-[3/4]',
            'overflow-hidden',
            'border-2',
            'group',
            'rounded-bl-2xl',
            'rounded-tr-2xl',
          ],
          concat(
            state.common.boss
              ? ['border-primary']
              : ['items-center', 'justify-center', 'flex', 'border-foreground']
          ),
          join(' ')
        )}
        type="button"
        onClick={onBossClick}
      >
        {bossData ? (
          <img
            className="block w-full"
            src={`/images/boss/${bossData.id}.webp`}
            alt={bossData.nameKo}
          />
        ) : (
          <Plus className="stroke-foreground block size-10 group-hover:stroke-secondary" />
        )}
      </Button>
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <BossDialog active={1} onClick={onBossChange} />
      </Dialog>
    </>
  )
}

export default Common
