import React from 'react'
import { Input } from '../Input'
import { Button } from '../Button'

type NicknameInputProps = {
  nickname: string
  onNicknameChange: (val: string) => void
  onCopyLink: () => void
  side: 'A' | 'B'
  label?: string
  placeholder?: string
  className?: string
}

export const NicknameInput: React.FC<NicknameInputProps> = ({
  nickname,
  onNicknameChange,
  onCopyLink,
  side,
  label,
  placeholder = '선수 닉네임을 입력하세요',
  className = ''
}) => {
  const defaultLabel = label || `선수 ${side} (Side ${side})`
  const hasNickname = nickname.trim().length > 0

  return (
    <div className={`flex flex-col gap-3.5 bg-[var(--color-content)] p-4.5 rounded-2xl border border-[var(--color-netural)]/60 shadow-[var(--v3-border-glow)] ${className}`}>
      
      {/* 라벨 헤더 */}
      <div className="flex justify-between items-center text-xs">
        <span className="font-bold text-[var(--color-ink)]/70">{defaultLabel}</span>
        <span className="text-[9px] text-[var(--color-ink)]/30 font-mono font-bold">SIDE_{side}</span>
      </div>

      {/* 인풋 필드 */}
      <Input
        type="text"
        placeholder={placeholder}
        value={nickname}
        onChange={(e) => onNicknameChange(e.target.value)}
        themeColor={side === 'A' ? 'primary' : 'secondary'}
        className="w-full text-sm font-bold"
      />

      {/* 동적 링크 복사 버튼 */}
      <Button
        onClick={onCopyLink}
        disabled={!hasNickname}
        variant={side === 'A' ? 'primary' : 'secondary'}
        className={`w-full text-xs font-black py-2.5 flex items-center justify-center gap-1.5 transition-all duration-300 ${
          hasNickname 
            ? 'shadow-[var(--v3-border-glow)]' 
            : 'grayscale'
        }`}
      >
        <span>🔗</span>
        <span>참가 경로 복사</span>
      </Button>

      {/* 안내 툴팁 */}
      {!hasNickname && (
        <span className="text-[10px] text-[var(--color-tertiary)]/70 font-bold self-start mt-0.5 flex items-center gap-1">
          <span>ℹ️</span> 닉네임을 입력하시면 참가 경로 복사가 활성화됩니다.
        </span>
      )}
    </div>
  )
}

export default NicknameInput
