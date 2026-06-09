import { ComponentProps } from 'preact'

type Props = ComponentProps<'div'> & {
  children?: preact.ComponentChildren
  reverse?: boolean
  full?: boolean
  inverse?: boolean
}

const Card = (props: Props) => {
  const { children, className, reverse, full, inverse, ...rest } = props

  const classNames = ['card']
  if (reverse) classNames.push('reverse')
  if (full) classNames.push('full')
  if (inverse) classNames.push('inverse')
  if (typeof className === 'string') classNames.push(className)

  return (
    <div className={classNames.join(' ')} {...rest}>
      {children}
    </div>
  )
}

export default Card
