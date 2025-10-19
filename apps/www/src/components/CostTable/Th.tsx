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
          'bg-gray-600',
          'border-gray-600',
          'border-b',
          'border-r',
          'text-lg',
          'font-bold',
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
