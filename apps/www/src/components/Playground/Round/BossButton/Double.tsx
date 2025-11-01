import { Plus } from '@/Icons'
import { BossDialog } from '@/components'
import { usePlay, useStore } from '@/hooks'
import { concat, join, pipe } from '@fxts/core'
import { Button, Dialog } from '@zzz-picker/components'
import type { RoundId, Side } from '@zzz-picker/constant'
import { useMemo, useState } from 'react'

type Props = {
  roundId: Extract<RoundId, 'personal' | 'unlimited'>
}

const BossButton: React.FC<Props & { side: Side }> = (props) => {
  const { gqlBosses } = useStore()
  const { state, setState } = usePlay()
  const [isOpen, setIsOpen] = useState(false)
  const side = useMemo(() => ({ ...state[props.roundId][props.side] }), [props, state])
  const bossData = useMemo(
    () => (side.boss === null ? undefined : gqlBosses.get(Number(side.boss))),
    [gqlBosses, side.boss]
  )

  const onBossClick = () => {
    setIsOpen(true)
  }
  const onBossChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    pipe(Number(event.currentTarget.value), (boss) => {
      setState((prev) => ({
        ...prev,
        [props.roundId]: {
          ...prev[props.roundId],
          [props.side]: { ...side, boss },
        },
      }))
      setIsOpen(false)
    })
  }

  return (
    <>
      <Button
        className={pipe(
          ['flex-1', 'aspect-[3/4]', 'overflow-hidden', 'border-2', 'group'],
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
          <Plus className="stroke-foreground block size-10 group-hover:stroke-secondary" />
        )}
      </Button>
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <BossDialog active={state[props.roundId][props.side].boss} onClick={onBossChange} />
      </Dialog>
    </>
  )
}

const Personal: React.FC<Props> = (props) => {
  return (
    <div className="w-full flex px-4">
      <BossButton roundId={props.roundId} side="A" />
      <BossButton roundId={props.roundId} side="B" />
    </div>
  )
}

export default Personal
