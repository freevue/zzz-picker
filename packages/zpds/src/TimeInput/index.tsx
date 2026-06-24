import React from 'react'

type TimeInputProps = {
  minutes: number
  seconds: number
  milliseconds: number
  onChange: (m: number, s: number, ms: number) => void
  label?: string
  className?: string
}

export const TimeInput: React.FC<TimeInputProps> = ({
  minutes,
  seconds,
  milliseconds,
  onChange,
  label = '클리어 타임 기입 (분 : 초 . 밀리초)',
  className = ''
}) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const min = Math.min(99, Math.max(0, Number(e.target.value)))
    onChange(min, seconds, milliseconds)
  }

  const handleSecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sec = Math.min(59, Math.max(0, Number(e.target.value)))
    onChange(minutes, sec, milliseconds)
  }

  const handleMsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ms = Math.min(99, Math.max(0, Number(e.target.value)))
    onChange(minutes, seconds, ms)
  }

  const isInvalid = minutes === 0 && seconds === 0 && milliseconds === 0

  return (
    <div className={`flex flex-col gap-3 bg-[var(--color-content)] p-4.5 rounded-2xl border border-[var(--color-netural)]/60 shadow-[var(--v3-border-glow)] ${className}`}>
      
      {/* 타이틀 및 기입 유효 상태 지시선 */}
      <div className="flex justify-between items-center text-xs">
        <span className="text-[10px] font-black text-[var(--color-ink)]/50 tracking-wider uppercase">{label}</span>
        <span className={`text-[9px] font-black px-2 py-0.5 rounded tracking-wide ${
          isInvalid 
            ? 'bg-[var(--color-tertiary)]/15 text-[var(--color-tertiary)]' 
            : 'bg-[var(--color-secondary)]/15 text-[var(--color-secondary)]'
        }`}>
          {isInvalid ? '시간 기입 필요' : '입력 완료'}
        </span>
      </div>

      {/* 정밀 분/초/밀리초 휠 기기 입력 구조 */}
      <div className="flex items-center gap-3 bg-[var(--color-base)] p-3 rounded-xl border border-[var(--color-netural)]/80">
        
        {/* 분 */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <input
            type="number"
            value={minutes === 0 ? '' : minutes}
            onChange={handleMinChange}
            placeholder="00"
            className="w-full text-center bg-transparent text-[var(--color-ink)] font-black text-xl outline-none"
          />
          <span className="text-[8px] font-bold text-[var(--color-ink)]/30">MIN</span>
        </div>
        
        <span className="text-xl font-black text-[var(--color-ink)]/30 select-none pb-4">:</span>

        {/* 초 */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <input
            type="number"
            value={seconds === 0 ? '' : seconds}
            onChange={handleSecChange}
            placeholder="00"
            className="w-full text-center bg-transparent text-[var(--color-ink)] font-black text-xl outline-none"
          />
          <span className="text-[8px] font-bold text-[var(--color-ink)]/30">SEC</span>
        </div>

        <span className="text-xl font-black text-[var(--color-ink)]/30 select-none pb-4">.</span>

        {/* 밀리초 */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <input
            type="number"
            value={milliseconds === 0 ? '' : milliseconds}
            onChange={handleMsChange}
            placeholder="00"
            className="w-full text-center bg-transparent text-[var(--color-ink)] font-black text-xl outline-none"
          />
          <span className="text-[8px] font-bold text-[var(--color-ink)]/30">MS</span>
        </div>

      </div>
    </div>
  )
}

export default TimeInput
