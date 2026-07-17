import { concat, filter, includes, isNull, pipe, size } from '@fxts/core'
import { DEALER, Position, Role, Specialty } from '~/constant'

type OpponentMap = {
  [Role.A_SIDE]: Role.B_SIDE
  [Role.B_SIDE]: Role.A_SIDE
  [Role.HOST]: Role.HOST
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
