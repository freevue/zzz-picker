import { UI } from '@/components'
import { useAgents } from '@/hooks'
import { pipe, zipWithIndex, map, filter } from '@fxts/core'

type Props = {
  onChange: (event: React.MouseEvent<HTMLButtonElement>) => void
  onClose: () => void
}

const BossDialog: React.FC<Props> = (props) => {
  const { boss } = useAgents()

  return (
    <UI.Dialog onClose={props.onClose} className="bg-bg-content p-4 border-1 border-secondary">
      <UI.Typo.Heading primary>공용 무대</UI.Typo.Heading>
      <ul className="flex flex-wrap gap-4 mt-10">
        {pipe(
          boss,
          filter(({ isOpen }) => isOpen),
          zipWithIndex,
          map(([index, boss]) => (
            <li key={index}>
              <button
                className="cursor-pointer focus:outline-none group"
                value={index}
                type="button"
                onClick={props.onChange}
              >
                <div className="w-56 h-72 overflow-hidden border-2 border-text-primary flex items-center justify-center group-hover:border-secondary">
                  <img src={boss.images.rectangle} alt={boss.name} />
                </div>
                <p className="text-text-primary text-xl text-center font-bold group-hover:text-secondary">
                  {boss.name}
                </p>
              </button>
            </li>
          ))
        )}
      </ul>
      <div></div>
    </UI.Dialog>
  )
}

export default BossDialog
