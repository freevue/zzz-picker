import { Plus } from '@/Icons'
import { UI } from '@/components'
import { useAgents } from '@/hooks'
import { map, pipe, zipWithIndex } from '@fxts/core'
import { useState } from 'react'

const Boss: React.FC = () => {
  const { boss } = useAgents()
  const [selected, setSelected] = useState<number | null>(1)

  return (
    <>
      <div className="p-4">
        <UI.Typo.Heading primary className="mb-4 flex items-center gap-4">
          공용 무대
        </UI.Typo.Heading>
        <div>
          <button className="h-36 overflow-hidden w-28 cursor-pointer focus:outline-none group border border-text-primary flex items-center justify-center">
            {selected ? (
              <img src={boss[selected].images.rectangle} alt={boss[selected].name} />
            ) : (
              <Plus className="stroke-text-primary size-14 group-hover:stroke-secondary" />
            )}
          </button>
        </div>
      </div>
      <UI.Dialog>
        <ul>
          {pipe(
            boss,
            zipWithIndex,
            map(([index, boss]) => (
              <li key={index}>
                <img src={boss.images.rectangle} alt={boss.name} />
              </li>
            ))
          )}
        </ul>
      </UI.Dialog>
    </>
  )
}

export default Boss
