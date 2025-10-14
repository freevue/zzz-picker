import { Plus } from '@/Icons'
import { BossDialog } from '@/components'
import { UI } from '@/components'
import { useAgents } from '@/hooks'
import { useState } from 'react'
import { createPortal } from 'react-dom'

const Boss: React.FC = () => {
  const { boss } = useAgents()
  const [selected, setSelected] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)

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
        <div>
          <button
            className="cursor-pointer focus:outline-none group flex gap-2 items-end"
            onClick={() => setIsOpen(true)}
          >
            <div className="h-44 w-36 overflow-hidden border-2 border-text-primary flex items-center justify-center group-hover:border-secondary">
              {selected !== null ? (
                <img
                  src={boss[selected].images.rectangle}
                  alt={boss[selected].name}
                  className="blick w-full"
                />
              ) : (
                <Plus className="stroke-text-primary size-14 group-hover:stroke-secondary" />
              )}
            </div>
            <p className="text-text-primary text-2xl font-semibold group-hover:text-secondary">
              {selected !== null ? boss[selected].name : ''}
            </p>
          </button>
        </div>
      </div>
      {isOpen &&
        createPortal(
          <BossDialog onChange={onBossClick} onClose={() => setIsOpen(false)} />,
          document.body
        )}
    </>
  )
}

export default Boss
