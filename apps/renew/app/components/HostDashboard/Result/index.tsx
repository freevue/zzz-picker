import Row from './Row'
import { calcTimeScore, calcCostBonuse } from '@/lib/utils'
import { map, pipe, range, sum, toArray, zipWithIndex } from '@fxts/core'
import { useSearchParams } from '@remix-run/react'
import { useMemo } from 'react'
import { MatchType, Role } from '~/constant'
import { useCost, useMatch } from '~/hooks'

const Round: React.FC<{ round: number }> = (props) => {
  const { play, setting } = useMatch()
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
        value={
          pipe(
            [play[Role.A_SIDE], play[Role.B_SIDE]],
            map((player) => player.time[props.round]),
            map(calcTimeScore(setting.ROUND_TIME_LIMIT, setting.TIME_BONUS_PER_SECOND)),
            toArray
          ) as [number, number]
        }
      />
      <Row
        title="Round 점수"
        value={[play[Role.A_SIDE].score[props.round], play[Role.B_SIDE].score[props.round]]}
      />
    </div>
  )
}
const Result: React.FC = () => {
  const [searchParams] = useSearchParams()
  const { play, match, setting } = useMatch()
  const cost = useCost()
  const totalCost = useMemo(() => {
    return [
      cost[Role.A_SIDE].agentCost + cost[Role.A_SIDE].engineCost,
      cost[Role.B_SIDE].agentCost + cost[Role.B_SIDE].engineCost,
    ] as [number, number]
  }, [cost])
  const costBonuse = useMemo(() => {
    return pipe(
      totalCost,
      map(calcCostBonuse(setting.TOTAL_COST, setting.PLUS_RATE, setting.MINUS_RATE)),
      toArray
    ) as [number, number]
  }, [totalCost, searchParams, setting])
  const timeBounse = useMemo(() => {
    return pipe(
      [play[Role.A_SIDE], play[Role.B_SIDE]],
      map((player) =>
        map(calcTimeScore(setting.ROUND_TIME_LIMIT, setting.TIME_BONUS_PER_SECOND), player.time)
      ),
      map(sum),
      toArray
    ) as [number, number]
  }, [play, setting])
  const totalRoundScore = useMemo(() => {
    return pipe(
      [play[Role.A_SIDE], play[Role.B_SIDE]],
      map((player) => player.score),
      map(sum),
      toArray
    ) as [number, number]
  }, [play])
  const totalScore = useMemo(() => {
    return pipe(
      totalRoundScore,
      zipWithIndex,
      map(([index, value]) => {
        if (match.matchType === MatchType.UNLIMITED) return value + timeBounse[index]

        return value + value * costBonuse[index] + timeBounse[index]
      }),
      map((value) => Number(value.toFixed(2))),
      toArray
    ) as [number, number]
  }, [totalRoundScore, costBonuse, timeBounse, match])

  return (
    <div className="card rounded-3xl w-full h-full relative flex flex-col gap-4">
      <div className="flex flex-col flex-1 p-4 gap-4">
        {pipe(
          setting.ROUND_COUNT,
          range,
          map((index) => <Round round={index} key={index} />),
          toArray
        )}
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h2 className="text-center text-primary ft-ria text-3xl mb-4">결과</h2>
        <Row
          title="총 사용 Cost"
          value={totalCost}
          error={(value) => {
            if (match.matchType === MatchType.ORIGINAL) return value > setting.TOTAL_COST

            return false
          }}
        />
        {match.matchType !== MatchType.UNLIMITED && (
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
        )}
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
