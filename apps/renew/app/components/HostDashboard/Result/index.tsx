import Row from './Row'
import { calcTimeScore, calcCostBonuse } from '@/lib/utils'
import { map, pipe, toArray, zipWithIndex } from '@fxts/core'
import { useMemo } from 'react'
import { Role } from '~/constant'
import { useScore, useCost } from '~/hooks'
import type { PlayerRole } from '~/type'

const Round: React.FC<{ round: number }> = (props) => {
  const { time, score } = useScore()
  const cost = useCost(props.round)

  return (
    <div className="w-full flex-1 flex flex-col">
      <h2 className="text-center text-primary ft-ria text-3xl mb-4">{props.round + 1} Round</h2>
      <Row
        title="사용 Cost"
        value={[
          cost[Role.A_SIDE].agentCost + cost[Role.A_SIDE].engineCost,
          cost[Role.B_SIDE].agentCost + cost[Role.B_SIDE].engineCost,
        ]}
      />
      <Row
        title="시간 보너스"
        value={[
          calcTimeScore(time[props.round][Role.A_SIDE]),
          calcTimeScore(time[props.round][Role.B_SIDE]),
        ]}
      />
      <Row
        title="Round 점수"
        value={[score[props.round][Role.A_SIDE], score[props.round][Role.B_SIDE]]}
      />
    </div>
  )
}
const Result: React.FC = () => {
  const { time, score } = useScore()
  const round1Cost = useCost(0)
  const round2Cost = useCost(1)

  const totalCost = useMemo(() => {
    return [
      round1Cost[Role.A_SIDE].agentCost +
        round1Cost[Role.A_SIDE].engineCost +
        round2Cost[Role.A_SIDE].agentCost +
        round2Cost[Role.A_SIDE].engineCost,
      round1Cost[Role.B_SIDE].agentCost +
        round1Cost[Role.B_SIDE].engineCost +
        round2Cost[Role.B_SIDE].agentCost +
        round2Cost[Role.B_SIDE].engineCost,
    ] as [number, number]
  }, [round1Cost, round2Cost])
  const costBonuse = useMemo(() => {
    return pipe(totalCost, map(calcCostBonuse), toArray) as [number, number]
  }, [totalCost])
  const timeBounse = useMemo(() => {
    return [
      calcTimeScore(time[0][Role.A_SIDE]) + calcTimeScore(time[1][Role.A_SIDE]),
      calcTimeScore(time[0][Role.B_SIDE]) + calcTimeScore(time[1][Role.B_SIDE]),
    ] as [number, number]
  }, [time])
  const totalRoundScore = useMemo(() => {
    return [
      score[0][Role.A_SIDE] + score[1][Role.A_SIDE],
      score[0][Role.B_SIDE] + score[1][Role.B_SIDE],
    ] as [number, number]
  }, [time])
  const totalScore = useMemo(() => {
    return pipe(
      totalRoundScore,
      zipWithIndex,
      map(([index, value]) => value + value * costBonuse[index] + timeBounse[index]),
      toArray
    ) as [number, number]
  }, [totalRoundScore, costBonuse, timeBounse])

  return (
    <div className="card rounded-3xl w-full h-full relative flex flex-col gap-4">
      <div className="flex flex-col flex-1 p-4 gap-4">
        <Round round={0} />
        <Round round={1} />
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h2 className="text-center text-primary ft-ria text-3xl mb-4">결과</h2>
        <Row title="총 사용 Cost" value={totalCost} />
        <Row
          title="Cost 보너스 배율(%)"
          value={
            pipe(
              costBonuse,
              map((value) => value * 100),
              toArray
            ) as [number, number]
          }
        />
        <Row title="총 시간 보너스" value={timeBounse} />
        <Row title="총 Round 점수" value={totalRoundScore} />
        <Row
          primary
          title="총점"
          value={totalScore}
          append={Math.abs(totalScore[0] - totalScore[1]).toLocaleString()}
        />
      </div>
      <span className="absolute block h-px left-4 right-4 bg-accent top-1/2 -translate-y-1/2"></span>
    </div>
  )
}

export default Result
