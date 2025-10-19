import { UI } from '@/components'
import { useStore } from '@/hooks'
import { pipe, zipWithIndex, map, filter, toArray } from '@fxts/core'
import { Button } from '@zzz-picker/components'

type Props = {
  onChange: (event: React.MouseEvent<HTMLButtonElement>) => void
  onClose: () => void
}

const BossDialog: React.FC<Props> = (props) => {
  const { deadlyAssault } = useStore()

  return (
    <UI.Dialog onClose={props.onClose} className="bg-bg-content p-4 border-1 border-secondary">
      <UI.Typo.Heading primary>Boss</UI.Typo.Heading>
      <ul className="flex flex-wrap gap-4 mt-10">
        {pipe(
          deadlyAssault || [],
          map((boss) => (
            <li key={boss.bossId}>
              <Button type="button" value={boss.bossId}>
                <img src={`/boss/${boss.image}`} alt={boss.fullNameEn} />
              </Button>
              {/* <button
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
              </button> */}
            </li>
          )),
          toArray
        )}
      </ul>
      <div></div>
    </UI.Dialog>
  )
}

export default BossDialog
