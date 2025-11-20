import { concat, join, pipe } from '@fxts/core'
import { Icons } from '@zzz-picker/components'
import { Dialog } from '@zzz-picker/components/v2'
import type { Side } from '@zzz-picker/constant'
import { usePlay, useStore } from '@zzz-picker/provider/hooks'
import { useMemo, useState } from 'react'
import { BossDialog } from '~/components'

type Props = {
  side: Side
}

const BossButton: React.FC<Props> = (props) => {
  const { boss } = useStore()
  const { state, setState } = usePlay()
  const [isOpen, setIsOpen] = useState(false)
  const bossData = useMemo(() => {
    if (state.personal[props.side].boss === null) return undefined

    return boss.get(Number(state.personal[props.side].boss))
  }, [state, boss, props.side])

  const onBossClick = () => {
    setIsOpen(true)
  }
  const onBossChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    setState((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [props.side]: { ...prev.personal[props.side], boss: Number(event.currentTarget.value) },
      },
    }))
    setIsOpen(false)
  }

  return (
    <>
      <button
        className={pipe(
          [
            'flex-1',
            'aspect-[3/4]',
            'overflow-hidden',
            'border-2',
            'group',
            'focus:outline-none',
            'cursor-pointer',
          ],
          concat(
            bossData
              ? ['border-primary']
              : [
                  'items-center',
                  'justify-center',
                  'flex',
                  'border-foreground',
                  'hover:border-secondary',
                ]
          ),
          concat(
            props.side === 'A' ? ['border-r-1', 'rounded-bl-2xl'] : ['border-l-1', 'rounded-tr-2xl']
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
          <Icons.Plus className="stroke-foreground block size-10 group-hover:stroke-secondary" />
        )}
      </button>
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <BossDialog active={state.personal[props.side].boss} onClick={onBossChange} />
      </Dialog>
    </>
  )
}
const Personal: React.FC = () => {
  return (
    <div className="w-full flex px-4">
      <BossButton side="A" />
      <BossButton side="B" />
    </div>
  )
}

export default Personal
