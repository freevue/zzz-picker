export type MatchId = 'qf-1' | 'qf-2' | 'qf-3' | 'qf-4' | 'sf-1' | 'sf-2' | 'finals'

export type RoundType = 'QF' | 'SF' | 'F'

export type WinnerSide = 'A' | 'B' | null

export type MatchData = {
  id: MatchId
  round: RoundType
  title: string
  playerA: string
  playerB: string
  winner: WinnerSide
}

export type BracketState = Record<MatchId, MatchData>

export type NextMatchTarget = {
  nextMatchId: MatchId
  targetSlot: 'A' | 'B'
}

export type PreviousMatches = {
  prevMatchAId: MatchId
  prevMatchBId: MatchId
}

export type BracketProps = {
  storageKey?: string
  className?: string
}
