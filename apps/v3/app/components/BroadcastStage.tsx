import { MOCK_AGENT_MAP, MOCK_BOSS, MOCK_GRID_AGENTS } from '../data/mock'
import {
  GAME_RULES,
  GAME_TYPE_LIST,
  getSideCost,
  getSideScore,
  type GameType,
  type MatchAction,
  type MatchState,
  type Role,
  type Side,
} from '../data/match'
import { useMatchSync } from '../sync/useMatchSync'
import { AgentGrid, BanIndicator, Button, ClientOnly } from '@zzz-picker/zpds'
import React, { useState } from 'react'

type ControlMode = 'pickA' | 'pickB' | 'banA' | 'banB'

const ROLE_LABEL: Record<Role, string> = { admin: '관리자', A: '선수 A', B: '선수 B' }

const allowedModes = (role: Role): ControlMode[] => {
  if (role === 'A') return ['pickA', 'banA']
  if (role === 'B') return ['pickB', 'banB']
  return ['pickA', 'pickB', 'banA', 'banB']
}

const MODE_LABEL: Record<ControlMode, string> = {
  pickA: 'A 픽',
  pickB: 'B 픽',
  banA: 'A 밴',
  banB: 'B 밴',
}

/** 스트리머가 OBS에서 자기 송출 화면/채팅창을 올려둘 빈 배치 자리 */
const PlacementSlot: React.FC<{ label: string; className?: string }> = ({ label, className = '' }) => (
  <div
    className={`relative rounded-2xl border-2 border-dashed border-[var(--color-netural)] bg-[var(--color-content)]/30 flex items-center justify-center ${className}`}
  >
    <span className="absolute left-3 top-2.5 text-[10px] font-black tracking-widest text-[var(--color-ink)]/35 uppercase">
      {label}
    </span>
    <span className="text-[11px] font-bold text-[var(--color-ink)]/20 tracking-wider">{label} 배치 영역</span>
  </div>
)

const PickChips: React.FC<{ ids: number[]; count: number; side: Side }> = ({ ids, count, side }) => {
  const slots = Array.from({ length: count }, (_, i) => ids[i] ?? null)
  return (
    <div className="flex gap-1.5 flex-wrap">
      {slots.map((id, i) => {
        const agent = id != null ? MOCK_AGENT_MAP.get(id) : null
        return (
          <div
            key={i}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-xs font-bold min-w-[64px]"
            style={{
              borderColor: agent ? `${agent.color}88` : 'var(--color-netural)',
              background: agent ? `${agent.color}22` : 'var(--color-base)',
            }}
          >
            <span
              className="size-3 rounded-full shrink-0"
              style={{ background: agent ? agent.color : 'var(--color-netural)' }}
            />
            <span className="truncate text-[var(--color-ink)]/80">{agent ? agent.nameKo : `${side}${i + 1}`}</span>
          </div>
        )
      })}
    </div>
  )
}

const StepButton: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className="px-2 py-1.5 rounded-lg bg-[var(--color-base)] text-xs font-bold text-[var(--color-ink)]/70 border border-[var(--color-netural)] hover:text-[var(--color-secondary)] cursor-pointer"
  >
    {children}
  </button>
)

const SidePanel: React.FC<{
  side: Side
  state: MatchState
  dispatch: (a: MatchAction) => void
  editable: boolean
  role: Role
}> = ({ side, state, dispatch, editable, role }) => {
  const rule = GAME_RULES[state.gameType]
  const finalScore = getSideScore(state, side)
  const cost = getSideCost(state.pick[side])
  const accent = side === 'A' ? 'var(--color-primary)' : 'var(--color-secondary)'
  const over = rule.costLimit != null && cost > rule.costLimit
  const t = state.time[side]
  const setScore = (v: number) => dispatch({ type: 'SET_SCORE', side, value: v, by: role })
  const setTime = (m: number, s: number) =>
    dispatch({ type: 'SET_TIME', side, value: { min: m, sec: s, ms: 0 }, by: role })

  return (
    <div className="flex flex-col gap-3 bg-[var(--color-base)]/40 p-3.5 rounded-2xl border border-[var(--color-netural)]/70">
      {/* 헤더: 측 + 최종점수 */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-black" style={{ color: accent }}>
          {side}
        </span>
        <span className="font-mono text-sm font-black" style={{ color: accent }}>
          {finalScore.toLocaleString()}
        </span>
      </div>

      {/* 닉네임: 단순 입력 */}
      {editable ? (
        <input
          value={state.nickname[side]}
          onChange={(e) => dispatch({ type: 'SET_NICKNAME', side, value: e.target.value, by: role })}
          placeholder={`${side} 닉네임`}
          className="w-full bg-[var(--color-base)] text-[var(--color-ink)] text-xs font-bold rounded-lg px-3 py-2 outline-none border border-[var(--color-netural)] focus:border-[var(--color-secondary)]"
        />
      ) : (
        <div className="w-full bg-[var(--color-content)] text-[var(--color-ink)]/70 text-xs font-bold rounded-lg px-3 py-2 border border-[var(--color-netural)]/60 truncate">
          {state.nickname[side] || `${side} 닉네임`}
        </div>
      )}

      {/* 픽 슬롯 */}
      <PickChips ids={state.pick[side]} count={rule.pickCount} side={side} />

      {/* 코스트 게이지 (자동) */}
      {state.gameType === 'original' && (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-[var(--color-base)] rounded-full overflow-hidden border border-[var(--color-netural)]/60">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, (cost / (rule.costLimit ?? 24)) * 100)}%`,
                background: over ? 'var(--color-tertiary)' : 'var(--color-secondary)',
              }}
            />
          </div>
          <span
            className="font-mono text-xs font-black shrink-0"
            style={{ color: over ? 'var(--color-tertiary)' : 'var(--color-ink)' }}
          >
            {cost}/{rule.costLimit}
          </span>
        </div>
      )}

      {/* 점수: 버튼 */}
      {editable && (
        <div className="flex items-center gap-1.5">
          <StepButton onClick={() => setScore(state.score[side] - 1000)}>-1k</StepButton>
          <StepButton onClick={() => setScore(state.score[side] - 100)}>-100</StepButton>
          <span className="flex-1 text-center font-mono text-base font-black text-[var(--color-ink)]">
            {state.score[side].toLocaleString()}
          </span>
          <StepButton onClick={() => setScore(state.score[side] + 100)}>+100</StepButton>
          <StepButton onClick={() => setScore(state.score[side] + 1000)}>+1k</StepButton>
        </div>
      )}

      {/* 시간: 버튼 */}
      {editable && (
        <div className="flex items-center gap-1.5">
          <StepButton onClick={() => setTime(Math.max(0, t.min - 1), t.sec)}>분-</StepButton>
          <StepButton onClick={() => setTime(t.min + 1, t.sec)}>분+</StepButton>
          <span className="flex-1 text-center font-mono text-base font-black text-[var(--color-ink)]">
            {String(t.min).padStart(2, '0')}:{String(t.sec).padStart(2, '0')}
          </span>
          <StepButton onClick={() => setTime(t.min, Math.max(0, t.sec - 10))}>초-</StepButton>
          <StepButton onClick={() => setTime(t.min, Math.min(59, t.sec + 10))}>초+</StepButton>
        </div>
      )}
    </div>
  )
}

const StageInner: React.FC<{ role: Role }> = ({ role }) => {
  const { state, dispatch, connected } = useMatchSync(role)
  const modes = allowedModes(role)
  const [mode, setMode] = useState<ControlMode>(modes[0])
  const isAdmin = role === 'admin'

  const onAgentSelect = (id: number) => {
    const side: Side = mode.endsWith('A') ? 'A' : 'B'
    if (mode.startsWith('pick')) dispatch({ type: 'TOGGLE_PICK', side, id, by: role })
    else dispatch({ type: 'TOGGLE_BAN', side, id, by: role })
  }

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-hidden bg-[var(--color-base)] text-[var(--color-ink)] p-3 sm:p-5 xl:p-6 flex flex-col gap-4 max-w-[1920px] mx-auto">
      {/* 헤더 */}
      <div className="w-full bg-[var(--color-content)] rounded-2xl px-4 py-3 border border-[var(--color-netural)]/60 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="text-lg font-black text-[var(--color-primary)] tracking-wide">v3</span>
          <span className="text-[10px] bg-[var(--color-netural)] px-2.5 py-1 rounded font-bold tracking-widest text-[var(--color-secondary)]">
            {ROLE_LABEL[role]}
          </span>
          <span
            className={`size-2.5 rounded-full ${connected ? 'bg-[var(--color-secondary)]' : 'bg-[var(--color-netural)]'}`}
            title={connected ? 'SYNC' : 'OFFLINE'}
          />
        </div>

        {/* 경기 타입: 단순 버튼 (관리자만) */}
        <div className={`flex gap-2 ${isAdmin ? '' : 'opacity-60 pointer-events-none'}`}>
          {GAME_TYPE_LIST.map((gt) => (
            <Button
              key={gt}
              size="sm"
              variant={state.gameType === gt ? 'primary' : 'neutral'}
              onClick={() => isAdmin && dispatch({ type: 'SET_GAME_TYPE', gameType: gt, by: role })}
            >
              {GAME_RULES[gt].short}
            </Button>
          ))}
        </div>
      </div>

      {/* 본문 2열 */}
      <div className="w-full flex flex-col xl:flex-row gap-4 flex-1">
        {/* 좌측: 스트리머 배치 자리 (송출 + 채팅) */}
        <div className="w-full xl:w-[32%] flex flex-col gap-4">
          <PlacementSlot label="방송 화면" className="aspect-video" />
          <PlacementSlot label="채팅" className="flex-1 min-h-[240px]" />
        </div>

        {/* 우측: 경기판 */}
        <div className="w-full xl:w-[68%] bg-[var(--color-content)] rounded-2xl p-4 border border-[var(--color-netural)]/60 flex flex-col gap-4">
          {/* 밴 */}
          <div className="grid grid-cols-2 gap-3">
            <BanIndicator banList={state.ban.A} side="A" label="A 밴" />
            <BanIndicator banList={state.ban.B} side="B" label="B 밴" />
          </div>

          {/* 보스: 단순 버튼 */}
          <div className="flex flex-wrap gap-2">
            {MOCK_BOSS.map((b) => (
              <Button
                key={b.id}
                size="sm"
                variant={state.boss === b.id ? 'primary' : 'neutral'}
                disabled={!isAdmin}
                onClick={() => dispatch({ type: 'SET_BOSS', id: b.id, by: role })}
              >
                {b.nameKo}
              </Button>
            ))}
          </div>

          {/* A / B */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <SidePanel side="A" state={state} dispatch={dispatch} editable={isAdmin || role === 'A'} role={role} />
            <SidePanel side="B" state={state} dispatch={dispatch} editable={isAdmin || role === 'B'} role={role} />
          </div>

          {/* 조작 모드: 단순 버튼 */}
          <div className="flex items-center gap-2 flex-wrap">
            {modes.map((m) => (
              <Button
                key={m}
                size="sm"
                variant={mode === m ? (m.startsWith('ban') ? 'neutral' : 'primary') : 'neutral'}
                className={
                  mode === m && m.startsWith('ban')
                    ? 'border-[var(--color-tertiary)]! text-[var(--color-tertiary)]!'
                    : ''
                }
                onClick={() => setMode(m)}
              >
                {MODE_LABEL[m]}
              </Button>
            ))}
            {isAdmin && (
              <Button
                size="sm"
                variant="neutral"
                className="ml-auto"
                onClick={() => dispatch({ type: 'RESET', by: role })}
              >
                초기화
              </Button>
            )}
          </div>

          {/* 에이전트 그리드 */}
          <AgentGrid
            agents={MOCK_GRID_AGENTS}
            banList={[...state.ban.A, ...state.ban.B]}
            pickList={[...state.pick.A, ...state.pick.B]}
            activeId={null}
            onSelect={onAgentSelect}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  )
}

export const BroadcastStage: React.FC<{ role: Role }> = ({ role }) => (
  <ClientOnly
    fallback={<div className="w-full h-full bg-[var(--color-base)]" />}
  >
    {() => <StageInner role={role} />}
  </ClientOnly>
)

export default BroadcastStage
