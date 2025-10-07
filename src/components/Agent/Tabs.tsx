import { concat, join, map, pipe, toArray } from '@fxts/core'

type Props = {
  onChange: (value: 'S' | 'A') => void
  value: 'S' | 'A'
}

const Tabs: React.FC<Props> = (props) => {
  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    props.onChange(event.currentTarget.value as 'S' | 'A')
  }

  return (
    <ul className="flex gap-2 w-full">
      {pipe(
        ['S', 'A'],
        map((item) => (
          <li
            key={item}
            className={pipe(
              ['flex-1', 'py-1', 'rounded-sm'],
              concat(
                props.value === item
                  ? ['bg-primary', 'text-black']
                  : ['dark:text-white', 'dark:bg-gray-700']
              ),
              join(' ')
            )}
          >
            <button
              className="active:outline-none block cursor-pointer text-center w-full text-md font-black italic opacity-90"
              type="button"
              onClick={onClick}
              value={item}
            >
              {item}
            </button>
          </li>
        )),
        toArray
      )}
    </ul>
  )
}

export default Tabs
