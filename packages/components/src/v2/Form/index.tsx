import Input from './Input'
import Party from './Party'
import { pipe, concat, join } from '@fxts/core'

type Props = {
  className?: string
  children: React.ReactNode
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}
type FormType = {
  Party: typeof Party
  Input: typeof Input
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

export default Form
