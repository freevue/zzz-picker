import { usePlay, useSetting, useStore } from '@/hooks'
import type { Rarity } from '@/types'
import { pipe, join, concat, map, sum, flatMap, filter } from '@fxts/core'
import { Button, Typo } from '@zzz-picker/components'
import { DEFAULT_COST_RATE, DEFAULT_TIME_BONUS, type AgentCostType } from '@zzz-picker/constant'
import { getAgentTotalCost } from '@zzz-picker/utils'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'

type Props = {}

function getAgentCostType(rarity: Rarity, isPickup: boolean): AgentCostType {
  if (rarity === 'A') return 'AAlways'
  if (rarity === 'S' && isPickup) return 'SPick'

  return 'SAlways'
}

const HideRecord: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <span className="absolute cursor-default left-0 -bottom-8 font-extrabold w-full text-base text-xl! opacity-0 group-hover:opacity-70 transition-opacity duration-300">
      {props.children}
    </span>
  )
}
const Record: React.FC<{
  value: number
  className?: string
  fixed: number
  prefix?: string
  isHide?: boolean
}> = (props) => {
  const count = useMotionValue(100)
  const rounded = useTransform(() => {
    const value = Number(count.get().toFixed(props.fixed)).toLocaleString('ko-KR')

    if (props.prefix) return `${value} ${props.prefix}`

    return value
  })

  useEffect(() => {
    const controls = animate(count, props.value, { duration: 1 })

    return () => controls.stop()
  }, [props.value])

  return (
    <motion.p
      className={pipe(
        ['text-text-primary', 'text-3xl', 'font-black', 'flex-1', 'cursor-default'],
        concat([props.className || '']),
        concat(props.isHide ? ['opacity-0'] : ['opacity-100']),
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
  const [isCounting, setIsCounting] = useState<boolean>(false)
  const totalCost = useMemo(() => {
    return {
      A: pipe(
        round,
        flatMap(([, round]) => round.A.pickList),
        map((pick) => {
          if (!pick.agent) return 0

          return pipe(
            agent.get(pick.agent)!,
            (currentAgent) => getAgentCostType(currentAgent.rarity, currentAgent.isPickup),
            (pickup) => ({
              pickup,
              agentRate: pick.setting.rate,
              engineType: pick.setting.engineType,
              engineRate: pick.setting.engineRate,
            }),
            getAgentTotalCost(costTable)
          )
        }),
        sum
      ),
      B: pipe(
        round,
        flatMap(([, round]) => round.B.pickList),
        map((pick) => {
          if (!pick.agent) return 0

          return pipe(
            agent.get(pick.agent)!,
            (currentAgent) => getAgentCostType(currentAgent.rarity, currentAgent.isPickup),
            (pickup) => ({
              pickup,
              agentRate: pick.setting.rate,
              engineType: pick.setting.engineType,
              engineRate: pick.setting.engineRate,
            }),
            getAgentTotalCost(costTable)
          )
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
        filter((value) => 180 > value),
        map((value) => (180 - value) * DEFAULT_TIME_BONUS),
        sum
      ),
      B: pipe(
        round,
        map(([, round]) => round.B.result.timer || 180),
        filter((value) => 180 > value),
        map((value) => (180 - value) * DEFAULT_TIME_BONUS),
        sum
      ),
    }
  }, [round])
  const totalScore = useMemo(() => {
    return {
      A: sum([
        roundTotalScore.A,
        roundTotalScore.A * (setting.totalCost - totalCost.A) * DEFAULT_COST_RATE,
        roundTotalTime.A,
      ]),
      B: sum([
        roundTotalScore.B,
        roundTotalScore.B * (setting.totalCost - totalCost.B) * DEFAULT_COST_RATE,
        roundTotalTime.B,
      ]),
    }
  }, [roundTotalScore, roundTotalTime, totalCost])

  useEffect(() => {
    setIsCounting(false)
  }, [round])

  return (
    <div>
      <Typo.Heading className="text-center" primary>
        결과
      </Typo.Heading>
      <div className="flex flex-col gap-4 mt-8">
        <div className="flex items-center justify-between">
          <Record
            className={pipe(
              ['text-right'],
              concat(totalCost.A > setting.totalCost ? ['text-red-500!'] : []),
              join(' ')
            )}
            value={totalCost.A}
            fixed={2}
          />
          <Typo.Heading className="w-1/3 text-xl text-center cursor-default">
            총 사용 Cost
          </Typo.Heading>
          <Record
            className={pipe(
              ['text-left'],
              concat(totalCost.B > setting.totalCost ? ['text-red-500!'] : []),
              join(' ')
            )}
            value={totalCost.B}
            fixed={2}
          />
        </div>
        <div className="flex items-center justify-between">
          <Record
            className="text-right"
            value={isCounting ? roundTotalScore.A : 0}
            fixed={0}
            isHide={!isCounting}
          />
          <Typo.Heading className="w-1/3 text-xl text-center cursor-default">
            라운드 점수 합산
          </Typo.Heading>
          <Record
            className="text-left"
            value={isCounting ? roundTotalScore.B : 0}
            fixed={0}
            isHide={!isCounting}
          />
        </div>
        <div className="flex items-center justify-between">
          <Record
            className="text-right"
            value={isCounting ? roundTotalTime.A : 0}
            fixed={0}
            isHide={!isCounting}
          />
          <Typo.Heading className="w-1/3 text-xl text-center cursor-default">
            시간 보너스
          </Typo.Heading>
          <Record
            className="text-left"
            value={isCounting ? roundTotalTime.B : 0}
            fixed={0}
            isHide={!isCounting}
          />
        </div>
        <div className="flex items-center justify-between">
          <Record
            className="text-right"
            value={isCounting ? (setting.totalCost - totalCost.A) * DEFAULT_COST_RATE * 100 : 0}
            fixed={2}
            prefix="%"
            isHide={!isCounting}
          />
          <Typo.Heading className="w-1/3 text-xl text-center cursor-default">
            Cost 보너스 배율
          </Typo.Heading>
          <Record
            className="text-left"
            value={isCounting ? (setting.totalCost - totalCost.B) * DEFAULT_COST_RATE * 100 : 0}
            fixed={2}
            prefix="%"
            isHide={!isCounting}
          />
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="text-right flex-1 relative group">
            <Record
              className="text-primary! text-4xl!"
              value={isCounting ? Math.round(totalScore.A) : 0}
              fixed={0}
              isHide={!isCounting}
            />
            {isCounting && <HideRecord>{totalScore.A.toLocaleString()}</HideRecord>}
          </div>
          <Typo.Heading className="w-1/3 text-center cursor-default">총 점수</Typo.Heading>
          <div className="text-left flex-1 relative group">
            <Record
              className="text-primary! text-4xl!"
              value={isCounting ? Math.round(totalScore.B) : 0}
              fixed={0}
              isHide={!isCounting}
            />
            {isCounting && <HideRecord>{totalScore.B.toLocaleString()}</HideRecord>}
          </div>
        </div>
        <Button
          type="button"
          onClick={() => setIsCounting((prev) => !prev)}
          className="text-secondary font-extrabold text-xl"
        >
          결산하기
        </Button>
      </div>
    </div>
  )
}

export default TotalScore
