import { useRoundedSize } from '../..'
import Button from './Button'
import { pipe, concat, join, map, toArray, zipWithIndex, findIndex } from '@fxts/core'

type Props = {
  value: (number | null)[]
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  deleteable?: boolean
  onChange?: (value: (number | null)[]) => void
}

const Party: React.FC<Props> = (props) => {
  const size = useRoundedSize(props.size)

  const onClick = (index: number) => (agentId: number) => {
    pipe(
      [...props.value],
      (list) => {
        const currentIndex = findIndex((id) => id === agentId, list)

        list[index] = agentId
        list[currentIndex] = null

        return list
      },
      (list) => props.onChange?.(list)
    )
  }
  const onDelete = (index: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    pipe(
      [...props.value],
      (list) => {
        list[index] = null

        return list
      },
      (list) => props.onChange?.(list)
    )
  }

  return (
    <div
      className={pipe(
        ['flex', 'w-auto!', 'overflow-hidden', size],
        concat([props.className || '']),
        join(' ')
      )}
    >
      {pipe(
        props.value,
        zipWithIndex,
        map(([index, agentId]) => (
          <Button
            onClick={onClick(index)}
            onDelete={onDelete(index)}
            size={props.size}
            id={agentId}
            key={index}
            deleteable={props.deleteable}
          />
        )),
        toArray
      )}
    </div>
  )
}

export default Party
