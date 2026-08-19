import { join, pipe, concat, map, toArray } from '@fxts/core'

type Props = {
  list: Array<{
    label: string
    value: string
  }>
  acitve: string
  onChange: (value: string) => void
}

const RarityTab: React.FC<Props> = (props) => {
  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    props.onChange(event.currentTarget.value)
  }

  return (
    <ul
      className={pipe(
        [
          'flex',
          'max-w-lg',
          'mx-auto',
          'rounded-full',
          'ft-ria',
          'overflow-hidden',
          'h-12',
          'text-lg',
          'z-10',
          'w-full',
        ],
        concat(['sticky', 'top-4']),
        join(' ')
      )}
    >
      {pipe(
        props.list,
        map((rarity) => (
          <li className="flex-1 bg-accent" key={rarity.value}>
            <button
              onClick={onClick}
              value={rarity.value}
              className={pipe(
                ['w-full', 'h-full', 'cursor-pointer'],
                concat(props.acitve === rarity.value ? ['bg-primary', 'text-accent'] : []),
                join(' ')
              )}
            >
              {rarity.label}
            </button>
          </li>
        )),
        toArray
      )}
    </ul>
  )
}

export default RarityTab
