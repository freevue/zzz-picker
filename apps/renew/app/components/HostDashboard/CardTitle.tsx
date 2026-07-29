import { concat, join, pipe } from '@fxts/core'

type Props = {
  children: React.ReactNode
  className?: string
  active?: boolean
}

const CardTitle: React.FC<Props> = (props) => {
  return (
    <h2
      className={pipe(
        ['ft-ria text-primary text-4xl mb-4', props.className || ''],
        concat(props.active ? ['text-secondary'] : []),
        join(' ')
      )}
    >
      {props.children}
    </h2>
  )
}

export default CardTitle
