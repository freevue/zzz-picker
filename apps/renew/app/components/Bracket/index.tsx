import React, { useState } from 'react'
import { BracketProps } from './types'
import { useBracketData } from './useBracketData'
import { useCanvasPanZoom } from './useCanvasPanZoom'
import MatchCard from './MatchCard'
import BracketLines from './BracketLines'
import BracketHeader from './BracketHeader'
import BracketCreateRoom from './BracketCreateRoom'

const Bracket: React.FC<BracketProps> = (props) => {
  const { bracketState, lockedMap, onUpdatePlayerName, onToggleWinner, onResetBracket } =
    useBracketData(props.storageKey)
  const { transform, isDragging, onMouseDown, onMouseMove, onMouseUp, onWheel } =
    useCanvasPanZoom()

  const [createRoomTarget, setCreateRoomTarget] = useState<{
    playerA: string
    playerB: string
  } | null>(null)

  const onOpenCreateRoom = (playerA: string, playerB: string) => {
    setCreateRoomTarget({ playerA, playerB })
  }

  const onCloseCreateRoom = () => {
    setCreateRoomTarget(null)
  }

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      } ${props.className || ''}`}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onWheel={onWheel}
    >
      <BracketHeader onResetBracket={onResetBracket} />

      <div
        className="absolute origin-center transition-transform duration-75 ease-out"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          left: 'calc(50% - 530px)',
          top: 'calc(50% - 480px)',
          width: '1060px',
          height: '960px',
        }}
      >
        <BracketLines />

        {/* 8강 (Quarterfinals) */}
        <div className="absolute left-0 top-0 flex flex-col gap-10">
          <MatchCard
            match={bracketState['qf-1']}
            isLocked={lockedMap['qf-1']}
            onUpdatePlayerName={onUpdatePlayerName}
            onToggleWinner={onToggleWinner}
            onOpenCreateRoom={onOpenCreateRoom}
          />
          <MatchCard
            match={bracketState['qf-2']}
            isLocked={lockedMap['qf-2']}
            onUpdatePlayerName={onUpdatePlayerName}
            onToggleWinner={onToggleWinner}
            onOpenCreateRoom={onOpenCreateRoom}
          />
          <MatchCard
            match={bracketState['qf-3']}
            isLocked={lockedMap['qf-3']}
            onUpdatePlayerName={onUpdatePlayerName}
            onToggleWinner={onToggleWinner}
            onOpenCreateRoom={onOpenCreateRoom}
          />
          <MatchCard
            match={bracketState['qf-4']}
            isLocked={lockedMap['qf-4']}
            onUpdatePlayerName={onUpdatePlayerName}
            onToggleWinner={onToggleWinner}
            onOpenCreateRoom={onOpenCreateRoom}
          />
        </div>

        {/* 4강 (Semifinals) */}
        <div className="absolute left-[384px] top-[130px] flex flex-col gap-[260px]">
          <MatchCard
            match={bracketState['sf-1']}
            isLocked={lockedMap['sf-1']}
            onUpdatePlayerName={onUpdatePlayerName}
            onToggleWinner={onToggleWinner}
            onOpenCreateRoom={onOpenCreateRoom}
          />
          <MatchCard
            match={bracketState['sf-2']}
            isLocked={lockedMap['sf-2']}
            onUpdatePlayerName={onUpdatePlayerName}
            onToggleWinner={onToggleWinner}
            onOpenCreateRoom={onOpenCreateRoom}
          />
        </div>

        {/* 결승전 (Finals) */}
        <div className="absolute left-[768px] top-[390px]">
          <MatchCard
            match={bracketState['finals']}
            isLocked={lockedMap['finals']}
            onUpdatePlayerName={onUpdatePlayerName}
            onToggleWinner={onToggleWinner}
            onOpenCreateRoom={onOpenCreateRoom}
          />
        </div>
      </div>

      <BracketCreateRoom
        active={createRoomTarget !== null}
        playerA={createRoomTarget?.playerA || ''}
        playerB={createRoomTarget?.playerB || ''}
        onClose={onCloseCreateRoom}
      />
    </div>
  )
}

export default Bracket
