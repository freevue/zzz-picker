import Form from '.'
import { concat, join, pipe } from '@fxts/core'
import type { Side } from '@zzz-picker/constant'

type Props = {
  side: Side
} & Omit<React.ComponentProps<typeof Form.Input>, 'name'>

const Nickname: React.FC<Props> = (props) => {
  return (
    <Form.Input
      {...props}
      className={pipe(
        [],
        concat(
          props.side === 'A' ? ['rounded-bl-3xl', 'rounded-tr-3xl', '[&_input]:text-right'] : []
        ),
        concat(props.side === 'B' ? ['rounded-br-3xl', 'rounded-tl-3xl'] : []),
        concat([
          '[&_input]:text-4xl',
          '[&_input]:text-primary',
          '[&_input]:font-black',
          '[&_input]:px-5',
          '[&_input]:py-4',
          '[&_input]:placeholder:text-3xl',
          '[&_input]:placeholder:text-ink/50',
        ]),
        join(' ')
      )}
      name={`${props.side}-nickname`}
    />
  )
}

export default Nickname
