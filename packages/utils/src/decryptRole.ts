import { base62 } from '.'
import { pipe, split, map, reduceLazy, size, throwIf } from '@fxts/core'
import type { Side } from '@zzz-picker/constant'

function fromBase62(value: string): number {
  return pipe(
    value,
    split(''),
    map((char) => base62.indexOf(char)),
    reduceLazy((prev, curr) => prev * 62 + curr, 0)
  )
}

function decryptRole(encrypted: string): Side | 'H' {
  try {
    return pipe(
      encrypted,
      throwIf(
        (value) => size(value) !== 11,
        () => Error()
      ),
      (value) => [value.slice(0, 5), fromBase62(value.slice(5))] as const,
      throwIf(
        ([, timestamp]) =>
          pipe(
            Date.now() / 1000,
            (now) => Math.floor(now),
            (now) => (now - timestamp) / 3600 > 24
          ),
        () => Error()
      ),
      ([random, timestampPart]) => random[timestampPart % 5],
      (role) => base62.indexOf(role),
      (role) => (role === 0 ? 'A' : role === 1 ? 'B' : 'H')
    )
  } catch {
    throw new Error('토큰값이 잘못되었습니다.')
  }
}

export default decryptRole
