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
  type TimeValue,
} from '../data/match'
import { useMatchSync } from '../sync/useMatchSync'
import { Chat } from './Chat'
import {
  AgentGrid,
  BanIndicator,
  Body,
  Button,
  ClientOnly,
  CostIndicator,
  Heading,
  NicknameInput,
  ScoreInput,
  Tabs,
  TimeInput,
} from '@zzz-picker/zpds'
import React, { useState } from 'react'

type ControlMode = 'pickA' | 'pickB' | 'banA' | 'banB'

const ROLE_LABEL: Record<Role, string> = {
  admin: '관리자 · 호스트 콘솔',
  A: '선수 A · 참가자',
  B: '선수 B · 참가자',
}

const allowedModes = (role: Role): ControlMode[] => {
  if (role === 'A') return ['pickA', 'banA']
  if (role === 'B') return ['pickB', 'banB']
  return ['pickA', 'pickB', 'banA', 'banB']
}

const fmtTime = (t: TimeValue) =>
  `${String(t.min).padStart(2, '0')}:${String(t.sec).padStart(2, '0')}.${String(t.ms).padStart(2, '0')}`

/** OBS 송출(개인 화면 송출) 영역 플레이스홀더 */
const BroadcastView: React.FC = () => (
  <div className="bg-[var(--color-content)] rounded-2xl p-4 border border-[var(--color-netural)]/60 shadow-[var(--v3-border-glow)] flex flex-col gap-3">
    <span className="text-[10px] font-black text-[var(--color-secondary)] tracking-wider uppercase flex items-center gap-1.5">
      <span className="size-2 bg-[var(--color-primary)] rounded-full animate-ping" />
      LIVE BROADCAST (개인 화면 송출 영역)
    </span>
    <div className="relative w-full aspect-video rounded-xl bg-[#030508] border border-[var(--color-netural)] flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
      <div className="text-center flex flex-col gap-2 z-10">
        <span className="text-xs font-black text-[var(--color-primary)] tracking-widest animate-pulse">
          [ 스트리머 송출 화면 ]
        </span>
        <span className="text-[10px] text-[var(--color-ink)]/30 font-bold">
          RESOLUTION: 1920 × 1080 | 60 FPS
        </span>
      </div>
      <div className="absolute bottom-3 right-3 w-24 sm:w-28 aspect-video bg-[var(--color-content)] border border-[var(--color-secondary)]/30 rounded-lg flex items-center justify-center shadow-lg">
        <span className="text-[8px] font-black text-[var(--color-secondary)]">STREAMER CAM</span>
      </div>
    </div>
  </div>
)

const PickRow: React.FC<{ ids: number[]; pickCount: number; side: Side }> = ({
  ids,
  pickCount,
  side,
}) => {
  const slots = Array.from({ length: pickCount }, (_, i) => ids[i] ?? null)
  return (
    <div className="flex gap-2 flex-wrap">
      {slots.map((id, i) => {
        const agent = id != null ? MOCK_AGENT_MAP.get(id) : null
        return (
          <div
            key={i}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold min-w-[84px]"
            style={{
              borderColor: agent ? `${agent.color}88` : 'var(--color-netural)',
              background: agent ? `${agent.color}22` : 'var(--color-base)',
              color: agent ? 'var(--color-ink)' : 'var(--color-ink)',
            }}
          >
            <span
              className="size-3 rounded-full shrink-0"
              style={{ background: agent ? agent.color : 'var(--color-netural)' }}
            />
            <span className="truncate">
              {agent ? agent.nameKo : `슬롯 ${side}${i + 1}`}
            </span>
          </div>
        )
      })}
    </div>
  )
}

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

  return (
    <div className="flex flex-col gap-3 bg-[var(--color-base)]/40 p-3.5 rounded-2xl border border-[var(--color-netural)]/70">
      <div className="flex items-center justify-between">
        <span className="text-sm font-black tracking-wider" style={{ color: accent }}>
          선수 {side}
          {state.nickname[side] ? ` · ${state.nickname[side]}` : ''}
        </span>
        <span className="text-[10px] font-mono font-bold text-[var(--color-ink)]/30">
          최종 {finalScore.toLocaleString()}점
        </span>
      </div>

      <PickRow ids={state.pick[side]} pickCount={rule.pickCount} side={side} />

      {state.gameType === 'original' && (
        <CostIndicator currentCost={cost} maxCost={rule.costLimit ?? 24} label={`선수 ${side} 코스트`} />
      )}

      {editable ? (
        <>
          <NicknameInput
            side={side}
            nickname={state.nickname[side]}
            onNicknameChange={(v) => dispatch({ type: 'SET_NICKNAME', side, value: v, by: role })}
            onCopyLink={() => {
              if (typeof window !== 'undefined') {
                const url = `${window.location.origin}/play/${side.toLowerCase()}`
                window.navigator?.clipboard?.writeText(url).catch(() => {})
              }
            }}
          />
          <ScoreInput
            value={state.score[side]}
            onChange={(v) => dispatch({ type: 'SET_SCORE', side, value: v, by: role })}
            label={`선수 ${side} 기본 획득 점수`}
          />
          <TimeInput
            minutes={state.time[side].min}
            seconds={state.time[side].sec}
            milliseconds={state.time[side].ms}
            onChange={(min, sec, ms) =>
              dispatch({ type: 'SET_TIME', side, value: { min, sec, ms }, by: role })
            }
            label={`선수 ${side} 클리어 타임`}
          />
        </>
      ) : (
        <div className="flex flex-col gap-2 bg-[var(--color-content)] p-3.5 rounded-xl border border-[var(--color-netural)]/60 text-xs">
          <div className="flex justify-between">
            <span className="text-[var(--color-ink)]/40 font-bold">기본 점수</span>
            <span className="font-mono font-black text-[var(--color-ink)]">
              {state.score[side].toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-ink)]/40 font-bold">클리어 타임</span>
            <span className="font-mono font-black text-[var(--color-ink)]">
              {fmtTime(state.time[side])}
            </span>
          </div>
          <span className="text-[9px] text-[var(--color-ink)]/30 font-bold mt-1">
            🔒 상대 선수 영역 — 보기 전용
          </span>
        </div>
      )}
    </div>
  )
}

const StageInner: React.FC<{ role: Role }> = ({ role }) => {
  const { state, dispatch, connected } = useMatchSync(role)
  const modes = allowedModes(role)
  const [mode, setMode] = useState<ControlMode>(modes[0])
  const rule = GAME_RULES[state.gameType]
  const isAdmin = role === 'admin'

  const onAgentSelect = (id: number) => {
    const side: Side = mode.endsWith('A') ? 'A' : 'B'
    if (mode.startsWith('pick')) dispatch({ type: 'TOGGLE_PICK', side, id, by: role })
    else dispatch({ type: 'TOGGLE_BAN', side, id, by: role })
  }

  const onGameType = (gt: GameType) => {
    if (!isAdmin) return
    dispatch({ type: 'SET_GAME_TYPE', gameType: gt, by: role })
  }

  const modeLabel: Record<ControlMode, string> = {
    pickA: '🔵 A 픽',
    pickB: '🟢 B 픽',
    banA: '🚫 A 밴',
    banB: '🚫 B 밴',
  }

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-hidden bg-[var(--color-base)] text-[var(--color-ink)] p-3 sm:p-5 xl:p-6 flex flex-col gap-5 max-w-[1920px] mx-auto">
      {/* 헤더 */}
      <div className="w-full bg-[var(--color-content)] rounded-2xl p-4 sm:p-5 border border-[var(--color-netural)]/60 shadow-[var(--v3-border-glow)] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-[var(--color-primary)]/5 to-transparent skew-x-12 pointer-events-none" />
        <div className="flex flex-col gap-1 z-10">
          <Heading level="2xl" className="flex items-center gap-2.5 flex-wrap">
            <span>ZZZ-PICKER v3</span>
            <span className="text-[10px] sm:text-xs bg-[var(--color-netural)] px-3 py-1 rounded text-[var(--color-secondary)] font-bold tracking-widest border border-[var(--color-secondary)]/20">
              {ROLE_LABEL[role]}
            </span>
            <span
              className={`text-[10px] px-2 py-1 rounded font-bold tracking-wide border ${
                connected
                  ? 'text-[var(--color-secondary)] border-[var(--color-secondary)]/30 bg-[var(--color-secondary)]/10'
                  : 'text-[var(--color-ink)]/40 border-[var(--color-netural)]'
              }`}
            >
              {connected ? '● SYNC 연결됨' : '○ 연결 대기'}
            </span>
          </Heading>
          <Body size="sm" className="text-[var(--color-ink)]/50">
            관리자 / A / B 화면이 동일 규격으로 실시간 동기화됩니다 (현재 mock 데이터).
          </Body>
        </div>

        {/* 경기 타입 전환 (관리자 전용, 경기 중에도 변경 가능) */}
        <div className="z-10 flex flex-col gap-1 w-full lg:w-[420px]">
          <div className={isAdmin ? '' : 'opacity-60 pointer-events-none'}>
            <Tabs
              value={state.gameType}
              onChange={(v) => onGameType(v as GameType)}
              list={GAME_TYPE_LIST.map((gt) => ({ value: gt, label: GAME_RULES[gt].short }))}
            />
          </div>
          <span className="text-[9px] text-[var(--color-ink)]/40 font-bold pl-1">
            {isAdmin
              ? '경기 타입을 변경하면 모든 화면에 즉시 반영됩니다 (픽 유지).'
              : `현재 경기 타입: ${rule.label} — 변경은 관리자만 가능`}
          </span>
        </div>
      </div>

      {/* 본문 2열 */}
      <div className="w-full flex flex-col xl:flex-row gap-5 flex-1">
        {/* 좌측: 송출 + 채팅 */}
        <div className="w-full xl:w-[34%] flex flex-col gap-5">
          <BroadcastView />
          <Chat state={state} dispatch={dispatch} role={role} />
        </div>

        {/* 우측: 경기판 */}
        <div className="w-full xl:w-[66%] bg-[var(--color-content)] rounded-2xl p-4 sm:p-5 border border-[var(--color-netural)]/60 shadow-[var(--v3-border-glow)] flex flex-col gap-5">
          {/* 밴 현황 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BanIndicator banList={state.ban.A} side="A" label="A팀 밴 카드" />
            <BanIndicator banList={state.ban.B} side="B" label="B팀 밴 카드" />
          </div>

          {/* 보스 선택 (관리자) */}
          <div className="bg-[var(--color-base)]/50 p-4 rounded-xl border border-[var(--color-netural)] flex flex-col gap-2.5">
            <span className="text-[10px] font-black text-[var(--color-ink)]/40 tracking-wider uppercase">
              👹 공용 보스 선택 {isAdmin ? '' : '(관리자 전용)'}
            </span>
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
          </div>

          {/* A / B 패널 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SidePanel
              side="A"
              state={state}
              dispatch={dispatch}
              editable={isAdmin || role === 'A'}
              role={role}
            />
            <SidePanel
              side="B"
              state={state}
              dispatch={dispatch}
              editable={isAdmin || role === 'B'}
              role={role}
            />
          </div>

          {/* 조작 모드 */}
          <div className="flex flex-col gap-2.5 bg-[var(--color-base)]/30 p-4 rounded-xl border border-[var(--color-netural)]/50">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-[10px] font-black text-[var(--color-ink)]/40 tracking-wider uppercase">
                🕹️ 그리드 클릭 조작 모드
              </span>
              {isAdmin && (
                <Button size="sm" variant="neutral" onClick={() => dispatch({ type: 'RESET', by: role })}>
                  세션 초기화
                </Button>
              )}
            </div>
            <div className={`grid grid-cols-2 ${modes.length > 2 ? 'sm:grid-cols-4' : 'sm:grid-cols-2'} gap-2`}>
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
                  {modeLabel[m]}
                </Button>
              ))}
            </div>
            <span className="text-[9px] text-[var(--color-ink)]/50 font-semibold leading-relaxed mt-1">
              💡 아래 에이전트를 클릭하면 [{modeLabel[mode]}] 동작이 적용되며 모든 화면에 동기화됩니다.
              {rule.banCount === 0 && ' (현재 경기 타입은 밴이 없습니다)'}
            </span>
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
    fallback={
      <div className="w-full h-full flex items-center justify-center bg-[var(--color-base)] text-[var(--color-ink)]/40 text-sm font-bold">
        V3 동기화 콘솔 로딩 중...
      </div>
    }
  >
    {() => <StageInner role={role} />}
  </ClientOnly>
)

export default BroadcastStage
