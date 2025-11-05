import { concat, join, pipe } from '@fxts/core'
import { Icons } from '@zzz-picker/components'
import { Dialog } from '@zzz-picker/components/v2'
import type { RoundId, Side } from '@zzz-picker/constant'
import { usePlay, useStore } from '@zzz-picker/provider/hooks'
import { useMemo, useState } from 'react'
import { BossDialog } from '~/components'

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
      <button
        className={pipe(
          ['flex-1', 'aspect-[3/4]', 'group', 'focus:outline-none', 'cursor-pointer', 'relative'],
          concat(
            bossData ? ['bg-netural'] : ['items-center', 'justify-center', 'flex', 'bg-content']
          ),
          concat([
            'not-last:after:content-[""]',
            'not-last:after:block',
            'not-last:after:absolute',
            'not-last:after:w-1',
            'not-last:after:h-2/3',
            'not-last:after:bg-netural',
            'not-last:after:rounded-full',
            'not-last:after:right-0',
            'not-last:after:top-1/2',
            'not-last:after:-translate-y-1/2',
            'not-last:after:translate-x-1/2',
            'not-last:after:z-1',
          ]),
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
          <Icons.Plus className="stroke-ink block size-10 group-hover:stroke-primary" />
        )}
      </button>
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <BossDialog active={state[props.roundId][props.side].boss} onClick={onBossChange} />
      </Dialog>
    </>
  )
}

const Personal: React.FC<Props> = (props) => {
  return (
    <div className="w-full px-4">
      <div className="flex overflow-hidden rounded-bl-2xl rounded-tr-2xl">
        <BossButton roundId={props.roundId} side="A" />
        <BossButton roundId={props.roundId} side="B" />
      </div>
    </div>
  )
}

export default Personal
