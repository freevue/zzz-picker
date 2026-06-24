import { pipe, sum } from '@fxts/core'
import { DEFAULT_COST_RATE, DEFAULT_TIME_BONUS } from '@zzz-picker/constant'

/**
 * 경과 시간에 따른 타임 보너스 연산 헬퍼
 */
const getTimeBonus = (elapsedSeconds: number): number =>
  elapsedSeconds > 0 && elapsedSeconds <= 180
    ? (180 - elapsedSeconds) * DEFAULT_TIME_BONUS
    : 0

/**
 * 정식 로프꾼 점수 계산 함수 (Original)
 * 공식: 기본 획득 점수 + (24 - 소모 Cost) * 코스트 보너스율(5%) * 기본 획득 점수 + (180 - 경과시간(초)) * 시간 보너스(333)
 */
export const calculateOriginalScore = (
  baseScore: number,
  elapsedSeconds: number,
  usedCost: number,
  maxCost: number = 24
): number =>
  pipe(
    [
      baseScore,
      baseScore * Math.max(0, maxCost - usedCost) * DEFAULT_COST_RATE,
      getTimeBonus(elapsedSeconds)
    ],
    sum
  )

/**
 * 레전드 로프꾼 점수 계산 함수 (Legend)
 * 공식: 기본 획득 점수 + (180 - 경과시간(초)) * 시간 보너스(333) (코스트 가중치 없음)
 */
export const calculateLegendScore = (
  baseScore: number,
  elapsedSeconds: number
): number =>
  pipe(
    [
      baseScore,
      getTimeBonus(elapsedSeconds)
    ],
    sum
  )

/**
 * 공허사냥꾼 점수 계산 함수 (Unlimited)
 * 공식: 기본 획득 점수 + (180 - 경과시간(초)) * 시간 보너스(333) (코스트 가중치 없음)
 */
export const calculateUnlimitedScore = (
  baseScore: number,
  elapsedSeconds: number
): number =>
  pipe(
    [
      baseScore,
      getTimeBonus(elapsedSeconds)
    ],
    sum
  )
