import { concat, join, map, pipe, toArray } from '@fxts/core'
import { Button } from '@zzz-picker/components'
import type { Rarity } from '@zzz-picker/constant'

type Props = {
  onChange: (value: Rarity) => void
  value: Rarity
  className?: string
}

const Tabs: React.FC<Props> = (props) => {
  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    props.onChange(event.currentTarget.value as Rarity)
  }

  return (
    <ul
      className={pipe(
        ['flex', 'rounded-lg', 'overflow-hidden'],
        concat(props.className ? [props.className] : []),
        join(' ')
      )}
    >
      {pipe(
        ['S', 'A'],
        map((item) => (
          <li key={item} className="flex-1">
            <Button
              className={pipe(
                ['w-full', 'py-1', 'font-extrabold', 'text-lg'],
                concat(
                  props.value === item
                    ? ['bg-primary', 'text-base']
                    : ['text-foreground', 'bg-panel', 'hover:text-secondary']
                ),
                join(' ')
              )}
              type="button"
              onClick={onClick}
              value={item}
            >
              {item}
            </Button>
          </li>
        )),
        toArray
      )}
    </ul>
  )
}

export default Tabs
