import { usePlay, useSetting } from '@/hooks'
import { pipe, join, concat, map, sum, toArray, transpose, includes, filter } from '@fxts/core'
import { useLocation } from '@remix-run/react'
import { Typo } from '@zzz-picker/components/v2'
import { DEFAULT, DEFAULT_COST_RATE, type Side } from '@zzz-picker/constant'
import { getAgentTotalCost } from '@zzz-picker/utils'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect, useMemo } from 'react'

type Props = {}

const HideRecord: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <span className="absolute cursor-default left-0 -bottom-8 font-extrabold w-full text-foreground text-xl! opacity-0 group-hover:opacity-70 transition-opacity duration-300">
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
        ['text-ink', 'heading-3xl', 'flex-1', 'cursor-default'],
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
  const { state: playState, allPickList, cost, isCounting, setIsCounting } = usePlay()
  const { pathname } = useLocation()
  const { costTable, state: settingState } = useSetting()
  const roundList = useMemo(() => {
    return [playState.personal, playState[pathname === '/unlimited' ? 'unlimited' : 'common']]
  }, [pathname, playState])
  const totalCost = useMemo(() => {
    const getSideTotalCost = (side: Side) => {
      return pipe(
        cost[side],
        filter(([agentId]) => includes(agentId, allPickList[side])),
        map(([, costSetting]) => costSetting),
        map(getAgentTotalCost(costTable)),
        sum
      )
    }

    return {
      A: getSideTotalCost('A'),
      B: getSideTotalCost('B'),
    }
  }, [cost, costTable, allPickList])
  const roundTotalScore = useMemo(() => {
    const [A, B] = pipe(
      roundList,
      map(({ A, B }) => [A.result, B.result]),
      (list) => transpose(...list),
      map(sum),
      toArray
    )

    return { A, B }
  }, [roundList])
  const roundTotalTime = useMemo(() => {
    const [A, B] = pipe(
      roundList,
      map(({ A, B }) => [
        180 >= A.time && A.time > 0 ? 180 - A.time : 0,
        180 >= B.time && B.time > 0 ? 180 - B.time : 0,
      ]),
      (list) => transpose(...list),
      map(sum),
      map((value) => value * DEFAULT.TIME_BONUS),
      toArray
    )

    return { A, B }
  }, [roundList])
  const totalScore = useMemo(() => {
    return {
      A: sum([
        roundTotalScore.A,
        settingState.totalCost === Infinity
          ? 0
          : roundTotalScore.A * (settingState.totalCost - totalCost.A) * DEFAULT_COST_RATE,
        roundTotalTime.A,
      ]),
      B: sum([
        roundTotalScore.B,
        settingState.totalCost === Infinity
          ? 0
          : roundTotalScore.B * (settingState.totalCost - totalCost.B) * DEFAULT_COST_RATE,
        roundTotalTime.B,
      ]),
    }
  }, [roundTotalScore, roundTotalTime, totalCost, settingState.totalCost])

  return (
    <div className={pipe(['relative'], concat([]), join(' '))}>
      <Typo.Heading className="text-center heading-3xl text-primary">결과</Typo.Heading>
      <div className="flex flex-col gap-4 mt-8">
        <div className="flex items-center justify-between">
          <Record
            className={pipe(
              ['text-right'],
              concat(
                settingState.totalCost !== Infinity && totalCost.A > settingState.totalCost
                  ? ['text-red-500!']
                  : []
              ),
              join(' ')
            )}
            value={totalCost.A}
            fixed={2}
          />
          <Typo.Heading className="w-1/3 text-center cursor-default heading-xl">
            총 사용 Cost
          </Typo.Heading>
          <Record
            className={pipe(
              ['text-left'],
              concat(
                settingState.totalCost !== Infinity && totalCost.B > settingState.totalCost
                  ? ['text-red-500!']
                  : []
              ),
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
          <Typo.Heading className="w-1/3 text-center cursor-default heading-xl">
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
          <Typo.Heading className="w-1/3 text-center cursor-default heading-xl">
            시간 보너스
          </Typo.Heading>
          <Record
            className="text-left"
            value={isCounting ? roundTotalTime.B : 0}
            fixed={0}
            isHide={!isCounting}
          />
        </div>
        {settingState.totalCost !== Infinity && (
          <div className="flex items-center justify-between">
            <Record
              className="text-right"
              value={
                isCounting ? (settingState.totalCost - totalCost.A) * DEFAULT_COST_RATE * 100 : 0
              }
              fixed={2}
              prefix="%"
              isHide={!isCounting}
            />
            <Typo.Heading className="w-1/3 text-center cursor-default heading-xl">
              Cost 보너스 배율
            </Typo.Heading>
            <Record
              className="text-left"
              value={
                isCounting ? (settingState.totalCost - totalCost.B) * DEFAULT_COST_RATE * 100 : 0
              }
              fixed={2}
              prefix="%"
              isHide={!isCounting}
            />
          </div>
        )}
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
          <Typo.Heading className="w-1/3 text-center cursor-default heading-3xl">
            총 점수
          </Typo.Heading>
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
        <button
          type="button"
          onClick={() => setIsCounting((prev) => !prev)}
          className="text-secondary heading-xl focus:outline-none cursor-pointer"
        >
          결산하기
        </button>
      </div>
    </div>
  )
}

export default TotalScore
