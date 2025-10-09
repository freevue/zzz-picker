import type { Props as BaseProps } from '.'
import { pipe, concat, join } from '@fxts/core'

type Props = {
  primary?: boolean
} & BaseProps

const Heading: React.FC<Props> = (props) => {
  return (
    <h1
      className={pipe(
        ['text-3xl font-black'],
        concat(props.primary ? ['text-primary'] : ['dark:text-white']),
        concat([props.className || '']),
        join(' ')
      )}
    >
      {props.children}
    </h1>
  )
}

export default Heading
