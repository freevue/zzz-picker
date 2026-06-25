import { getAgentCost, isBanEligible } from './mock'

/**
 * V3 통합 경기 데이터 모델 (규칙 기반, 라운드 구조).
 *
 * 규칙 요약:
 * - 경기 = 2개 라운드. 선수마다 라운드별 파티 1개(캐릭터 3 + 보스).
 * - 정식/레전드: R1 보스는 각 선수 희망, R2 보스는 공통(B 선택). 밴 2개.
 * - 공허: 보스/밴 단계 없음(라운드별 각자 임의 보스), 밴 없음.
 * - Cost(자동): 픽업 S 캐릭터만 비용 발생(현재 mock: 1/명, 돌파/무기 미반영).
 * - 점수: (R1+R2) × 코스트보너스 + 시간보너스(3분 내 1초당 333점). 정식만 잔여 코스트 보너스.
 */

export type GameType = 'original' | 'legend' | 'unlimited'
export type Side = 'A' | 'B'
export type Role = 'admin' | 'A' | 'B'
export type RoundIdx = 0 | 1

export type TimeValue = { min: number; sec: number }
export type Party = { boss: number | null; picks: (number | null)[] } // picks length 3

export type MatchState = {
  gameType: GameType
  nickname: Record<Side, string>
  ban: number[] // 전역 밴 (정식/레전드 최대 2)
  rounds: Record<Side, [Party, Party]>
  score: Record<Side, [number, number]>
  time: Record<Side, [TimeValue, TimeValue]>
  rev: number
  updatedBy: Role
}

export type GameRule = {
  label: string
  short: string
  hasBan: boolean
  hasBossSelect: boolean
  commonR2Boss: boolean
  costLimit: number | null
  banCount: number
}

export const GAME_RULES: Record<GameType, GameRule> = {
  original: { label: '정식 로프꾼', short: '정식', hasBan: true, hasBossSelect: true, commonR2Boss: true, costLimit: 24, banCount: 2 },
  legend: { label: '레전드 로프꾼', short: '레전드', hasBan: true, hasBossSelect: true, commonR2Boss: true, costLimit: null, banCount: 2 },
  unlimited: { label: '공허 사냥꾼', short: '공허', hasBan: false, hasBossSelect: false, commonR2Boss: false, costLimit: null, banCount: 0 },
}

export const GAME_TYPE_LIST: GameType[] = ['original', 'legend', 'unlimited']
export const PICK_PER_PARTY = 3

const emptyParty = (): Party => ({ boss: null, picks: [null, null, null] })
const emptyTime = (): TimeValue => ({ min: 0, sec: 0 })

export const createInitialState = (): MatchState => ({
  gameType: 'original',
  nickname: { A: '', B: '' },
  ban: [],
  rounds: {
    A: [emptyParty(), emptyParty()],
    B: [emptyParty(), emptyParty()],
  },
  score: { A: [0, 0], B: [0, 0] },
  time: { A: [emptyTime(), emptyTime()], B: [emptyTime(), emptyTime()] },
  rev: 0,
  updatedBy: 'admin',
})

export type MatchAction =
  | { type: 'REPLACE'; state: MatchState }
  | { type: 'SET_GAME_TYPE'; gameType: GameType; by: Role }
  | { type: 'PICK'; side: Side; round: RoundIdx; id: number; by: Role }
  | { type: 'TOGGLE_BAN'; id: number; by: Role }
  | { type: 'SET_BOSS'; side: Side; round: RoundIdx; id: number; by: Role }
  | { type: 'SET_SCORE'; side: Side; round: RoundIdx; value: number; by: Role }
  | { type: 'SET_TIME'; side: Side; round: RoundIdx; value: TimeValue; by: Role }
  | { type: 'SET_NICKNAME'; side: Side; value: string; by: Role }
  | { type: 'RESET'; by: Role }

const bump = (state: MatchState, by: Role): MatchState => ({ ...state, rev: state.rev + 1, updatedBy: by })

const clone = (state: MatchState): MatchState => ({
  ...state,
  nickname: { ...state.nickname },
  ban: [...state.ban],
  rounds: { A: [{ ...state.rounds.A[0] }, { ...state.rounds.A[1] }], B: [{ ...state.rounds.B[0] }, { ...state.rounds.B[1] }] },
  score: { A: [...state.score.A], B: [...state.score.B] },
  time: { A: [...state.time.A], B: [...state.time.B] },
})

export const matchReducer = (state: MatchState, action: MatchAction): MatchState => {
  switch (action.type) {
    case 'REPLACE':
      return action.state

    case 'SET_GAME_TYPE': {
      const next = clone(state)
      next.gameType = action.gameType
      if (!GAME_RULES[action.gameType].hasBan) next.ban = []
      return bump(next, action.by)
    }

    case 'PICK': {
      const allBans = state.ban
      if (allBans.includes(action.id)) return state
      const next = clone(state)
      const party = next.rounds[action.side][action.round]
      const picks = [...party.picks]
      const at = picks.indexOf(action.id)
      if (at >= 0) {
        picks[at] = null // 이미 선택된 캐릭터 → 해제
      } else {
        const empty = picks.indexOf(null)
        if (empty < 0) return state // 3슬롯 가득
        picks[empty] = action.id
      }
      party.picks = picks
      next.rounds[action.side][action.round] = party
      return bump(next, action.by)
    }

    case 'TOGGLE_BAN': {
      const rule = GAME_RULES[state.gameType]
      if (!rule.hasBan) return state
      const next = clone(state)
      if (next.ban.includes(action.id)) {
        next.ban = next.ban.filter((x) => x !== action.id)
      } else {
        if (!isBanEligible(action.id)) return state // 픽업 S, allow/teaser 제외만 밴 가능
        if (next.ban.length >= rule.banCount) return state
        next.ban = [...next.ban, action.id]
        // 밴된 캐릭터는 모든 파티 픽에서 제거
        ;(['A', 'B'] as Side[]).forEach((s) =>
          next.rounds[s].forEach((p) => (p.picks = p.picks.map((x) => (x === action.id ? null : x))))
        )
      }
      return bump(next, action.by)
    }

    case 'SET_BOSS': {
      const next = clone(state)
      const rule = GAME_RULES[state.gameType]
      if (rule.commonR2Boss && action.round === 1) {
        // R2 보스는 양 선수 공통
        next.rounds.A[1].boss = action.id
        next.rounds.B[1].boss = action.id
      } else {
        next.rounds[action.side][action.round].boss = action.id
      }
      return bump(next, action.by)
    }

    case 'SET_SCORE': {
      const next = clone(state)
      next.score[action.side][action.round] = Math.max(0, action.value)
      return bump(next, action.by)
    }

    case 'SET_TIME': {
      const next = clone(state)
      next.time[action.side][action.round] = action.value
      return bump(next, action.by)
    }

    case 'SET_NICKNAME': {
      const next = clone(state)
      next.nickname[action.side] = action.value
      return bump(next, action.by)
    }

    case 'RESET':
      return { ...createInitialState(), rev: state.rev + 1, updatedBy: action.by }

    default:
      return state
  }
}

const TIME_BONUS = 333

const timeBonus = (t: TimeValue): number => {
  const sec = t.min * 60 + t.sec
  return sec > 0 && sec <= 180 ? (180 - sec) * TIME_BONUS : 0
}

/** 선수의 전체 픽(두 파티) 합산 코스트 (자동) */
export const getUsedCost = (state: MatchState, side: Side): number =>
  state.rounds[side]
    .flatMap((p) => p.picks)
    .filter((id): id is number => id != null)
    .reduce((sum, id) => sum + getAgentCost(id), 0)

/** 규칙 기반 최종 점수: (R1+R2) × 코스트보너스 + 시간보너스 */
export const getFinalScore = (state: MatchState, side: Side): number => {
  const rule = GAME_RULES[state.gameType]
  const base = state.score[side][0] + state.score[side][1]
  const used = getUsedCost(state, side)
  const leftover = rule.costLimit != null ? Math.max(0, rule.costLimit - used) : 0
  const mult = rule.costLimit != null ? 1 + leftover * 0.05 : 1
  const bonus = timeBonus(state.time[side][0]) + timeBonus(state.time[side][1])
  return Math.round(base * mult + bonus)
}
