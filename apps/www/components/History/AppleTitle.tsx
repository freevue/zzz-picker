import AppleWrap from './AppleWrap'
import { join, pipe } from '@fxts/core'
import { Typo } from '@zzz-picker/components/v2'

type Props = {
  title: string
}

const AppleTitle: React.FC<Props> = (props) => {
  return (
    <AppleWrap>
      <Typo.Heading className={pipe(['heading-huge', 'text-primary'], join(' '))}>
        {props.title}
      </Typo.Heading>
    </AppleWrap>
  )
}

export default AppleTitle
