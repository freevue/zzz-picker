import React from 'react'
import { MatchData, MatchId, WinnerSide } from './types'
import PlayerSlot from './PlayerSlot'

type Props = {
  match: MatchData
  isLocked: boolean
  onUpdatePlayerName: (matchId: MatchId, slot: 'A' | 'B', name: string) => void
  onToggleWinner: (matchId: MatchId, side: WinnerSide) => void
  onOpenCreateRoom: (playerA: string, playerB: string) => void
}

const MatchCard: React.FC<Props> = (props) => {
  const canPlay = Boolean(props.match.playerA.trim() && props.match.playerB.trim())
  const isButtonsDisabled = props.isLocked || !canPlay

  const onUpdateNameA = (name: string) => {
    props.onUpdatePlayerName(props.match.id, 'A', name)
  }

  const onUpdateNameB = (name: string) => {
    props.onUpdatePlayerName(props.match.id, 'B', name)
  }

  const onToggleWinA = () => {
    props.onToggleWinner(props.match.id, 'A')
  }

  const onToggleWinB = () => {
    props.match.winner === 'B'
      ? props.onToggleWinner(props.match.id, null)
      : props.onToggleWinner(props.match.id, 'B')
  }

  const onStartMatch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    props.onOpenCreateRoom(props.match.playerA, props.match.playerB)
  }

  const onCardMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  return (
    <div
      onMouseDown={onCardMouseDown}
      className={`w-72 bg-content rounded-3xl p-4 shadow-2xl flex flex-col gap-2.5 transition-all ${
        props.isLocked ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-black ft-ria text-secondary tracking-wider">
          {props.match.title}
        </span>
        <button
          type="button"
          disabled={!canPlay || props.isLocked}
          onClick={onStartMatch}
          className={`px-3 py-1 rounded-full text-[11px] font-black ft-pre transition-all ${
            canPlay && !props.isLocked
              ? 'bg-primary hover:bg-primary/90 text-[#16181f] cursor-pointer active:scale-95 shadow-sm'
              : 'bg-neutral/50 text-disabled cursor-not-allowed opacity-40'
          }`}
        >
          경기 진행
        </button>
      </div>

      <PlayerSlot
        slot="A"
        name={props.match.playerA}
        isWinner={props.match.winner === 'A'}
        isLoser={props.match.winner === 'B'}
        disabled={isButtonsDisabled}
        onNameChange={onUpdateNameA}
        onToggleWin={onToggleWinA}
      />

      <div className="flex items-center justify-center my-0.5">
        <span className="text-xs font-black ft-ria text-disabled/60 tracking-widest select-none">
          VS
        </span>
      </div>

      <PlayerSlot
        slot="B"
        name={props.match.playerB}
        isWinner={props.match.winner === 'B'}
        isLoser={props.match.winner === 'A'}
        disabled={isButtonsDisabled}
        onNameChange={onUpdateNameB}
        onToggleWin={onToggleWinB}
      />
    </div>
  )
}

export default MatchCard
