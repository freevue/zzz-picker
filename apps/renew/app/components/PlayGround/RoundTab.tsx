import { map, pipe, toArray, join, concat, find } from '@fxts/core'

type Props = {
  list: Array<number>
  acitve: number
  onChange: (value: number) => void
}

const RoundTab: React.FC<Props> = (props) => {
  const onRoundClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    props.onChange(Number(event.currentTarget.value))
  }

  return (
    <ul className="flex max-w-lg mx-auto rounded-full ft-ria overflow-hidden bg-accent h-12 text-lg">
      {pipe(
        props.list,
        map((round) => (
          <li className="flex-1" key={round}>
            <button
              className={pipe(
                ['w-full', 'h-full', 'cursor-pointer'],
                concat(props.acitve === round ? ['bg-primary', 'text-accent'] : []),
                join(' ')
              )}
              onClick={onRoundClick}
              value={round}
              type="button"
            >
              {round + 1} 라운드
            </button>
          </li>
        )),
        toArray
      )}
    </ul>
  )
}

export default RoundTab
