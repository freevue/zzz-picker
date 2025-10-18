import Input from './Input'
import { pipe, join } from '@fxts/core'

type Props = {
  name?: string
  defaultValue?: string
  className?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Time: React.FC<Props> = (props) => {
  return (
    <div className={pipe([props.className, 'flex', 'items-center', 'gap-4'], join(' '))}>
      <div className="flex gap-2 items-center">
        <Input className="[&_input]:text-right" type="number" name={`${props.name}-minute`} />
        <p className="dark:text-white text-2xl font-bold">분</p>
      </div>
      <div className="flex gap-2 items-center">
        <Input className="[&_input]:text-right" type="number" name={`${props.name}-second`} />
        <p className="dark:text-white text-2xl font-bold">초</p>
      </div>
    </div>
  )
}

export default Time
