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
          'bg-table-bg-highlight',
          'border-table-bg-highlight',
          'border-b',
          'border-r',
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
