import { concat, join, map, pipe, toArray } from '@fxts/core'
import { Button } from '@zzz-picker/components'

type Props = {
  onChange: (value: 'S' | 'A') => void
  value: 'S' | 'A'
  className?: string
}

const Tabs: React.FC<Props> = (props) => {
  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    props.onChange(event.currentTarget.value as 'S' | 'A')
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
                    ? ['bg-primary']
                    : ['dark:text-gray-50', 'dark:bg-gray-600/70', 'dark:hover:bg-gray-600']
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
