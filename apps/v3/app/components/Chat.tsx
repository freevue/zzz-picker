import type { MatchAction, MatchState, Role } from '../data/match'
import React, { useEffect, useRef, useState } from 'react'

const roleName: Record<Role, string> = {
  admin: '관리자(호스트)',
  A: '선수 A',
  B: '선수 B',
}

type Props = {
  state: MatchState
  dispatch: (action: MatchAction) => void
  role: Role
}

export const Chat: React.FC<Props> = ({ state, dispatch, role }) => {
  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [state.chat.length])

  const onSend = (e: React.FormEvent) => {
    e.preventDefault()
    const message = input.trim()
    if (!message) return
    const now = new Date()
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    dispatch({
      type: 'ADD_CHAT',
      message: { id: Date.now(), sender: roleName[role], role, message, time },
    })
    setInput('')
  }

  return (
    <div className="bg-[var(--color-content)] rounded-2xl p-4.5 border border-[var(--color-netural)]/60 flex flex-col gap-3.5 flex-1 min-h-[260px]">
      <span className="text-[10px] font-black text-[var(--color-ink)]/50 tracking-wider uppercase border-b border-[var(--color-netural)] pb-2">
        💬 방송 실시간 중계 대화방
      </span>

      <div
        ref={listRef}
        className="flex-1 overflow-y-auto max-h-[300px] flex flex-col gap-3 pr-2 scrollbar-hidden"
      >
        {state.chat.map((chat) => (
          <div key={chat.id} className="flex flex-col gap-1 text-xs">
            <div className="flex items-center justify-between">
              <span
                className={`font-black ${
                  chat.role === 'admin'
                    ? 'text-[var(--color-primary)]'
                    : chat.role === 'system'
                      ? 'text-[var(--color-ink)]/40'
                      : 'text-[var(--color-secondary)]'
                }`}
              >
                {chat.sender}
              </span>
              <span className="text-[9px] text-[var(--color-ink)]/20 font-mono font-bold">
                {chat.time}
              </span>
            </div>
            <p className="text-[var(--color-ink)]/80 leading-relaxed bg-[var(--color-base)]/30 px-3 py-1.5 rounded-lg border border-[var(--color-netural)]/30">
              {chat.message}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={onSend} className="flex gap-2">
        <input
          type="text"
          placeholder={`${roleName[role]} 메시지 입력...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-[var(--color-base)] text-[var(--color-ink)] text-xs rounded-lg px-3 py-2 outline-none border border-[var(--color-netural)] focus:border-[var(--color-secondary)] transition-all"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[var(--color-secondary)] text-[var(--color-base)] font-bold text-xs rounded-lg hover:opacity-90 transition-all cursor-pointer shadow"
        >
          전송
        </button>
      </form>
    </div>
  )
}

export default Chat
