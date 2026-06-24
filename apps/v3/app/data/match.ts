import { getMockAgentCost } from './mock'
import {
  calculateOriginalScore,
  calculateLegendScore,
  calculateUnlimitedScore,
} from '@zzz-picker/utils'

/**
 * V3 통합 경기 데이터 모델.
 * 기존에 original / legend / unlimited 3가지로 분리되어 있던 데이터를
 * gameType 단일 필드 + 공통 구조로 통합합니다. 경기 도중에도 gameType만
 * 교체하면 픽/밴 데이터를 유지한 채 규칙(밴 수·코스트 제한)이 전환됩니다.
 */

export type GameType = 'original' | 'legend' | 'unlimited'
export type Side = 'A' | 'B'
export type Role = 'admin' | 'A' | 'B'

export type TimeValue = { min: number; sec: number; ms: number }

export type MatchState = {
  gameType: GameType
  nickname: Record<Side, string>
  ban: Record<Side, number[]>
  pick: Record<Side, number[]>
  score: Record<Side, number>
  time: Record<Side, TimeValue>
  boss: number | null
  rev: number
  updatedBy: Role
}

export type GameRule = {
  label: string
  short: string
  banCount: number
  costLimit: number | null
  pickCount: number
}

export const GAME_RULES: Record<GameType, GameRule> = {
  original: { label: '정식 로프꾼', short: '정식 (24C)', banCount: 2, costLimit: 24, pickCount: 3 },
  legend: { label: '레전드 로프꾼', short: '레전드 (무제한)', banCount: 2, costLimit: null, pickCount: 3 },
  unlimited: { label: '공허 사냥꾼', short: '공허 (무제한)', banCount: 0, costLimit: null, pickCount: 3 },
}

export const GAME_TYPE_LIST: GameType[] = ['original', 'legend', 'unlimited']

const emptyTime = (): TimeValue => ({ min: 0, sec: 0, ms: 0 })

export const createInitialState = (): MatchState => ({
  gameType: 'original',
  nickname: { A: '', B: '' },
  ban: { A: [], B: [] },
  pick: { A: [], B: [] },
  score: { A: 0, B: 0 },
  time: { A: emptyTime(), B: emptyTime() },
  boss: null,
  rev: 0,
  updatedBy: 'admin',
})

export type MatchAction =
  | { type: 'REPLACE'; state: MatchState }
  | { type: 'SET_GAME_TYPE'; gameType: GameType; by: Role }
  | { type: 'TOGGLE_PICK'; side: Side; id: number; by: Role }
  | { type: 'TOGGLE_BAN'; side: Side; id: number; by: Role }
  | { type: 'SET_SCORE'; side: Side; value: number; by: Role }
  | { type: 'SET_TIME'; side: Side; value: TimeValue; by: Role }
  | { type: 'SET_NICKNAME'; side: Side; value: string; by: Role }
  | { type: 'SET_BOSS'; id: number | null; by: Role }
  | { type: 'RESET'; by: Role }

const bump = (state: MatchState, by: Role): MatchState => ({
  ...state,
  rev: state.rev + 1,
  updatedBy: by,
})

const toggle = (list: number[], id: number): number[] =>
  list.includes(id) ? list.filter((x) => x !== id) : [...list, id]

export const matchReducer = (state: MatchState, action: MatchAction): MatchState => {
  switch (action.type) {
    case 'REPLACE':
      return action.state

    case 'SET_GAME_TYPE': {
      const rule = GAME_RULES[action.gameType]
      // 코스트/밴 규칙 전환 시 픽 리스트는 유지하되 pickCount 한도로 정리
      const trim = (list: number[]) => list.slice(0, rule.pickCount)
      const trimBan = (list: number[]) => list.slice(0, rule.banCount)
      return bump(
        {
          ...state,
          gameType: action.gameType,
          pick: { A: trim(state.pick.A), B: trim(state.pick.B) },
          ban: { A: trimBan(state.ban.A), B: trimBan(state.ban.B) },
        },
        action.by
      )
    }

    case 'TOGGLE_PICK': {
      const rule = GAME_RULES[state.gameType]
      const allBans = [...state.ban.A, ...state.ban.B]
      if (allBans.includes(action.id)) return state // 밴된 캐릭터는 픽 불가
      const current = state.pick[action.side]
      let next: number[]
      if (current.includes(action.id)) {
        next = current.filter((x) => x !== action.id)
      } else if (current.length >= rule.pickCount) {
        next = [...current.slice(1), action.id] // 한도 초과 시 가장 오래된 픽 교체(FIFO)
      } else {
        next = [...current, action.id]
      }
      return bump({ ...state, pick: { ...state.pick, [action.side]: next } }, action.by)
    }

    case 'TOGGLE_BAN': {
      const rule = GAME_RULES[state.gameType]
      const current = state.ban[action.side]
      let nextBan: number[]
      if (current.includes(action.id)) {
        nextBan = current.filter((x) => x !== action.id)
      } else if (rule.banCount === 0) {
        return state // 밴이 없는 모드
      } else if (current.length >= rule.banCount) {
        nextBan = [...current.slice(1), action.id]
      } else {
        nextBan = [...current, action.id]
      }
      // Smart eviction: 밴된 캐릭터는 양 팀 픽에서 제거
      const evict = (list: number[]) => list.filter((x) => x !== action.id)
      return bump(
        {
          ...state,
          ban: { ...state.ban, [action.side]: nextBan },
          pick: { A: evict(state.pick.A), B: evict(state.pick.B) },
        },
        action.by
      )
    }

    case 'SET_SCORE':
      return bump(
        { ...state, score: { ...state.score, [action.side]: Math.max(0, action.value) } },
        action.by
      )

    case 'SET_TIME':
      return bump({ ...state, time: { ...state.time, [action.side]: action.value } }, action.by)

    case 'SET_NICKNAME':
      return bump(
        { ...state, nickname: { ...state.nickname, [action.side]: action.value } },
        action.by
      )

    case 'SET_BOSS':
      return bump({ ...state, boss: action.id }, action.by)

    case 'RESET':
      return { ...createInitialState(), rev: state.rev + 1, updatedBy: action.by }

    default:
      return state
  }
}

export const getSideCost = (ids: number[]): number =>
  ids.reduce((sum, id) => sum + getMockAgentCost(id), 0)

export const elapsedSeconds = (t: TimeValue): number => t.min * 60 + t.sec

export const getSideScore = (state: MatchState, side: Side): number => {
  const base = state.score[side]
  const sec = elapsedSeconds(state.time[side])
  switch (state.gameType) {
    case 'original':
      return Math.round(calculateOriginalScore(base, sec, getSideCost(state.pick[side])))
    case 'legend':
      return Math.round(calculateLegendScore(base, sec))
    case 'unlimited':
      return Math.round(calculateUnlimitedScore(base, sec))
    default:
      return base
  }
}
