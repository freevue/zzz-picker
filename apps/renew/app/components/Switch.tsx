type Props = {}

const Switch: React.FC<Props> = (props) => {
  return (
    <div>
      <label>
        <input type="checkbox" className="appearance-none hidden" />
      </label>
    </div>
  )
}

export default Switch
