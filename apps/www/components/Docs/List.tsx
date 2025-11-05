import { pipe, toArray, map, zipWithIndex, concat, join } from '@fxts/core'

type Props = {
  list: React.ReactNode[]
  className?: string
}

const List: React.FC<Props> = (props) => {
  return (
    <ul
      className={pipe(
        ['px-4', 'flex', 'flex-col', 'gap-2', 'text-ink', 'text-lg'],
        concat([props.className || '']),
        join(' ')
      )}
    >
      {pipe(
        props.list,
        zipWithIndex,
        map(([index, item]) => <li key={index}>{item}</li>),
        toArray
      )}
    </ul>
  )
}

export default List
