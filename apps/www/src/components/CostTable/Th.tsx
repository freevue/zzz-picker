import { pipe, concat, join } from '@fxts/core'

type Props = {
  children: React.ReactNode
  className?: string
}

const Th: React.FC<Props> = (props) => {
  return (
    <th
      className={pipe(
        [
          'p-2',
          'text-center',
          'bg-table',
          'border-table',
          'border-b',
          'border-r',
          'text-lg',
          'font-bold',
          'text-foreground',
        ],
        concat([props.className || '']),
        join(' ')
      )}
    >
      {props.children}
    </th>
  )
}

export default Th
