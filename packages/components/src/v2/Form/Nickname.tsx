import Form from '.'
import { concat, join, pipe } from '@fxts/core'
import type { Side } from '@zzz-picker/constant'

type Props = {
  side: Side
  name?: string
} & Omit<React.ComponentProps<typeof Form.Input>, 'name' | 'type'>

const Nickname: React.FC<Props> = (props) => {
  return (
    <Form.Input
      {...props}
      type="text"
      className={pipe(
        ['card-2'],
        concat(props.side === 'A' ? ['[&_input]:text-right'] : []),
        concat(props.side === 'B' ? ['reverse'] : []),
        concat([
          '[&_input]:text-4xl',
          '[&_input]:text-primary',
          '[&_input]:font-black',
          '[&_input]:w-full',
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
