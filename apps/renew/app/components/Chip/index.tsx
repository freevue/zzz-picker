import { pipe, concat, join } from '@fxts/core'

type Props = {
  className?: string
  children: React.ReactNode
}

const Chip: React.FC<Props> = (props) => {
  return (
    <div
      className={pipe(
        [
          'border',
          'border-solid',
          'border-chip',
          'bg-chip/30',
          'h-12',
          'py-2',
          'px-4',
          'flex-center',
          'ft-pre',
          'text-ink',
          'text-xl',
          'font-bold',
          props.className || '',
        ],
        concat([]),
        join(' ')
      )}
    >
      {props.children}
    </div>
  )
}

export default Chip
