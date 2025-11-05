import { Card } from './'
import { Typo } from '@zzz-picker/components/v2'

type Props = {
  children: React.ReactNode
  title: string
}

const Wrapper: React.FC<Props> = (props) => {
  return (
    <div>
      <Typo.Heading className="heading-xl text-netural mb-1">{props.title}</Typo.Heading>
      <Card>{props.children}</Card>
    </div>
  )
}

export default Wrapper
