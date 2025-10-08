import { useScore, usePick, useSetting } from '@/hooks'
import type { Side } from '@/types'
import { pipe, join, concat } from '@fxts/core'
import { useEffect, useState } from 'react'

type Props = {
  side: Side
}

const TotalScore: React.FC<Props> = (props) => {
  const { totalCost: settingTotalCost } = useSetting()
  const { totalScore } = useScore()
  const { totalCost } = usePick()

  const [score, setScore] = useState(0)

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScore(Number(event.target.value))
  }

  useEffect(() => {
    setScore(() => {
      return Math.ceil(
        totalScore[props.side] * (1 + 2 * (1 - totalCost[props.side] / settingTotalCost))
      )
    })
  }, [totalScore, settingTotalCost, totalCost, props.side])

  return (
    <div className="flex-3/4 border-b-4 border-primary p-2">
      <label className="block w-full">
        <input
          type="number"
          placeholder="총 점수를 입력해주세요."
          value={score}
          onChange={onChange}
          className={pipe(
            [
              'dark:placeholder:text-white/50',
              'focus:outline-none',
              'placeholder:text-xl',
              'placeholder:font-medium',
              'text-primary',
              'text-3xl',
              'font-semibold',
              'block',
              'w-full',
            ],
            concat(props.side === 'A' ? ['text-right'] : []),
            join(' ')
          )}
        />
      </label>
    </div>
  )
}

export default TotalScore
