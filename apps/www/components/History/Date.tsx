import Wrap from './Wrap'
import { concat, join, pipe } from '@fxts/core'
import { Typo } from '@zzz-picker/components/v2'

type Props = {
  date: string
}

const Date: React.FC<Props> = (props) => {
  return (
    <Wrap>
      <div
        className={pipe(
          ['transition-opacity duration-300'],
          concat(['group-[.active]:opacity-100', 'opacity-0']),
          join(' ')
        )}
      >
        <Typo.Heading className={pipe(['heading-huge', 'text-primary'], join(' '))}>
          {props.date}
        </Typo.Heading>
        <Typo.Body className="heading-6xl text-ink">진행되었으며,</Typo.Body>
      </div>
    </Wrap>
  )
}

export default Date
