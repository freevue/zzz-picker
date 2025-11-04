import { pipe, concat, join } from '@fxts/core'

type Props = {
  className?: string
  children: React.ReactNode
}

const Body: React.FC<Props> = (props) => {
  return (
    <p className={pipe(['text-ink'], concat([props.className || '']), join(' '))}>
      {props.children}
    </p>
  )
}

export default Body
