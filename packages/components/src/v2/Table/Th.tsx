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
          'bg-secondary',
          'border-secondary',
          'border-b',
          'border-r',
          'heading-lg',
          'text-ink',
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
