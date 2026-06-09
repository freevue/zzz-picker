import { ComponentProps } from 'preact'

type Props = ComponentProps<'button'> & {
  children: preact.ComponentChildren
}

const Button = (props: Props) => {
  const { children, className, ...rest } = props
  const cls = className
    ? `cursor-pointer focus:outline-none ${className}`
    : 'cursor-pointer focus:outline-none'

  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  )
}

export default Button
