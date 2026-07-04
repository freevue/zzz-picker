import { pipe, concat, join, includes } from '@fxts/core'
import { Typo, Dialog } from '@zzz-picker/components/v2'
import type { BossId, Boss } from '@zzz-picker/constant'

type Props = {
  isOpen: boolean
  onClose: () => void
  bossList: Pick<Boss, 'id' | 'nameKo' | 'images'>[]
  currentBoss: BossId | null
  selectedBossIds: (BossId | null)[]
  onSelect: (bossId: BossId) => void
  onSubmit: () => void
}

const BossSelectDialog: React.FC<Props> = ({
  isOpen,
  onClose,
  bossList,
  currentBoss,
  selectedBossIds,
  onSelect,
  onSubmit,
}) => {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-2xl mx-auto py-8">
        <Typo.Heading className="heading-4xl text-primary text-center break-keep">
          Boss Select
        </Typo.Heading>
        <ul className="flex flex-wrap mt-8 gap-6 w-full justify-center">
          {bossList.map((boss) => (
            <li key={boss.id} className="mx-auto">
              <button
                aria-selected={currentBoss === boss.id}
                disabled={includes(boss.id, selectedBossIds)}
                className={pipe(
                  [
                    'w-36',
                    'sm:w-52',
                    'aspect-[3/4]',
                    'group',
                    'block',
                    'focus:outline-none',
                    'cursor-pointer',
                  ],
                  concat(['disabled:opacity-40', 'disabled:cursor-not-allowed']),
                  join(' ')
                )}
                type="button"
                value={boss.id}
                onClick={(e) => {
                  onSelect(Number(e.currentTarget.value))
                }}
              >
                <div
                  className={pipe(
                    ['w-full', 'card', 'bg-netural', 'border-3', 'border-transparent'],
                    concat(['group-aria-selected:border-primary']),
                    join(' ')
                  )}
                >
                  <img className="block w-full" src={boss.images.src} alt="" />
                </div>
                <span
                  className={pipe(
                    [
                      'text-ink',
                      'heading-lg',
                      'mt-4',
                      'block',
                      'w-full',
                      'text-center',
                      'group-hover:text-primary',
                      'break-keep',
                    ],
                    concat(['group-aria-selected:text-primary']),
                    join(' ')
                  )}
                >
                  {boss.nameKo}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <button
          className={pipe(
            [
              'card',
              'py-2',
              'heading-xl',
              'w-full',
              'block',
              'full',
              'mt-8',
              'bg-primary',
              'text-ink',
              'max-w-xs',
              'mx-auto',
              'cursor-pointer',
            ],
            concat(['disabled:opacity-50', 'disabled:cursor-not-allowed', 'disabled:bg-content']),
            join(' ')
          )}
          onClick={onSubmit}
          disabled={currentBoss === null}
          type="button"
        >
          선택 완료
        </button>
      </div>
    </Dialog>
  )
}

export default BossSelectDialog
