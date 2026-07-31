import { pipe, concat, join, max, min, map, toArray } from '@fxts/core'
import { useRef } from 'react'
import { useScore } from '~/hooks'
import { updateScore } from '~/lib/DB'
import type { PlayerRole } from '~/type'

type Props = {
  role: PlayerRole
  round: number
  id: string
}

const Score: React.FC<Props> = (props) => {
  const debounce = useRef<NodeJS.Timeout | null>(null)
  const { score, setState } = useScore()

  const onScoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debounce.current && clearTimeout(debounce.current)

    pipe(
      [0, Number(event.currentTarget.value)],
      max,
      (value) => [value, 65_000],
      min,
      (value) => {
        setState((prev) => {
          prev.score[props.round][props.role] = Number(value)

          return { ...prev }
        })

        return value
      }
    )

    debounce.current = setTimeout(async () => {
      await pipe(
        score,
        map((data) => data[props.role]),
        toArray,
        updateScore(props.id as string, props.role)
      )

      debounce.current = null
    }, 1000)
  }

  return (
    <div
      className={pipe(
        ['flex h-14 bg-accent rounded-2xl w-48'],
        concat(['flex', 'items-center', 'px-4', 'gap-2']),
        join(' ')
      )}
    >
      <input
        type="number"
        max={65000}
        min={0}
        value={Number(score[props.round][props.role])}
        onFocus={(event) => event.target.select()}
        onChange={onScoreChange}
        className={pipe(
          ['appearance-none', 'flex-1', 'w-20', 'h-full'],
          concat(['text-center', 'text-primary', 'text-2xl', 'ft-ria']),
          concat(['active:outline-0', 'focus:outline-0']),
          join(' ')
        )}
      />
      <span className="text-lg ft-pre font-bold">점</span>
    </div>
  )
}

export default Score
