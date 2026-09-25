import { useEffect, useMemo, useRef, useState } from 'react'
import { BracketState, MatchId, WinnerSide, NextMatchTarget } from './types'

const DEFAULT_STORAGE_KEY = 'zzz-bracket-data-v1'

export const INITIAL_BRACKET_STATE: BracketState = {
  'qf-1': { id: 'qf-1', round: 'QF', title: '8강 1경기', playerA: '', playerB: '', winner: null },
  'qf-2': { id: 'qf-2', round: 'QF', title: '8강 2경기', playerA: '', playerB: '', winner: null },
  'qf-3': { id: 'qf-3', round: 'QF', title: '8강 3경기', playerA: '', playerB: '', winner: null },
  'qf-4': { id: 'qf-4', round: 'QF', title: '8강 4경기', playerA: '', playerB: '', winner: null },
  'sf-1': { id: 'sf-1', round: 'SF', title: '4강 1경기', playerA: '', playerB: '', winner: null },
  'sf-2': { id: 'sf-2', round: 'SF', title: '4강 2경기', playerA: '', playerB: '', winner: null },
  finals: { id: 'finals', round: 'F', title: '결승전', playerA: '', playerB: '', winner: null },
}

export const NEXT_MATCH_MAP: Record<MatchId, NextMatchTarget | null> = {
  'qf-1': { nextMatchId: 'sf-1', targetSlot: 'A' },
  'qf-2': { nextMatchId: 'sf-1', targetSlot: 'B' },
  'qf-3': { nextMatchId: 'sf-2', targetSlot: 'A' },
  'qf-4': { nextMatchId: 'sf-2', targetSlot: 'B' },
  'sf-1': { nextMatchId: 'finals', targetSlot: 'A' },
  'sf-2': { nextMatchId: 'finals', targetSlot: 'B' },
  finals: null,
}

export const useBracketData = (storageKey = DEFAULT_STORAGE_KEY) => {
  // SSR Hydration 불일치를 방지하기 위해 초기값은 항상 정적 기본값으로 시작
  const [bracketState, setBracketState] = useState<BracketState>(INITIAL_BRACKET_STATE)
  const isHydratedRef = useRef(false)

  // 클라이언트 마운트 시점에 로컬스토리지 복원
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const saved = window.localStorage.getItem(storageKey)
      if (saved) {
        setBracketState(JSON.parse(saved))
      }
    } catch (e) {
      console.error('Failed to load bracket from localStorage', e)
    } finally {
      isHydratedRef.current = true
    }
  }, [storageKey])

  // 마운트 이후 변경된 상태만 로컬스토리지에 저장 (초기 빈 상태로 덮어쓰기 방지)
  useEffect(() => {
    if (!isHydratedRef.current || typeof window === 'undefined') return
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(bracketState))
    } catch (error) {
      console.error('Failed to save bracket to localStorage', error)
    }
  }, [bracketState, storageKey])

  const lockedMap = useMemo<Record<MatchId, boolean>>(() => {
    return {
      'qf-1': bracketState['sf-1'].winner !== null,
      'qf-2': bracketState['sf-1'].winner !== null,
      'qf-3': bracketState['sf-2'].winner !== null,
      'qf-4': bracketState['sf-2'].winner !== null,
      'sf-1': bracketState['finals'].winner !== null,
      'sf-2': bracketState['finals'].winner !== null,
      finals: false,
    }
  }, [bracketState])

  const onUpdatePlayerName = (matchId: MatchId, slot: 'A' | 'B', name: string) => {
    setBracketState((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [slot === 'A' ? 'playerA' : 'playerB']: name,
      },
    }))
  }

  const onToggleWinner = (matchId: MatchId, side: WinnerSide) => {
    if (!side) return
    const currentMatch = bracketState[matchId]
    const nextTarget = NEXT_MATCH_MAP[matchId]
    const isTogglingOff = currentMatch.winner === side
    const nextWinner: WinnerSide = isTogglingOff ? null : side
    const winnerName = isTogglingOff
      ? ''
      : side === 'A'
        ? currentMatch.playerA
        : currentMatch.playerB

    setBracketState((prev) => {
      const updated = {
        ...prev,
        [matchId]: {
          ...prev[matchId],
          winner: nextWinner,
        },
      }

      if (nextTarget) {
        const targetKey = nextTarget.targetSlot === 'A' ? 'playerA' : 'playerB'
        updated[nextTarget.nextMatchId] = {
          ...updated[nextTarget.nextMatchId],
          [targetKey]: winnerName,
        }
      }

      return updated
    })
  }

  const onResetBracket = () => {
    if (typeof window === 'undefined') return
    const ok = window.confirm('대진표 데이터를 초기화하시겠습니까?')
    if (!ok) return
    setBracketState(INITIAL_BRACKET_STATE)
    try {
      window.localStorage.removeItem(storageKey)
    } catch (e) {
      console.error(e)
    }
  }

  return {
    bracketState,
    lockedMap,
    onUpdatePlayerName,
    onToggleWinner,
    onResetBracket,
  }
}
