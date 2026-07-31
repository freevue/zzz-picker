import type { Agent, Engine } from '@/type'
import {
  entries,
  filter,
  find,
  flat,
  groupBy,
  includes,
  isArray,
  isObject,
  map,
  max,
  pipe,
  sort,
  sum,
} from '@fxts/core'
import { DEALER, Position, Role, Specialty } from '~/constant'

type OpponentMap = {
  [Role.A_SIDE]: Role.B_SIDE
  [Role.B_SIDE]: Role.A_SIDE
  [Role.HOST]: Role.HOST
}

export function hook(callback: (state: never) => void) {
  return <T>(state: T): T => {
    callback(state as never)

    return state
  }
}

export function opponent<T extends Role>(role: T): OpponentMap[T] {
  const opponentMap: OpponentMap = {
    [Role.A_SIDE]: Role.B_SIDE,
    [Role.B_SIDE]: Role.A_SIDE,
    [Role.HOST]: Role.HOST,
  }

  return opponentMap[role]
}

export function isBanFix(
  proposeBan: Array<number | null>,
  selectBan: Array<number | null>
): boolean {
  if (includes(null, proposeBan)) return false

  return includes(null, selectBan)
}

export function getPosition(specialty: (typeof Specialty)[keyof typeof Specialty]) {
  if (includes(specialty, DEALER)) return Position.DEALER

  return Position.SUPPORT
}

export function agentCost(rate: Record<number, number>) {
  return (agents: Agent[]) => {
    const costMap = pipe(
      agents,
      map((agent) => agent.cost),
      map(sort((prev, cur) => prev.rate - cur.rate)),
      flat,
      groupBy((cost) => cost.agentId)
    )

    return pipe(
      rate,
      entries,
      filter(([agentId]) => isArray(costMap[agentId])),
      map(([agentId, value]) => find(({ rate }) => rate === value, costMap[agentId])),
      filter(isObject),
      map(({ cost }) => cost),
      sum
    )
  }
}

export function engineCost(rate: Record<string, number>) {
  return (engines: Engine[]) => {
    const costMap = pipe(
      engines,
      map((engine) => engine.cost),
      map(sort((prev, cur) => prev.rate - cur.rate)),
      flat,
      groupBy((cost) => cost.engineId)
    )

    return pipe(
      rate,
      entries,
      filter(([engineId]) => isArray(costMap[engineId])),
      map(([engineId, value]) => find(({ rate }) => rate === value, costMap[engineId])!),
      filter(isObject),
      map(({ cost }) => cost),
      sum
    )
  }
}

export function calcTimeScore(time: number) {
  const MAX_TIME = 180
  const BONUSE_SCORE = 333

  return pipe([MAX_TIME - time, 0], max, (value) => value * BONUSE_SCORE)
}

export function calcCostBonuse(cost: number, MAX_COST: number = 24) {
  return (MAX_COST - cost) * 0.05
}
