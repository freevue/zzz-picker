import { pipe, concat, join, map, toArray, isString } from '@fxts/core'

type Tab = {
  value: string | number
  label: string
}
type Props = {
  list: (Tab | string)[]
  value?: string
  defaultValue?: string
  name?: string
  onChange?: (value: string) => void
  className?: string
}

const Tabs: React.FC<Props> = (props) => {
  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    props.onChange?.(event.currentTarget.value)
  }

  return (
    <div
      className={pipe(
        ['flex', 'overflow-hidden', 'card-3', 'full', 'bg-base/70', 'flex-wrap'],
        concat([props.className || '']),
        join(' ')
      )}
    >
      {pipe(
        props.list,
        map((tab) => (isString(tab) ? { value: tab, label: tab } : tab)),
        map((tab) => (
          <button
            key={tab.value}
            onClick={onClick}
            value={tab.value}
            className={pipe(
              [
                'h-11',
                'focus:outline-none',
                'flex-1',
                'px-4',
                'min-w-fit',
                'cursor-pointer',
                'flex',
                'items-center',
                'justify-center',
              ],
              concat(props.value === tab.value ? ['bg-primary', 'text-content'] : ['text-ink']),
              join(' ')
            )}
            type="button"
          >
            <span className="heading-lg">{tab.label}</span>
          </button>
        )),
        toArray
      )}
      {props.name && (
        <input type="hidden" name={props.name} value={props.defaultValue || props.value || ''} />
      )}
    </div>
  )
}

export default Tabs
