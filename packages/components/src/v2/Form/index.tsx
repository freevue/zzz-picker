import Input from './Input'
import Nickname from './Nickname'
import Party from './Party'
import Time from './Time'
import { pipe, concat, join } from '@fxts/core'

type Props = {
  className?: string
  children: React.ReactNode
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}
type FormType = {
  Party: typeof Party
  Input: typeof Input
  Time: typeof Time
  Nickname: typeof Nickname
} & React.FC<Props>

const Form: FormType = (props) => {
  return (
    <form
      className={pipe(['block'], concat([props.className || '']), join(' '))}
      onSubmit={props.onSubmit}
    >
      {props.children}
    </form>
  )
}

Form.Party = Party
Form.Input = Input
Form.Time = Time
Form.Nickname = Nickname

export default Form
