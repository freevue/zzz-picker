import { concat, join, map, pipe, toArray, zipWithIndex } from '@fxts/core'
import { Typo } from '@zzz-picker/components/v2'
import type { Boss } from '@zzz-picker/constant'
import { motion } from 'motion/react'

type Props = {
  list: (Pick<Boss, 'id' | 'nameKo'> | null)[]
  active?: number
  title?: string
  disabled?: boolean
  onSubmit?: (event: React.MouseEvent<HTMLButtonElement>) => void
  onSelect?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const BossSelector: React.FC<Props> = (props) => {
  return (
    <div className="size-full overflow-auto max-w-2xl mx-auto py-20">
      <Typo.Heading className="heading-4xl text-primary text-center break-keep">
        {props.title || 'Boss Select'}
      </Typo.Heading>
      <ul className="flex flex-wrap mt-8 gap-6 w-full justify-between">
        {pipe(
          props.list,
          zipWithIndex,
          map(([index, boss]) => (
            <motion.li
              key={index}
              className="mx-auto"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.2 }}
            >
              {boss === null ? null : (
                <button
                  aria-selected={props.active === index}
                  disabled={props.disabled}
                  className={pipe(
                    [
                      'w-52',
                      'aspect-[3/4]',
                      'group',
                      'block',
                      'focus:outline-none',
                      'cursor-pointer',
                      'group',
                    ],
                    join(' ')
                  )}
                  type="button"
                  value={boss.id}
                  onClick={props.onSelect}
                >
                  <div
                    className={pipe(
                      ['w-full', 'card', 'bg-netural', 'border-3', 'border-transparent'],
                      concat(['group-aria-selected:border-primary']),
                      join(' ')
                    )}
                  >
                    <img className="block w-full" src={`/images/boss/${boss.id}.webp`} alt="" />
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
              )}
            </motion.li>
          )),
          toArray
        )}
      </ul>
      {props.disabled || (
        <button
          className={pipe(
            [
              'card',
              'py-4',
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
          onClick={props.onSubmit}
          value={props.active}
          disabled={props.active === undefined}
          type="button"
        >
          선택 완료
        </button>
      )}
    </div>
  )
}

export default BossSelector
