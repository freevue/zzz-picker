import { MOCK_AGENTS, MOCK_AGENT_MAP, MOCK_BOSS, MOCK_BOSS_MAP, isBanEligible } from '../data/mock'
import {
  GAME_RULES,
  GAME_TYPE_LIST,
  PICK_PER_PARTY,
  getFinalScore,
  getUsedCost,
  type GameType,
  type MatchAction,
  type MatchState,
  type Role,
  type RoundIdx,
  type Side,
} from '../data/match'
import { useMatchSync } from '../sync/useMatchSync'
import React, { useState } from 'react'

const ROLE_LABEL: Record<Role, string> = { admin: '관리자', A: '선수 A', B: '선수 B' }
const sideAccent = (s: Side) => (s === 'A' ? 'var(--color-primary)' : 'var(--color-secondary)')

/* ---------- 작은 표현 컴포넌트 ---------- */

const Pill: React.FC<{ active?: boolean; accent?: string; onClick?: () => void; disabled?: boolean; children: React.ReactNode }> = ({
  active,
  accent = 'var(--color-primary)',
  onClick,
  disabled,
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="px-3.5 py-2 rounded-2xl text-xs font-bold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
    style={{
      background: active ? accent : 'var(--color-netural)',
      color: active ? '#16181f' : 'var(--color-ink)',
      boxShadow: active ? '0 6px 18px -8px ' + accent : 'none',
    }}
  >
    {children}
  </button>
)

const AgentTile: React.FC<{
  id: number
  banned?: boolean
  picked?: boolean
  dim?: boolean
  onClick?: () => void
}> = ({ id, banned, picked, dim, onClick }) => {
  const a = MOCK_AGENT_MAP.get(id)
  if (!a) return null
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex flex-col items-center gap-1 p-2 rounded-[18px] transition-all duration-200 cursor-pointer"
      style={{
        background: `linear-gradient(160deg, ${a.color}38 0%, var(--color-content) 70%)`,
        outline: picked ? `2px solid ${a.color}` : 'none',
        outlineOffset: '-2px',
        opacity: banned || dim ? 0.32 : 1,
        filter: banned ? 'grayscale(0.8)' : 'none',
      }}
    >
      <div className="w-full aspect-square rounded-[12px] flex items-end justify-center overflow-hidden" style={{ background: `${a.color}55` }}>
        <span className="text-[10px] font-black pb-1" style={{ color: '#11131a' }}>
          {a.rarity}
        </span>
      </div>
      <span className="text-[11px] font-bold text-[var(--color-ink)]/85 truncate max-w-full">{a.nameKo}</span>
      {a.isPickup && a.rarity === 'S' && (
        <span className="absolute top-1.5 right-1.5 size-2 rounded-full" style={{ background: a.color }} />
      )}
    </button>
  )
}

/* ---------- 파티(라운드별) 카드 ---------- */

const StepBtn: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className="size-7 rounded-xl bg-[var(--color-netural)] text-[var(--color-ink)]/70 text-xs font-black hover:text-[var(--color-ink)] cursor-pointer flex items-center justify-center"
  >
    {children}
  </button>
)

const PartyCard: React.FC<{
  side: Side
  round: RoundIdx
  state: MatchState
  dispatch: (a: MatchAction) => void
  editable: boolean
  isTarget: boolean
  onTarget: () => void
}> = ({ side, round, state, dispatch, editable, isTarget, onTarget }) => {
  const accent = sideAccent(side)
  const party = state.rounds[side][round]
  const rule = GAME_RULES[state.gameType]
  const commonBoss = rule.commonR2Boss && round === 1
  const score = state.score[side][round]
  const time = state.time[side][round]

  return (
    <div
      className="flex flex-col gap-2.5 p-3 rounded-[20px] transition-all duration-200"
      style={{
        background: isTarget ? `linear-gradient(160deg, ${accent}26, var(--color-content))` : 'var(--color-content)',
        outline: isTarget ? `2px solid ${accent}` : 'none',
        outlineOffset: '-2px',
      }}
    >
      <button type="button" onClick={onTarget} disabled={!editable} className="flex items-center justify-between cursor-pointer disabled:cursor-default">
        <span className="text-xs font-black" style={{ color: accent }}>
          {side}
        </span>
        {editable && (
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: isTarget ? accent : 'var(--color-netural)', color: isTarget ? '#16181f' : 'var(--color-ink)' }}>
            {isTarget ? '선택중' : '여기 픽'}
          </span>
        )}
      </button>

      {/* 픽 슬롯 3개 */}
      <div className="grid grid-cols-3 gap-1.5">
        {Array.from({ length: PICK_PER_PARTY }, (_, i) => {
          const id = party.picks[i]
          const a = id != null ? MOCK_AGENT_MAP.get(id) : null
          return (
            <div
              key={i}
              className="aspect-square rounded-[12px] flex items-center justify-center text-[10px] font-bold"
              style={{
                background: a ? `linear-gradient(160deg, ${a.color}66, ${a.color}22)` : 'var(--color-netural)',
                color: a ? '#12141b' : 'var(--color-ink)',
              }}
            >
              {a ? a.nameKo : ''}
            </div>
          )
        })}
      </div>

      {/* 보스 */}
      <div className="flex items-center gap-1 flex-wrap">
        {MOCK_BOSS.map((b) => {
          const on = party.boss === b.id
          return (
            <button
              key={b.id}
              type="button"
              disabled={!editable}
              onClick={() => dispatch({ type: 'SET_BOSS', side, round, id: b.id, by: state.updatedBy })}
              className="px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer disabled:cursor-default transition-all"
              style={{ background: on ? accent : 'var(--color-netural)', color: on ? '#16181f' : 'var(--color-ink)' }}
            >
              {b.nameKo}
            </button>
          )
        })}
        {commonBoss && <span className="text-[9px] text-[var(--color-ink)]/35 font-bold ml-auto">공통</span>}
      </div>

      {/* 점수 / 시간 (간단 버튼) */}
      {editable && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <StepBtn onClick={() => dispatch({ type: 'SET_SCORE', side, round, value: score - 1000, by: state.updatedBy })}>−</StepBtn>
            <span className="flex-1 text-center font-mono text-sm font-black text-[var(--color-ink)]">{score.toLocaleString()}</span>
            <StepBtn onClick={() => dispatch({ type: 'SET_SCORE', side, round, value: score + 1000, by: state.updatedBy })}>＋</StepBtn>
            <span className="text-[9px] text-[var(--color-ink)]/35 font-bold w-8 text-right">점수</span>
          </div>
          <div className="flex items-center gap-1.5">
            <StepBtn onClick={() => dispatch({ type: 'SET_TIME', side, round, value: { min: time.min, sec: Math.max(0, time.sec - 10) }, by: state.updatedBy })}>−</StepBtn>
            <span className="flex-1 text-center font-mono text-sm font-black text-[var(--color-ink)]">
              {String(time.min).padStart(2, '0')}:{String(time.sec).padStart(2, '0')}
            </span>
            <StepBtn onClick={() => dispatch({ type: 'SET_TIME', side, round, value: { min: time.min, sec: Math.min(59, time.sec + 10) }, by: state.updatedBy })}>＋</StepBtn>
            <span className="text-[9px] text-[var(--color-ink)]/35 font-bold w-8 text-right">시간</span>
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- 좌측 스코어보드 ---------- */

const ScoreCard: React.FC<{ side: Side; state: MatchState; dispatch: (a: MatchAction) => void; editable: boolean }> = ({ side, state, dispatch, editable }) => {
  const accent = sideAccent(side)
  const rule = GAME_RULES[state.gameType]
  const cost = getUsedCost(state, side)
  const limit = rule.costLimit
  const ratio = limit ? Math.min(100, (cost / limit) * 100) : 0
  const over = limit != null && cost > limit

  return (
    <div className="flex flex-col gap-2 p-3.5 rounded-[20px]" style={{ background: `linear-gradient(160deg, ${accent}1f, var(--color-content))` }}>
      <div className="flex items-center justify-between">
        {editable ? (
          <input
            value={state.nickname[side]}
            onChange={(e) => dispatch({ type: 'SET_NICKNAME', side, value: e.target.value, by: state.updatedBy })}
            placeholder={`${side} 닉네임`}
            className="bg-transparent text-sm font-black outline-none w-28"
            style={{ color: accent }}
          />
        ) : (
          <span className="text-sm font-black truncate" style={{ color: accent }}>
            {state.nickname[side] || side}
          </span>
        )}
        <span className="font-mono text-lg font-black" style={{ color: accent }}>
          {getFinalScore(state, side).toLocaleString()}
        </span>
      </div>
      {limit != null && (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-[var(--color-netural)]">
            <div className="h-full rounded-full transition-all" style={{ width: `${ratio}%`, background: over ? 'var(--color-tertiary)' : accent }} />
          </div>
          <span className="font-mono text-[10px] font-black" style={{ color: over ? 'var(--color-tertiary)' : 'var(--color-ink)' }}>
            {cost}/{limit}
          </span>
        </div>
      )}
    </div>
  )
}

/* ---------- 본체 ---------- */

const StageInner: React.FC<{ role: Role }> = ({ role }) => {
  const { state, dispatch, connected } = useMatchSync(role)
  const rule = GAME_RULES[state.gameType]
  const isAdmin = role === 'admin'
  const editableSides: Side[] = isAdmin ? ['A', 'B'] : [role as Side]

  const [target, setTarget] = useState<{ side: Side; round: RoundIdx }>({ side: editableSides[0], round: 0 })
  const [banMode, setBanMode] = useState(false)

  const onTile = (id: number) => {
    if (banMode && isAdmin && rule.hasBan) dispatch({ type: 'TOGGLE_BAN', id, by: role })
    else dispatch({ type: 'PICK', side: target.side, round: target.round, id, by: role })
  }

  const targetButtons = editableSides.flatMap((s) =>
    ([0, 1] as RoundIdx[]).map((r) => ({ side: s, round: r })),
  )

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-hidden p-3 sm:p-5 xl:p-6 flex flex-col gap-4 mx-auto" style={{ background: 'var(--grad-page)' }}>
      {/* 헤더 */}
      <div className="rounded-[28px] px-5 py-3.5 flex items-center justify-between gap-3 flex-wrap" style={{ background: 'var(--color-content)' }}>
        <div className="flex items-center gap-2.5">
          <span className="text-lg font-black tracking-wide" style={{ color: 'var(--color-primary)' }}>
            v3
          </span>
          <span className="text-[10px] px-2.5 py-1 rounded-full font-bold" style={{ background: 'var(--color-netural)', color: 'var(--color-ink)' }}>
            {ROLE_LABEL[role]}
          </span>
          <span className="size-2.5 rounded-full" style={{ background: connected ? 'var(--color-secondary)' : 'var(--color-netural)' }} title={connected ? 'SYNC' : 'OFF'} />
        </div>
        <div className={`flex gap-2 ${isAdmin ? '' : 'opacity-50 pointer-events-none'}`}>
          {GAME_TYPE_LIST.map((gt: GameType) => (
            <Pill key={gt} active={state.gameType === gt} onClick={() => isAdmin && dispatch({ type: 'SET_GAME_TYPE', gameType: gt, by: role })}>
              {GAME_RULES[gt].short}
            </Pill>
          ))}
        </div>
      </div>

      {/* 본문 */}
      <div className="flex flex-col xl:flex-row gap-4 flex-1">
        {/* 좌측: 스코어보드(상) + 방송 영역(하) */}
        <div className="w-full xl:w-[30%] flex flex-col gap-4">
          <div className="flex flex-col gap-3 p-3 rounded-[28px]" style={{ background: 'var(--color-base)' }}>
            <ScoreCard side="A" state={state} dispatch={dispatch} editable={editableSides.includes('A')} />
            <ScoreCard side="B" state={state} dispatch={dispatch} editable={editableSides.includes('B')} />
          </div>

          <div className="flex-1" />

          {/* 방송 영역: 좌측 하단 (송출 + 채팅 자리) */}
          <div className="flex flex-col gap-3 p-3 rounded-[28px]" style={{ background: 'var(--color-base)' }}>
            <div className="rounded-[20px] aspect-video flex items-center justify-center" style={{ background: 'var(--color-content)' }}>
              <span className="text-[11px] font-bold tracking-wider text-[var(--color-ink)]/30">화면 송출 영역</span>
            </div>
            <div className="rounded-[20px] min-h-[150px] flex items-center justify-center" style={{ background: 'var(--color-content)' }}>
              <span className="text-[11px] font-bold tracking-wider text-[var(--color-ink)]/30">채팅 영역</span>
            </div>
          </div>
        </div>

        {/* 우측: 경기판 */}
        <div className="w-full xl:w-[70%] flex flex-col gap-4 p-3 sm:p-4 rounded-[28px]" style={{ background: 'var(--color-base)' }}>
          {/* 밴 패널 (정식/레전드) */}
          {rule.hasBan && (
            <div className="flex items-center gap-3 p-3 rounded-[20px]" style={{ background: 'var(--color-content)' }}>
              <span className="text-[10px] font-black tracking-wider text-[var(--color-ink)]/40 shrink-0">밴 {state.ban.length}/{rule.banCount}</span>
              <div className="flex gap-2 flex-1">
                {Array.from({ length: rule.banCount }, (_, i) => {
                  const id = state.ban[i]
                  const a = id != null ? MOCK_AGENT_MAP.get(id) : null
                  return (
                    <div key={i} className="px-3 py-1.5 rounded-xl text-[11px] font-bold" style={{ background: a ? 'var(--color-tertiary)' : 'var(--color-netural)', color: a ? '#16181f' : 'var(--color-ink)' }}>
                      {a ? a.nameKo : '비어있음'}
                    </div>
                  )
                })}
              </div>
              {isAdmin && (
                <Pill active={banMode} accent="var(--color-tertiary)" onClick={() => setBanMode((v) => !v)}>
                  {banMode ? '밴 지정중' : '밴 지정'}
                </Pill>
              )}
            </div>
          )}

          {/* 라운드 1 / 2 */}
          {([0, 1] as RoundIdx[]).map((r) => (
            <div key={r} className="flex flex-col gap-2 p-3 rounded-[24px]" style={{ background: 'var(--color-content)' }}>
              <span className="text-[10px] font-black tracking-widest text-[var(--color-ink)]/40">라운드 {r + 1}</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {(['A', 'B'] as Side[]).map((s) => (
                  <PartyCard
                    key={s}
                    side={s}
                    round={r}
                    state={state}
                    dispatch={dispatch}
                    editable={editableSides.includes(s)}
                    isTarget={!banMode && target.side === s && target.round === r}
                    onTarget={() => {
                      setBanMode(false)
                      setTarget({ side: s, round: r })
                    }}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* 조작 바 */}
          <div className="flex items-center gap-2 flex-wrap p-3 rounded-[20px]" style={{ background: 'var(--color-content)' }}>
            {targetButtons.map((t) => (
              <Pill
                key={`${t.side}${t.round}`}
                active={!banMode && target.side === t.side && target.round === t.round}
                accent={sideAccent(t.side)}
                onClick={() => {
                  setBanMode(false)
                  setTarget(t)
                }}
              >
                {t.side} R{t.round + 1}
              </Pill>
            ))}
            {isAdmin && (
              <Pill accent="var(--color-tertiary)" onClick={() => dispatch({ type: 'RESET', by: role })}>
                초기화
              </Pill>
            )}
          </div>

          {/* 에이전트 그리드 */}
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 p-3 rounded-[24px]" style={{ background: 'var(--color-content)' }}>
            {MOCK_AGENTS.map((a) => {
              const banned = state.ban.includes(a.id)
              const pickedInTarget = !banMode && state.rounds[target.side][target.round].picks.includes(a.id)
              const dim = banMode && isAdmin && rule.hasBan && !isBanEligible(a.id)
              return <AgentTile key={a.id} id={a.id} banned={banned} picked={pickedInTarget} dim={dim} onClick={() => onTile(a.id)} />
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export const BroadcastStage: React.FC<{ role: Role }> = ({ role }) => {
  const [mounted, setMounted] = useState(false)
  React.useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-full h-full" style={{ background: 'var(--color-base)' }} />
  return <StageInner role={role} />
}

export default BroadcastStage
