import { usePlay } from '@/hooks'
import { pipe, concat, join } from '@fxts/core'
import type { RoundId, Side } from '@zzz-picker/constant'
import { useMemo } from 'react'

type Props = {
  roundId: RoundId
  side: Side
}

const MAX_SCORE = 70_000
const Score: React.FC<Props> = (props) => {
  const { state, setState } = usePlay()
  const value = useMemo(() => {
    return Number(state[props.roundId][props.side].result || 0)
  }, [state, props.roundId, props.side])

  const onScoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    pipe(
      Number(event.target.value),
      (value) => {
        if (value > MAX_SCORE) return MAX_SCORE
        if (value < 0) return 0

        return value
      },
      (value) => {
        // setRoundResultScore(props.roundId, props.side, value)
      }
    )
  }
  const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select()
  }
  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.value = `${Number(event.target.value)}`
  }

  return (
    <label
      className={pipe(
        ['block', 'w-60'],
        concat([props.side === 'A' ? 'ml-auto' : 'mr-auto']),
        join(' ')
      )}
    >
      <input
        placeholder="라운드 점수"
        className={pipe(
          [
            'border-2',
            'w-full',
            'px-4',
            'py-2',
            'border-foreground',
            'text-foreground',
            'block',
            'font-extrabold',
            'text-xl',
            'focus:outline-none',
            'focus:border-secondary',
          ],
          concat(
            props.side === 'A' ? ['text-right', 'rounded-bl-2xl'] : ['text-left', 'rounded-br-2xl']
          ),
          join(' ')
        )}
        onWheel={(event) => event.currentTarget.blur()}
        type="number"
        step="1"
        name={`${props.roundId}-${props.side}-score`}
        onChange={onScoreChange}
        onFocus={onFocus}
        onBlur={onBlur}
        min={0}
        max={MAX_SCORE}
        value={value}
      />
    </label>
  )
}

export default Score
