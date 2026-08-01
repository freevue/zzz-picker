import { join, pipe } from '@fxts/core'

type Props = React.HTMLAttributes<HTMLDivElement>

const Card: React.FC<Props> = (props) => {
  const className = pipe(['bg-accent p-4 rounded-2xl'], join(' '))

  return <div {...props} className={className} />
}

export default Card
