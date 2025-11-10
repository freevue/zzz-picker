import { base62 } from '.'
import { join, pipe } from '@fxts/core'
import type { Side } from '@zzz-picker/constant'

function toBase62(num: number): string {
  if (num === 0) return base62[0]

  let result = ''
  while (num > 0) {
    result = base62[num % 62] + result
    num = Math.floor(num / 62)
  }
  return result
}

function encryptRole(role: Side | 'H'): string {
  const timestamp = Math.floor(Date.now() / 1000)
  const random = Math.floor(Math.random() * 1000000)

  return pipe(
    timestamp % 5,
    (index) => [
      toBase62(random).padStart(4, '0').slice(0, index),
      base62[role === 'A' ? 0 : role === 'B' ? 1 : 2],
      toBase62(random).padStart(4, '0').slice(index),
    ],
    join(''),
    (value) => `${value}${toBase62(timestamp).padStart(6, '0')}`
  )
}

export default encryptRole
