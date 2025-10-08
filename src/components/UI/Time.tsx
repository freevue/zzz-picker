import { pipe, join } from '@fxts/core'

type Props = {
  defaultValue?: string
  className?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Time: React.FC<Props> = (props) => {
  return (
    <div className={pipe([props.className, 'flex', 'items-center', 'gap-4'], join(' '))}>
      <div className="flex items-center w-full border-2 border-gray-700 rounded-md overflow-hidden">
        <input
          type="text"
          className="w-full h-8 px-4 focus:outline-none dark:text-white dark:placeholder:text-gray-700 text-right"
          value={props.defaultValue}
          onChange={props.onChange}
        />
      </div>
      <p className="dark:text-white text-2xl font-bold">분</p>
      <div className="flex items-center w-full border-2 border-gray-700 rounded-md overflow-hidden">
        <input
          type="text"
          className="w-full h-8 px-4 focus:outline-none dark:text-white dark:placeholder:text-gray-700 text-right"
          value={props.defaultValue}
          onChange={props.onChange}
        />
      </div>
      <p className="dark:text-white text-2xl font-bold">초</p>
    </div>
  )
}

export default Time
