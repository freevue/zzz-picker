import Wrap from './Wrap'
import { concat, join, pipe } from '@fxts/core'
import { Typo } from '@zzz-picker/components/v2'

type Props = {
  title: string
}

const Title: React.FC<Props> = (props) => {
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
          {props.title}
        </Typo.Heading>
      </div>
    </Wrap>
  )
}

export default Title
