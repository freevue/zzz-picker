import { pipe, join, concat } from '@fxts/core'

type Props = {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  children: React.ReactNode
  className?: string
  disabled?: boolean
  value?: string | number
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type']
}

const Button: React.FC<Props> = (props) => {
  return (
    <button
      className={pipe(
        ['active:outline-none cursor-pointer'],
        concat([
          'disabled:grayscale-75',
          'disabled:cursor-not-allowed',
          'dark:disabled:text-gray-500',
        ]),
        concat(props.className ? [props.className] : []),
        join(' ')
      )}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
      value={props.value}
    >
      {props.children}
    </button>
  )
}

export default Button
