import Button from './Button'
import { pipe, concat, join, map, toArray, zipWithIndex } from '@fxts/core'

type Props = {
  value: (number | null)[]
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  onClick?: (index: number) => void
}

const Party: React.FC<Props> = (props) => {
  const onClick = (index: number) => () => {
    props.onClick?.(index)
  }

  return (
    <div className={pipe(['flex'], concat([props.className || '']), join(' '))}>
      {pipe(
        props.value,
        zipWithIndex,
        map(([index, agentId]) => <Button size={props.size} id={agentId} key={index} />),
        toArray
      )}
    </div>
  )
}

export default Party
