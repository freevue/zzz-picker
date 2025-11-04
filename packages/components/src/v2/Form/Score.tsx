type Props = {
  value?: string
  onChange?: (value: string) => void
}

const Score: React.FC<Props> = (props) => {
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange?.(event.target.value)
  }

  return (
    <div>
      <label>
        <input type="text" value={props.value} onChange={onChange} />
      </label>
    </div>
  )
}

export default Score
