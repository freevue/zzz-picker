import { Typo } from '@zzz-picker/components/v2'

type Props = {
  children: React.ReactNode
}

const Text: React.FC<Props> = (props) => {
  return <Typo.Body className="body-lg">{props.children}</Typo.Body>
}

export default Text
