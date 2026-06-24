import {
  createInitialState,
  matchReducer,
  type MatchAction,
  type MatchState,
  type Role,
} from '../data/match'
import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * BroadcastChannel 기반 실시간 동기화 훅 (mock 단계).
 *
 * 같은 브라우저의 관리자 / A / B 화면(탭) 간에 경기 상태를 즉시 동기화합니다.
 * 추후 이 계층만 Supabase Realtime 채널로 교체하면 원격 동기화로 확장됩니다.
 *
 * - 로컬 액션 → 상태 reduce → 채널 브로드캐스트 + localStorage 저장
 * - 원격 수신 → rev 비교 후 더 최신 상태로 교체(재브로드캐스트 없음)
 * - 신규 진입(HELLO) → 기존 피어가 현재 상태로 응답하여 늦은 합류 동기화
 */

const CHANNEL = 'zzz-v3-match'
const STORAGE_KEY = 'zzz-v3-match-state'

type Wire =
  | { kind: 'STATE'; state: MatchState }
  | { kind: 'HELLO' }

/** 이전 데이터 모델로 저장된 localStorage가 신규(라운드) 모델과 충돌하지 않도록 형태 검증 */
const isValidState = (s: unknown): s is MatchState => {
  if (!s || typeof s !== 'object') return false
  const v = s as Partial<MatchState>
  const okParty = (p: unknown) =>
    !!p && typeof p === 'object' && Array.isArray((p as { picks?: unknown }).picks)
  const okSideRounds = (r: unknown) =>
    Array.isArray(r) && r.length === 2 && r.every(okParty)
  return (
    typeof v.gameType === 'string' &&
    Array.isArray(v.ban) &&
    !!v.rounds &&
    okSideRounds(v.rounds.A) &&
    okSideRounds(v.rounds.B) &&
    !!v.score &&
    Array.isArray(v.score.A) &&
    Array.isArray(v.score.B) &&
    !!v.time &&
    Array.isArray(v.time.A) &&
    Array.isArray(v.time.B)
  )
}

const loadStored = (): MatchState | null => {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    // 구버전/손상 데이터는 폐기하고 초기 상태로 시작
    return isValidState(parsed) ? parsed : null
  } catch {
    return null
  }
}

const persist = (state: MatchState) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* noop */
  }
}

export type MatchSync = {
  state: MatchState
  dispatch: (action: MatchAction) => void
  connected: boolean
  role: Role
}

export const useMatchSync = (role: Role): MatchSync => {
  const [state, setState] = useState<MatchState>(() => loadStored() ?? createInitialState())
  const [connected, setConnected] = useState(false)
  const stateRef = useRef(state)
  stateRef.current = state
  const channelRef = useRef<BroadcastChannel | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') return

    const channel = new BroadcastChannel(CHANNEL)
    channelRef.current = channel
    setConnected(true)

    channel.onmessage = (event: MessageEvent<Wire>) => {
      const msg = event.data
      if (msg.kind === 'STATE') {
        // 더 최신(rev 큰) 유효 상태만 반영하여 충돌/루프 방지
        if (isValidState(msg.state) && msg.state.rev >= stateRef.current.rev) {
          setState(msg.state)
          persist(msg.state)
        }
      } else if (msg.kind === 'HELLO') {
        channel.postMessage({ kind: 'STATE', state: stateRef.current } satisfies Wire)
      }
    }

    // 늦은 합류 동기화 요청
    channel.postMessage({ kind: 'HELLO' } satisfies Wire)

    return () => {
      channel.close()
      channelRef.current = null
      setConnected(false)
    }
  }, [])

  const dispatch = useCallback(
    (action: MatchAction) => {
      const next = matchReducer(stateRef.current, action)
      if (next === stateRef.current) return
      stateRef.current = next
      setState(next)
      persist(next)
      channelRef.current?.postMessage({ kind: 'STATE', state: next } satisfies Wire)
    },
    []
  )

  return { state, dispatch, connected, role }
}
