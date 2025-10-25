import getAgentTotalCost from './getAgentTotalCost'
import { DEFAULT_COST_TABLE } from '@zzz-picker/constant'
import { describe, test, expect } from 'vitest'

const TEST_CASES = [
  {
    message: 'S픽업 + 전용',
    keys: ['SPick', 'SExclusive'] as const,
    cases: [
      [0, 0, 2] as const,
      [0, 1, 2.5] as const,
      [0, 2, 3] as const,
      [0, 3, 3.5] as const,
      [0, 4, 4] as const,
      [0, 5, 4.5] as const,

      [3, 0, 5] as const,
      [3, 1, 5.5] as const,
      [3, 2, 6] as const,
      [3, 3, 6.5] as const,
      [3, 4, 7] as const,
      [3, 5, 7.5] as const,

      [6, 0, 8] as const,
      [6, 1, 8.5] as const,
      [6, 2, 9] as const,
      [6, 3, 9.5] as const,
      [6, 4, 10] as const,
      [6, 5, 10.5] as const,
    ],
  },
  {
    message: 'S픽업 + S 급',
    keys: ['SPick', 'S'],
    cases: [
      [0, 0, 1] as const,
      [0, 1, 1] as const,
      [0, 2, 1] as const,
      [0, 3, 1] as const,
      [0, 4, 2] as const,
      [0, 5, 2] as const,

      [3, 0, 4] as const,
      [3, 1, 4] as const,
      [3, 2, 4] as const,
      [3, 3, 4] as const,
      [3, 4, 5] as const,
      [3, 5, 5] as const,

      [6, 0, 7] as const,
      [6, 1, 7] as const,
      [6, 2, 7] as const,
      [6, 3, 7] as const,
      [6, 4, 8] as const,
      [6, 5, 8] as const,
    ],
  },
  {
    message: 'S픽업 + A 급',
    keys: ['SPick', 'A'],
    cases: [
      [0, 0, 1] as const,
      [0, 1, 1] as const,
      [0, 2, 1] as const,
      [0, 3, 1] as const,
      [0, 4, 1] as const,
      [0, 5, 1] as const,

      [3, 0, 4] as const,
      [3, 1, 4] as const,
      [3, 2, 4] as const,
      [3, 3, 4] as const,
      [3, 4, 4] as const,
      [3, 5, 4] as const,

      [6, 0, 7] as const,
      [6, 1, 7] as const,
      [6, 2, 7] as const,
      [6, 3, 7] as const,
      [6, 4, 7] as const,
      [6, 5, 7] as const,
    ],
  },
  {
    message: 'S픽업 + 없음',
    keys: ['SPick', null],
    cases: [
      [0, 0, 1] as const,
      [0, 1, 1] as const,
      [0, 2, 1] as const,
      [0, 3, 1] as const,
      [0, 4, 1] as const,
      [0, 5, 1] as const,

      [3, 0, 4] as const,
      [3, 1, 4] as const,
      [3, 2, 4] as const,
      [3, 3, 4] as const,
      [3, 4, 4] as const,
      [3, 5, 4] as const,

      [6, 0, 7] as const,
      [6, 1, 7] as const,
      [6, 2, 7] as const,
      [6, 3, 7] as const,
      [6, 4, 7] as const,
      [6, 5, 7] as const,
    ],
  },
  {
    message: 'S상시 + 전용',
    keys: ['SAlways', 'SExclusive'] as const,
    cases: [
      [0, 0, 1] as const,
      [0, 1, 1.5] as const,
      [0, 2, 2] as const,
      [0, 3, 2.5] as const,
      [0, 4, 3] as const,
      [0, 5, 3.5] as const,

      [3, 0, 1] as const,
      [3, 1, 1.5] as const,
      [3, 2, 2] as const,
      [3, 3, 2.5] as const,
      [3, 4, 3] as const,
      [3, 5, 3.5] as const,

      [6, 0, 1] as const,
      [6, 1, 1.5] as const,
      [6, 2, 2] as const,
      [6, 3, 2.5] as const,
      [6, 4, 3] as const,
      [6, 5, 3.5] as const,
    ],
  },
  {
    message: 'S상시 + S 급',
    keys: ['SAlways', 'S'],
    cases: [
      [0, 0, 0] as const,
      [0, 1, 0] as const,
      [0, 2, 0] as const,
      [0, 3, 0] as const,
      [0, 4, 1] as const,
      [0, 5, 1] as const,

      [3, 0, 0] as const,
      [3, 1, 0] as const,
      [3, 2, 0] as const,
      [3, 3, 0] as const,
      [3, 4, 1] as const,
      [3, 5, 1] as const,

      [6, 0, 0] as const,
      [6, 1, 0] as const,
      [6, 2, 0] as const,
      [6, 3, 0] as const,
      [6, 4, 1] as const,
      [6, 5, 1] as const,
    ],
  },
  {
    message: 'S상시 + A 급',
    keys: ['SAlways', 'A'],
    cases: [
      [0, 0, 0] as const,
      [0, 1, 0] as const,
      [0, 2, 0] as const,
      [0, 3, 0] as const,
      [0, 4, 0] as const,
      [0, 5, 0] as const,

      [3, 0, 0] as const,
      [3, 1, 0] as const,
      [3, 2, 0] as const,
      [3, 3, 0] as const,
      [3, 4, 0] as const,
      [3, 5, 0] as const,

      [6, 0, 0] as const,
      [6, 1, 0] as const,
      [6, 2, 0] as const,
      [6, 3, 0] as const,
      [6, 4, 0] as const,
      [6, 5, 0] as const,
    ],
  },
  {
    message: 'S상시 + 없음',
    keys: ['SAlways', null],
    cases: [
      [0, 0, 0] as const,
      [0, 1, 0] as const,
      [0, 2, 0] as const,
      [0, 3, 0] as const,
      [0, 4, 0] as const,
      [0, 5, 0] as const,

      [3, 0, 0] as const,
      [3, 1, 0] as const,
      [3, 2, 0] as const,
      [3, 3, 0] as const,
      [3, 4, 0] as const,
      [3, 5, 0] as const,

      [6, 0, 0] as const,
      [6, 1, 0] as const,
      [6, 2, 0] as const,
      [6, 3, 0] as const,
      [6, 4, 0] as const,
      [6, 5, 0] as const,
    ],
  },
  {
    message: 'A상시 + S 급',
    keys: ['AAlways', 'S'],
    cases: [
      [0, 0, 0] as const,
      [0, 1, 0] as const,
      [0, 2, 0] as const,
      [0, 3, 0] as const,
      [0, 4, 1] as const,
      [0, 5, 1] as const,

      [3, 0, 0] as const,
      [3, 1, 0] as const,
      [3, 2, 0] as const,
      [3, 3, 0] as const,
      [3, 4, 1] as const,
      [3, 5, 1] as const,

      [6, 0, 0] as const,
      [6, 1, 0] as const,
      [6, 2, 0] as const,
      [6, 3, 0] as const,
      [6, 4, 1] as const,
      [6, 5, 1] as const,
    ],
  },
  {
    message: 'A상시 + A 급',
    keys: ['AAlways', 'A'],
    cases: [
      [0, 0, 0] as const,
      [0, 1, 0] as const,
      [0, 2, 0] as const,
      [0, 3, 0] as const,
      [0, 4, 0] as const,
      [0, 5, 0] as const,

      [3, 0, 0] as const,
      [3, 1, 0] as const,
      [3, 2, 0] as const,
      [3, 3, 0] as const,
      [3, 4, 0] as const,
      [3, 5, 0] as const,

      [6, 0, 0] as const,
      [6, 1, 0] as const,
      [6, 2, 0] as const,
      [6, 3, 0] as const,
      [6, 4, 0] as const,
      [6, 5, 0] as const,
    ],
  },
  {
    message: 'A상시 + 없음',
    keys: ['AAlways', null],
    cases: [
      [0, 0, 0] as const,
      [0, 1, 0] as const,
      [0, 2, 0] as const,
      [0, 3, 0] as const,
      [0, 4, 0] as const,
      [0, 5, 0] as const,

      [3, 0, 0] as const,
      [3, 1, 0] as const,
      [3, 2, 0] as const,
      [3, 3, 0] as const,
      [3, 4, 0] as const,
      [3, 5, 0] as const,

      [6, 0, 0] as const,
      [6, 1, 0] as const,
      [6, 2, 0] as const,
      [6, 3, 0] as const,
      [6, 4, 0] as const,
      [6, 5, 0] as const,
    ],
  },
]

describe('에이전트 총 비용 계산 테스트', () => {
  describe.each(TEST_CASES)('$message', ({ cases, keys: [pickup, engineType] }) => {
    for (const [agentRate, engineRate, expected] of cases) {
      test(`[${agentRate}] + [${engineRate}] = ${expected}`, () => {
        expect(
          getAgentTotalCost(DEFAULT_COST_TABLE, {
            pickup: pickup as 'SPick' | 'SAlways' | 'AAlways',
            agentRate,
            engineType: engineType as 'SExclusive' | 'S' | 'A' | null,
            engineRate,
          })
        ).toBe(expected)
      })
    }
  })
})
