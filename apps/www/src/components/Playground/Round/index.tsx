import Pick from './Pick'
import { Plus } from '@/Icons'
import { UI, BossDialog } from '@/components'
import { usePlay, useAgents } from '@/hooks'
import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

type Props = {
  children: React.ReactNode
  round: string
}

const Round: React.FC<Props> = (props) => {
  const { pickList } = usePlay()
  const { boss } = useAgents()
  const [isOpen, setIsOpen] = useState(false)
  const [bossIndex, setBossIndex] = useState<number | null>(null)
  const bossValue = useMemo(() => {
    if (bossIndex === null) return null
    return boss[bossIndex]
  }, [bossIndex, boss])

  const onBossClick = () => {
    setIsOpen(true)
  }
  const onBossChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    setBossIndex(Number(event.currentTarget.value))
    setIsOpen(false)
  }

  return (
    <>
      <div className="w-full">
        <UI.Typo.Heading className="text-2xl font-bold dark:text-text-primary text-center">
          {props.children}
        </UI.Typo.Heading>
        <div className="flex justify-between items-center">
          <Pick side="A" round={props.round} pickList={pickList.get(props.round)!} />
          <div className="flex items-center">
            <button
              className="h-22 overflow-hidden w-18 border-2 items-center justify-center border-text-primary hover:border-secondary flex cursor-pointer focus:outline-none group"
              type="button"
              onClick={onBossClick}
            >
              {bossValue !== null ? (
                <img
                  className="block w-full"
                  src={bossValue.images.rectangle}
                  alt={bossValue.name}
                />
              ) : (
                <Plus className="stroke-white block size-10 group-hover:stroke-secondary" />
              )}
            </button>
          </div>
          <Pick side="B" round={props.round} pickList={pickList.get(props.round)!} />
        </div>
      </div>
      {isOpen &&
        createPortal(
          <BossDialog onChange={onBossChange} onClose={() => setIsOpen(false)} />,
          document.body
        )}
    </>
  )
}

export default Round
