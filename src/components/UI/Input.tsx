type Props = {
  name?: string
  defaultValue?: string
  className?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Input: React.FC<Props> = (props) => {
  return (
    <div
      className={`flex items-center w-full border-2 border-gray-700 rounded-md overflow-hidden ${props.className || ''}`}
    >
      <input
        name={props.name}
        type="text"
        className="w-full h-8 px-4 focus:outline-none dark:text-white dark:placeholder:text-gray-700"
        value={props.defaultValue}
        onChange={props.onChange}
      />
    </div>
  )
}

export default Input
