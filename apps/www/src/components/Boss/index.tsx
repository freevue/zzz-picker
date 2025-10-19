import { Plus } from '@/Icons'
import { BossDialog } from '@/components'
import { UI } from '@/components'
import { useStore } from '@/hooks'
import { pipe, concat, join } from '@fxts/core'
import { Button, Dialog } from '@zzz-picker/components'
import { useMemo, useState } from 'react'

const Boss: React.FC = () => {
  const { boss } = useStore()
  const [selected, setSelected] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const bossData = useMemo(() => {
    if (selected === null) return undefined

    return boss.get(selected)
  }, [boss, selected])

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
        <div className="flex items-end gap-4">
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
          <p className="text-text-primary text-2xl font-semibold group-hover:text-secondary">
            {bossData ? bossData.fullNameKo || bossData.fullNameEn : ''}
          </p>
        </div>
      </div>
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <BossDialog active={selected} onChange={onBossClick} />
      </Dialog>
    </>
  )
}

export default Boss
