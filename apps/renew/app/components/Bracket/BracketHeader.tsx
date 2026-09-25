import React from 'react'

type Props = {
  onResetBracket: () => void
}

const BracketHeader: React.FC<Props> = (props) => {
  return (
    <header className="absolute top-4 right-4 z-20 pointer-events-auto">
      <button
        type="button"
        onClick={props.onResetBracket}
        className="px-5 py-2.5 rounded-full text-sm font-bold ft-pre bg-elevated/90 hover:bg-destructive text-ink hover:text-[#16181f] transition-all shadow-xl cursor-pointer active:scale-95"
      >
        대진표 초기화
      </button>
    </header>
  )
}

export default BracketHeader
