import { useScore } from '@/hooks'
import type { Side } from '@/types'
import { pipe, concat, join } from '@fxts/core'
import { useMemo } from 'react'

type Props = {
  className?: string
  round: string
  side: Side
}

const MAX_SCORE = 70_000
const Score: React.FC<Props> = (props) => {
  const { score, setScore } = useScore()
  const value = useMemo(() => {
    return score.get(props.round)?.[props.side]?.score || 0
  }, [score, props.round, props.side])

  const onScoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    pipe(
      Number(event.target.value),
      (value) => {
        if (value > MAX_SCORE) return MAX_SCORE
        if (value < 0) return 0

        return value
      },
      (value) => {
        setScore(props.round, props.side, value)
      }
    )
  }

  return (
    <div
      className={pipe(
        [
          'text-xl',
          'font-bold',
          'dark:text-text-primary',
          'flex',
          'items-center',
          'gap-2',
          'w-2/3',
        ],
        concat([props.className || '']),
        join(' ')
      )}
    >
      <label className="block w-full">
        <input
          placeholder="라운드 점수"
          className="border-2 w-full px-4 py-2 border-text-primary block focus:outline-none focus:border-secondary"
          type="number"
          name={`${props.round}-${props.side}-score`}
          onChange={onScoreChange}
          min={0}
          max={MAX_SCORE}
          value={value}
        />
      </label>
    </div>
  )
}

export default Score
