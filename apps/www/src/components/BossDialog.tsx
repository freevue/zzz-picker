import { UI } from '@/components'
import { useStore } from '@/hooks'
import { pipe, map, toArray, concat, join } from '@fxts/core'
import { Button } from '@zzz-picker/components'

type Props = {
  active: number | null
  onChange: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const BossDialog: React.FC<Props> = (props) => {
  const { deadlyAssault } = useStore()

  return (
    <div className="w-2xl">
      <UI.Typo.Heading primary>Boss</UI.Typo.Heading>
      <ul className="flex flex-wrap mt-8 w-full gap-8">
        {pipe(
          deadlyAssault || [],
          map((boss) => (
            <li key={boss.bossId} className="flex-1">
              <Button
                className="w-full group"
                type="button"
                value={boss.bossId}
                onClick={props.onChange}
              >
                <img
                  className={pipe(
                    ['overflow-hidden', 'rounded-bl-2xl', 'rounded-tr-2xl', 'border-2'],
                    concat(
                      props.active === boss.bossId
                        ? ['border-primary']
                        : ['border-gray-50', 'hover:border-secondary']
                    ),
                    join(' ')
                  )}
                  src={`/boss/${boss.image}`}
                  alt={boss.fullNameEn}
                />
                <span className="text-gray-50 text-lg font-extrabold mt-4 block w-full text-center group-hover:text-secondary">
                  {boss.fullNameKo || boss.fullNameEn}
                </span>
              </Button>
            </li>
          )),
          toArray
        )}
      </ul>
    </div>
  )
}

export default BossDialog
