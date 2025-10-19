import { UI } from '@/components'
import { usePlay2, useSetting2 } from '@/hooks'
import { pipe, join, concat, map, sum } from '@fxts/core'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect, useMemo } from 'react'

type Props = {}

const Record: React.FC<{ value: number; className?: string }> = (props) => {
  const count = useMotionValue(100)
  const rounded = useTransform(() => Math.round(count.get()))

  useEffect(() => {
    const controls = animate(count, props.value, { duration: 1 })

    return () => controls.stop()
  }, [props.value])

  return (
    <motion.p
      className={pipe(
        ['dark:text-text-primary', 'text-3xl', 'font-black', 'flex-1'],
        concat([props.className || '']),
        join(' ')
      )}
    >
      {rounded}
    </motion.p>
  )
}
const TotalScore: React.FC<Props> = () => {
  const { costTable, setting } = useSetting2()
  const { round } = usePlay2()
  const totalCost = useMemo(() => {
    return {
      A: 0,
      B: 0,
    }
  }, [round])
  const costBonusRate = useMemo(() => {
    return {
      A: 0,
      B: 0,
    }
  }, [round])
  const roundTotalScore = useMemo(() => {
    return {
      A: pipe(
        round,
        map(([, round]) => round.A.result.score),
        sum
      ),
      B: pipe(
        round,
        map(([, round]) => round.B.result.score),
        sum
      ),
    }
  }, [round])
  const roundTotalTime = useMemo(() => {
    return {
      A: pipe(
        round,
        map(([, round]) => round.A.result.timer || 180),
        sum,
        (value) => 360 - value
      ),
      B: pipe(
        round,
        map(([, round]) => round.B.result.timer || 180),
        sum,
        (value) => 360 - value
      ),
    }
  }, [round])
  const totalScore = useMemo(() => {
    return {
      A: roundTotalScore.A + roundTotalTime.A * 333,
      B: roundTotalScore.B + roundTotalTime.B * 333,
    }
  }, [roundTotalScore, roundTotalTime])

  return (
    <div>
      <UI.Typo.Heading className="text-center" primary>
        결과
      </UI.Typo.Heading>
      <div className="flex flex-col gap-4 mt-8">
        <div className="flex items-center justify-between">
          <Record
            className={pipe(
              ['text-right'],
              concat(totalCost.A > setting.totalCost ? ['text-red-500!'] : []),
              join(' ')
            )}
            value={totalCost.A}
          />
          <UI.Typo.Heading className="w-1/3 text-xl text-center">총 사용 Cost</UI.Typo.Heading>
          <Record
            className={pipe(
              ['text-left'],
              concat(totalCost.B > setting.totalCost ? ['text-red-500!'] : []),
              join(' ')
            )}
            value={totalCost.B}
          />
        </div>
        <div className="flex items-center justify-between">
          <Record className="text-right" value={roundTotalScore.A} />
          <UI.Typo.Heading className="w-1/3 text-xl text-center">라운드 점수 합산</UI.Typo.Heading>
          <Record className="text-left" value={roundTotalScore.B} />
        </div>
        <div className="flex items-center justify-between">
          <Record className="text-right" value={roundTotalTime.A * 333} />
          <UI.Typo.Heading className="w-1/3 text-xl text-center">시간 보너스</UI.Typo.Heading>
          <Record className="text-left" value={roundTotalTime.B * 333} />
        </div>
        <div className="flex items-center justify-between">
          <Record className="text-right" value={Math.round(costBonusRate.A * 100)} />
          <UI.Typo.Heading className="w-1/3 text-xl text-center">Cost 보너스 배율</UI.Typo.Heading>
          <Record className="text-left" value={Math.round(costBonusRate.B * 100)} />
        </div>
        <div className="flex items-center justify-between mt-4">
          <UI.Typo.Heading className="flex-1 text-right" primary>
            <Record value={Math.round(totalScore.A + totalScore.A * costBonusRate.A)} />
          </UI.Typo.Heading>
          <UI.Typo.Heading className="w-1/3 text-center">총 점수</UI.Typo.Heading>
          <UI.Typo.Heading className="flex-1 text-left" primary>
            {Math.round(totalScore.B + totalScore.B * costBonusRate.B)}
          </UI.Typo.Heading>
        </div>
      </div>
    </div>
  )
}

export default TotalScore
