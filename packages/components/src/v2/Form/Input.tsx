import { concat, join, pipe } from '@fxts/core'

type Props = {
  value?: string
  placeholder?: string
  onChange?: (value: string) => void
}

const Input: React.FC<Props> = (props) => {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange?.(event.target.value)
  }

  return (
    <div>
      <label>
        <input
          className={pipe([], concat(['focus:outline-none']), join(' '))}
          type="text"
          value={props.value}
          onChange={onChange}
          placeholder={props.placeholder}
        />
      </label>
    </div>
  )
}

export default Input
