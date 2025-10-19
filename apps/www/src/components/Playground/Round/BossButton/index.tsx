import { Plus } from '@/Icons'
import { BossDialog } from '@/components'
import { usePlay, useStore } from '@/hooks'
import { concat, join, pipe } from '@fxts/core'
import { Button, Dialog } from '@zzz-picker/components'
import type { SelectBoss } from '@zzz-picker/provider'
import { useMemo, useState } from 'react'

type Props = {
  boss: SelectBoss
  roundId: number
}

const BossButton: React.FC<Props> = (props) => {
  const { boss } = useStore()
  const { setRoundBossSelect } = usePlay()
  const [isOpen, setIsOpen] = useState(false)
  const bossData = useMemo(() => {
    if (props.boss === null) return undefined

    return boss.get(props.boss)
  }, [props.boss, boss])

  const onBossClick = () => {
    setIsOpen(true)
  }
  const onBossChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    setRoundBossSelect(props.roundId, Number(event.currentTarget.value))
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
            props.boss
              ? ['border-primary']
              : [
                  'items-center',
                  'justify-center',
                  'flex',
                  'border-gray-50',
                  'hover:border-secondary',
                ]
          ),
          join(' ')
        )}
        type="button"
        onClick={onBossClick}
      >
        {bossData ? (
          <img className="block w-full" src={`/boss/${bossData.image}`} alt={bossData.fullNameEn} />
        ) : (
          <Plus className="stroke-gray-50 block size-10 group-hover:stroke-secondary" />
        )}
      </Button>

      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <BossDialog active={props.boss} onChange={onBossChange} />
      </Dialog>
    </>
  )
}

export default BossButton
