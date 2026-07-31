import { pipe, concat, join, max, min, map, fromEntries } from '@fxts/core'
import { useRef } from 'react'
import { BroadcastEvent } from '~/constant'
import { useMatch } from '~/hooks'
import { updateScore } from '~/lib/DB'
import type { Player, PlayerRole } from '~/type'

type Props = {
  role: PlayerRole
  round: number
  id: string
}

const Score: React.FC<Props> = (props) => {
  const debounce = useRef<NodeJS.Timeout | null>(null)
  const { play, send } = useMatch()

  const onScoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debounce.current && clearTimeout(debounce.current)

    const value = pipe([0, Number(event.currentTarget.value)], max, (value) => [value, 65_000], min)
    const score = pipe(
      play[props.role].score,
      (list) => {
        list[props.round] = value

        return list
      },
      (score) => {
        send(BroadcastEvent.SCORE, {
          ...play,
          [props.role]: { ...play[props.role], score },
        })

        return score
      }
    )

    debounce.current = setTimeout(async () => {
      send(
        BroadcastEvent.SCORE,
        await pipe(
          score,
          updateScore(play[props.role].id),
          map((play) => [play.role, play] as [PlayerRole, Player]),
          fromEntries
        )
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
        value={Number(play[props.role].score[props.round])}
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
