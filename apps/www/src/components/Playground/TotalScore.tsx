import { UI } from '@/components'
import { DEFAULT_COST_RATE } from '@/constant'
import { usePlay, useSetting, useStore } from '@/hooks'
import type { Rarity } from '@/types'
import { pipe, join, concat, map, sum, flatMap, toArray } from '@fxts/core'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect, useMemo } from 'react'

type Props = {}

function getAgentCostType(rarity: Rarity, isPickup: boolean) {
  if (rarity === 'A') return 'AAlways'
  if (rarity === 'S' && isPickup) return 'SPick'

  return 'SAlways'
}

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
  const { agent } = useStore()
  const { costTable, setting } = useSetting()
  const { round } = usePlay()
  const totalCost = useMemo(() => {
    return {
      A: pipe(
        round,
        flatMap(([, round]) => round.A.pickList),
        map((pick) => {
          if (!pick.agent) return 0

          const currentAgent = agent.get(pick.agent)!
          const agentCostType = getAgentCostType(currentAgent.rarity, currentAgent.isPickup)
          const { used, rate } = costTable.agent[agentCostType]

          const engineCost = pick.setting.engineType
            ? costTable.engine[pick.setting.engineType].used +
              costTable.engine[pick.setting.engineType].rate * pick.setting.engineRate
            : 0

          return used + rate * pick.setting.rate + engineCost
        }),
        sum
      ),
      B: pipe(
        round,
        flatMap(([, round]) => round.B.pickList),
        map((pick) => {
          if (!pick.agent) return 0

          const currentAgent = agent.get(pick.agent)!
          const agentCostType = getAgentCostType(currentAgent.rarity, currentAgent.isPickup)
          const { used, rate } = costTable.agent[agentCostType]

          const engineCost = pick.setting.engineType
            ? costTable.engine[pick.setting.engineType].used +
              costTable.engine[pick.setting.engineType].rate * pick.setting.engineRate
            : 0

          return used + rate * pick.setting.rate + engineCost
        }),
        sum
      ),
    }
  }, [round, costTable, agent])
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
      A: sum([
        roundTotalScore.A,
        roundTotalScore.A * (setting.totalCost - totalCost.A) * DEFAULT_COST_RATE,
        roundTotalTime.A * 333,
      ]),
      B: sum([
        roundTotalScore.B,
        roundTotalScore.B * (setting.totalCost - totalCost.B) * DEFAULT_COST_RATE,
        roundTotalTime.B * 333,
      ]),
    }
  }, [roundTotalScore, roundTotalTime, totalCost])

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
          <Record
            className="text-right"
            value={(setting.totalCost - totalCost.A) * DEFAULT_COST_RATE * 100}
          />
          <UI.Typo.Heading className="w-1/3 text-xl text-center">Cost 보너스 배율</UI.Typo.Heading>
          <Record
            className="text-left"
            value={(setting.totalCost - totalCost.B) * DEFAULT_COST_RATE * 100}
          />
        </div>
        <div className="flex items-center justify-between mt-4">
          <UI.Typo.Heading className="flex-1 text-right" primary>
            <Record value={Math.round(totalScore.A)} />
          </UI.Typo.Heading>
          <UI.Typo.Heading className="w-1/3 text-center">총 점수</UI.Typo.Heading>
          <UI.Typo.Heading className="flex-1 text-left" primary>
            <Record value={Math.round(totalScore.B)} />
          </UI.Typo.Heading>
        </div>
      </div>
    </div>
  )
}

export default TotalScore
