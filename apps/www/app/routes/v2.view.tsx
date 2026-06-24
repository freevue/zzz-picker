import { useStore } from '@zzz-picker/provider/hooks'
import { useEffect, useMemo } from 'react'
import { useSearchParams } from '@remix-run/react'
import {
  GAME_TYPE,
  BANPICK_PHASE,
  useV2Sync,
  DEFAULT_SESSION
} from '../utils/v2Bridge'
import type { Party } from '../utils/v2Bridge'

const V2BroadcastView: React.FC = () => {
  const { agents: agentMap, boss: bossMap, engines: engineMap } = useStore()
  const [searchParams] = useSearchParams()

  const roomId = searchParams.get('room') || ''

  // v2 다크테마 루트 바인딩
  useEffect(() => {
    document.documentElement.classList.add('v2')
    return () => {
      document.documentElement.classList.remove('v2')
    }
  }, [])

  // 실시간 세션 브릿지 연동
  const [session] = useV2Sync(roomId, DEFAULT_SESSION(roomId || 'MOCK-VIEW'))

  // Cost 연산 유틸
  const calculateCost = (party: Party): number => {
    let cost = 0
    party.agents.forEach((item: { id: number; rate: number; engineId: number | null; engineRate: number }) => {
      const agent = agentMap.get(item.id)
      if (agent) {
        if (agent.rarity === 'S' && agent.isPickup) {
          cost += 1 + item.rate
        }
      }
      if (item.engineId) {
        const engine = engineMap.get(item.engineId)
        if (engine) {
          if (engine.rank === 'S') {
            if (engine.isPickup) {
              cost += 1 + (item.engineRate - 1) * 0.5
            } else {
              if (item.engineRate >= 4) {
                cost += 1
              }
            }
          }
        }
      }
    })
    return cost
  }


  const costA = useMemo(() => calculateCost(session.A.party1) + calculateCost(session.A.party2), [session.A.party1, session.A.party2])
  const costB = useMemo(() => calculateCost(session.B.party1) + calculateCost(session.B.party2), [session.B.party1, session.B.party2])

  // 방 정보 누락 시 가이드 화면
  if (!roomId) {
    return (
      <div className="w-full min-h-screen bg-[var(--color-base)] text-[var(--color-ink)] flex items-center justify-center p-6 select-none font-sans">
        <div className="bg-[var(--color-content)] p-8 rounded-2xl border border-[var(--color-tertiary)]/20 shadow-2xl max-w-md text-center flex flex-col gap-4">
          <span className="text-5xl">📡</span>
          <h2 className="text-xl font-black text-[var(--color-tertiary)] tracking-wide">BROADCAST ROOM MISSING</h2>
          <p className="text-xs text-[var(--color-ink)]/50">
            방송 중계용 룸 식별자가 필요합니다. 관리자 뷰 상단의 "방송 중계 링크 복사"를 통해 룸 세션이 포함된 올바른 주소로 접근해 주십시오.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-[var(--color-base)] text-[var(--color-ink)] p-8 font-sans select-none flex flex-col gap-8 overflow-x-hidden relative">
      
      {/* 백그라운드 디자인 레이어 (소프트 테크-레이어링 데코) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[350px] bg-gradient-to-b from-[var(--color-secondary)]/5 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[var(--color-primary)]/3 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[var(--color-secondary)]/3 rounded-full blur-[100px] pointer-events-none" />

      {/* 최상단 브로드캐스트 대칭형 헤더 */}
      <div className="w-full bg-[var(--color-content)] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between border border-[var(--color-netural)]/60 shadow-2xl relative z-10">
        
        {/* 경기 형식 배지 및 룸 정보 */}
        <div className="flex items-center gap-4 order-2 md:order-1 mt-4 md:mt-0">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-[var(--color-ink)]/40 font-mono tracking-widest font-bold uppercase">MATCH MODE</span>
            <span className="text-lg font-black text-[var(--color-primary)] tracking-wider">
              {session.activeTab === GAME_TYPE.ORIGINAL ? '정식 로프꾼' : session.activeTab === GAME_TYPE.LEGEND ? '레전드 로프꾼' : '공허사냥꾼'}
            </span>
          </div>
          <div className="h-8 w-px bg-[var(--color-netural)]" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-[var(--color-ink)]/40 font-mono tracking-widest font-bold uppercase">ROOM CODE</span>
            <span className="text-sm font-mono text-[var(--color-secondary)] font-extrabold">{session.roomId}</span>
          </div>
        </div>

        {/* 웅장한 로고 타이틀 */}
        <div className="text-center order-1 md:order-2 flex flex-col gap-1">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-[0.25em] text-[var(--color-ink)] flex items-center justify-center gap-3">
            <span className="text-[var(--color-primary)] font-black">ZENLESS</span>
            <span>STRIKE</span>
            <span className="text-[var(--color-secondary)] font-black">V2</span>
          </h1>
          <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--color-ink)]/40 font-bold">
            Live Stream Playground / Real-Time Broadcast Dashboard
          </p>
        </div>

        {/* 실시간 커넥션 스테이터스 & 단계 리포트 */}
        <div className="flex items-center gap-4 order-3 mt-4 md:mt-0">
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[10px] text-[var(--color-ink)]/40 font-mono tracking-widest font-bold uppercase">CURRENT STATUS</span>
            <span className="text-sm font-extrabold text-[var(--color-secondary)] flex items-center gap-1.5 uppercase">
              <span className="w-2 h-2 rounded-full bg-[var(--color-secondary)] animate-ping" />
              <span>{session.phase === BANPICK_PHASE.DONE ? 'Match Ready' : session.phase}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 중앙 밴 및 보스 통합 정보 보드 */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        
        {/* 선수 A 밴 정보 */}
        <div className="bg-[var(--color-content)] rounded-2xl p-5 border border-[var(--color-netural)]/60 shadow-lg flex flex-col gap-3">
          <div className="flex justify-between items-center border-b border-[var(--color-netural)] pb-2.5">
            <span className="text-[11px] font-extrabold text-[var(--color-tertiary)] tracking-widest uppercase flex items-center gap-1.5">
              <span>🚫</span> TEAM A BANS
            </span>
            <span className="text-xs font-bold text-[var(--color-ink)]/40">{session.A.nickname || 'PLAYER A'}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 flex-1 min-h-[64px]">
            {session.A.banList.length > 0 ? (
              session.A.banList.map(id => {
                const agent = agentMap.get(id)
                return (
                  <div key={id} className="bg-[var(--color-base)] border border-[var(--color-tertiary)]/20 rounded-xl p-3 flex flex-col justify-center items-center text-center">
                    <span className="text-xs font-black text-[var(--color-tertiary)]">{agent?.nameKo}</span>
                    <span className="text-[8px] text-[var(--color-ink)]/40 mt-0.5 font-bold uppercase tracking-wider">{agent?.rarity}급 에이전트</span>
                  </div>
                )
              })
            ) : (
              <div className="col-span-2 flex items-center justify-center text-xs font-bold text-[var(--color-ink)]/20 border border-dashed border-[var(--color-netural)] rounded-xl">
                지정된 밴 카드 없음
              </div>
            )}
          </div>
        </div>

        {/* 경기 진행 라운드별 매칭 보스 레이아웃 */}
        <div className="bg-[var(--color-content)] rounded-2xl p-5 border border-[var(--color-netural)]/60 shadow-lg flex flex-col gap-4 text-center items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[var(--color-primary)]/5 to-transparent pointer-events-none" />
          
          <span className="text-[10px] font-black tracking-widest text-[var(--color-primary)] uppercase border-b border-[var(--color-netural)] pb-1 w-full">
            👾 TARGET BOSS MATRICES
          </span>

          <div className="grid grid-cols-2 gap-4 w-full">
            {/* 1라운드 매칭 보스 */}
            <div className="bg-[var(--color-base)] p-3.5 rounded-xl border border-[var(--color-netural)] flex flex-col gap-1.5">
              <span className="text-[9px] font-bold text-[var(--color-ink)]/30 tracking-widest uppercase">1ROUND BOSS</span>
              {session.activeTab === GAME_TYPE.UNLIMITED ? (
                <div className="flex flex-col gap-1">
                  <div className="text-[11px] font-bold">
                    A: <span className="text-[var(--color-primary)]">{bossMap.get(session.A.party1.bossId || 0)?.nameKo || '미선정'}</span>
                  </div>
                  <div className="text-[11px] font-bold">
                    B: <span className="text-[var(--color-secondary)]">{bossMap.get(session.B.party1.bossId || 0)?.nameKo || '미선정'}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-black text-[var(--color-primary)]">
                    {bossMap.get(session.A.party1.bossId || 0)?.nameKo || '미선정'}
                  </span>
                  <span className="text-[9px] text-[var(--color-ink)]/40">(선수 A 선택)</span>
                </div>
              )}
            </div>

            {/* 2라운드 매칭 보스 */}
            <div className="bg-[var(--color-base)] p-3.5 rounded-xl border border-[var(--color-netural)] flex flex-col gap-1.5">
              <span className="text-[9px] font-bold text-[var(--color-ink)]/30 tracking-widest uppercase">2ROUND BOSS</span>
              {session.activeTab === GAME_TYPE.UNLIMITED ? (
                <div className="flex flex-col gap-1">
                  <div className="text-[11px] font-bold">
                    A: <span className="text-[var(--color-primary)]">{bossMap.get(session.A.party2.bossId || 0)?.nameKo || '미선정'}</span>
                  </div>
                  <div className="text-[11px] font-bold">
                    B: <span className="text-[var(--color-secondary)]">{bossMap.get(session.B.party2.bossId || 0)?.nameKo || '미선정'}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-black text-[var(--color-secondary)]">
                    {bossMap.get(session.commonBossId || 0)?.nameKo || '미선정'}
                  </span>
                  <span className="text-[9px] text-[var(--color-ink)]/40">(선수 B 선택 공용)</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 선수 B 밴 정보 */}
        <div className="bg-[var(--color-content)] rounded-2xl p-5 border border-[var(--color-netural)]/60 shadow-lg flex flex-col gap-3">
          <div className="flex justify-between items-center border-b border-[var(--color-netural)] pb-2.5">
            <span className="text-xs font-bold text-[var(--color-ink)]/40">{session.B.nickname || 'PLAYER B'}</span>
            <span className="text-[11px] font-extrabold text-[var(--color-tertiary)] tracking-widest uppercase flex items-center gap-1.5">
              TEAM B BANS <span>🚫</span>
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 flex-1 min-h-[64px]">
            {session.B.banList.length > 0 ? (
              session.B.banList.map(id => {
                const agent = agentMap.get(id)
                return (
                  <div key={id} className="bg-[var(--color-base)] border border-[var(--color-tertiary)]/20 rounded-xl p-3 flex flex-col justify-center items-center text-center">
                    <span className="text-xs font-black text-[var(--color-tertiary)]">{agent?.nameKo}</span>
                    <span className="text-[8px] text-[var(--color-ink)]/40 mt-0.5 font-bold uppercase tracking-wider">{agent?.rarity}급 에이전트</span>
                  </div>
                )
              })
            ) : (
              <div className="col-span-2 flex items-center justify-center text-xs font-bold text-[var(--color-ink)]/20 border border-dashed border-[var(--color-netural)] rounded-xl">
                지정된 밴 카드 없음
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 웅장한 대칭형 밴픽 메인 보드 */}
      <div className="w-full flex flex-col xl:flex-row gap-8 relative z-10">
        
        {/* 좌측 진영: TEAM A PLAYGROUND */}
        <div className="flex-1 bg-[var(--color-content)] rounded-3xl p-6 border border-[var(--color-netural)]/60 shadow-2xl flex flex-col gap-6 relative overflow-hidden">
          
          {/* 선수 메타 테두리 효과 */}
          <div className="absolute left-0 top-0 w-2.5 h-full bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-secondary)]/30" />
          
          <div className="flex justify-between items-end border-b border-[var(--color-netural)] pb-4 pl-3">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-[var(--color-primary)] font-black tracking-widest uppercase">SIDE ALPHA</span>
              <h2 className="text-2xl font-black tracking-wide text-[var(--color-ink)]">
                {session.A.nickname || '선수 A 대기 중'}
              </h2>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[9px] text-[var(--color-ink)]/40 font-bold uppercase">SUBMISSION</span>
                <span className={`text-xs font-black uppercase tracking-wider ${session.A.submitted ? 'text-[var(--color-primary)]' : 'text-[var(--color-ink)]/30'}`}>
                  {session.A.submitted ? '✓ Submitted' : '○ Drafting'}
                </span>
              </div>
              <div className="h-6 w-px bg-[var(--color-netural)]" />
              <div className="flex flex-col items-end">
                <span className="text-[9px] text-[var(--color-ink)]/40 font-bold uppercase">PARTY COST</span>
                <span className={`text-lg font-mono font-black ${session.activeTab === GAME_TYPE.ORIGINAL && costA > 24 ? 'text-[var(--color-tertiary)]' : 'text-[var(--color-primary)]'}`}>
                  {costA} <span className="text-xs text-[var(--color-ink)]/30 font-bold">/ 24</span>
                </span>
              </div>
            </div>
          </div>

          {/* 1라운드 파티 슬롯 */}
          <div className="flex flex-col gap-3 bg-[var(--color-base)]/50 p-5 rounded-2xl border border-[var(--color-netural)] shadow-inner">
            <span className="text-xs font-black tracking-wider text-[var(--color-primary)]/80 uppercase">
              🛡️ PARTY 1 (1ROUND FIGHTERS)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {session.A.party1.agents.length > 0 ? (
                session.A.party1.agents.map(item => {
                  const agent = agentMap.get(item.id)
                  const engine = item.engineId ? engineMap.get(item.engineId) : null
                  return (
                    <div key={item.id} className="bg-[var(--color-base)] border border-[var(--color-netural)] rounded-2xl p-4 flex flex-col justify-between min-h-[140px] shadow-sm relative overflow-hidden transition-all duration-300 hover:border-[var(--color-primary)]/30">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-black tracking-wide text-[var(--color-ink)]">{agent?.nameKo}</span>
                          <span className="text-[9px] text-[var(--color-ink)]/30 font-extrabold uppercase">[{agent?.rarity}급]</span>
                        </div>
                        <span className="text-xs text-[var(--color-primary)] font-black font-mono">★ {item.rate}돌파</span>
                      </div>
                      
                      <div className="border-t border-[var(--color-netural)]/60 pt-2.5 mt-2 flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-[var(--color-ink)]/30 uppercase">W-ENGINE SPEC</span>
                        {engine ? (
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-[var(--color-secondary)] truncate">{engine.nameKo}</span>
                            <span className="text-[9px] text-[var(--color-ink)]/50 font-black">재련 {item.engineRate}단계 ({engine.rank}급)</span>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-[var(--color-ink)]/20 italic">엔진 미기용</span>
                        )}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="col-span-3 py-10 text-center text-xs font-bold text-[var(--color-ink)]/15 border border-dashed border-[var(--color-netural)] rounded-2xl">
                  1라운드 파티 대기 중
                </div>
              )}
            </div>
          </div>

          {/* 2라운드 파티 슬롯 */}
          <div className="flex flex-col gap-3 bg-[var(--color-base)]/50 p-5 rounded-2xl border border-[var(--color-netural)] shadow-inner">
            <span className="text-xs font-black tracking-wider text-[var(--color-primary)]/80 uppercase">
              🛡️ PARTY 2 (2ROUND FIGHTERS)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {session.A.party2.agents.length > 0 ? (
                session.A.party2.agents.map(item => {
                  const agent = agentMap.get(item.id)
                  const engine = item.engineId ? engineMap.get(item.engineId) : null
                  return (
                    <div key={item.id} className="bg-[var(--color-base)] border border-[var(--color-netural)] rounded-2xl p-4 flex flex-col justify-between min-h-[140px] shadow-sm relative overflow-hidden transition-all duration-300 hover:border-[var(--color-primary)]/30">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-black tracking-wide text-[var(--color-ink)]">{agent?.nameKo}</span>
                          <span className="text-[9px] text-[var(--color-ink)]/30 font-extrabold uppercase">[{agent?.rarity}급]</span>
                        </div>
                        <span className="text-xs text-[var(--color-primary)] font-black font-mono">★ {item.rate}돌파</span>
                      </div>
                      
                      <div className="border-t border-[var(--color-netural)]/60 pt-2.5 mt-2 flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-[var(--color-ink)]/30 uppercase">W-ENGINE SPEC</span>
                        {engine ? (
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-[var(--color-secondary)] truncate">{engine.nameKo}</span>
                            <span className="text-[9px] text-[var(--color-ink)]/50 font-black">재련 {item.engineRate}단계 ({engine.rank}급)</span>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-[var(--color-ink)]/20 italic">엔진 미기용</span>
                        )}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="col-span-3 py-10 text-center text-xs font-bold text-[var(--color-ink)]/15 border border-dashed border-[var(--color-netural)] rounded-2xl">
                  2라운드 파티 대기 중
                </div>
              )}
            </div>
          </div>

        </div>

        {/* 우측 진영: TEAM B PLAYGROUND */}
        <div className="flex-1 bg-[var(--color-content)] rounded-3xl p-6 border border-[var(--color-netural)]/60 shadow-2xl flex flex-col gap-6 relative overflow-hidden">
          
          {/* 선수 메타 테두리 효과 */}
          <div className="absolute right-0 top-0 w-2.5 h-full bg-gradient-to-b from-[var(--color-secondary)] to-[var(--color-primary)]/30" />
          
          <div className="flex justify-between items-end border-b border-[var(--color-netural)] pb-4 pr-3">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-[var(--color-secondary)] font-black tracking-widest uppercase">SIDE BETA</span>
              <h2 className="text-2xl font-black tracking-wide text-[var(--color-ink)]">
                {session.B.nickname || '선수 B 대기 중'}
              </h2>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[9px] text-[var(--color-ink)]/40 font-bold uppercase">SUBMISSION</span>
                <span className={`text-xs font-black uppercase tracking-wider ${session.B.submitted ? 'text-[var(--color-secondary)]' : 'text-[var(--color-ink)]/30'}`}>
                  {session.B.submitted ? '✓ Submitted' : '○ Drafting'}
                </span>
              </div>
              <div className="h-6 w-px bg-[var(--color-netural)]" />
              <div className="flex flex-col items-end">
                <span className="text-[9px] text-[var(--color-ink)]/40 font-bold uppercase">PARTY COST</span>
                <span className={`text-lg font-mono font-black ${session.activeTab === GAME_TYPE.ORIGINAL && costB > 24 ? 'text-[var(--color-tertiary)]' : 'text-[var(--color-secondary)]'}`}>
                  {costB} <span className="text-xs text-[var(--color-ink)]/30 font-bold">/ 24</span>
                </span>
              </div>
            </div>
          </div>

          {/* 1라운드 파티 슬롯 */}
          <div className="flex flex-col gap-3 bg-[var(--color-base)]/50 p-5 rounded-2xl border border-[var(--color-netural)] shadow-inner">
            <span className="text-xs font-black tracking-wider text-[var(--color-secondary)]/80 uppercase">
              🛡️ PARTY 1 (1ROUND FIGHTERS)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {session.B.party1.agents.length > 0 ? (
                session.B.party1.agents.map(item => {
                  const agent = agentMap.get(item.id)
                  const engine = item.engineId ? engineMap.get(item.engineId) : null
                  return (
                    <div key={item.id} className="bg-[var(--color-base)] border border-[var(--color-netural)] rounded-2xl p-4 flex flex-col justify-between min-h-[140px] shadow-sm relative overflow-hidden transition-all duration-300 hover:border-[var(--color-secondary)]/30">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-black tracking-wide text-[var(--color-ink)]">{agent?.nameKo}</span>
                          <span className="text-[9px] text-[var(--color-ink)]/30 font-extrabold uppercase">[{agent?.rarity}급]</span>
                        </div>
                        <span className="text-xs text-[var(--color-secondary)] font-black font-mono">★ {item.rate}돌파</span>
                      </div>
                      
                      <div className="border-t border-[var(--color-netural)]/60 pt-2.5 mt-2 flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-[var(--color-ink)]/30 uppercase">W-ENGINE SPEC</span>
                        {engine ? (
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-[var(--color-secondary)] truncate">{engine.nameKo}</span>
                            <span className="text-[9px] text-[var(--color-ink)]/50 font-black">재련 {item.engineRate}단계 ({engine.rank}급)</span>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-[var(--color-ink)]/20 italic">엔진 미기용</span>
                        )}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="col-span-3 py-10 text-center text-xs font-bold text-[var(--color-ink)]/15 border border-dashed border-[var(--color-netural)] rounded-2xl">
                  1라운드 파티 대기 중
                </div>
              )}
            </div>
          </div>

          {/* 2라운드 파티 슬롯 */}
          <div className="flex flex-col gap-3 bg-[var(--color-base)]/50 p-5 rounded-2xl border border-[var(--color-netural)] shadow-inner">
            <span className="text-xs font-black tracking-wider text-[var(--color-secondary)]/80 uppercase">
              🛡️ PARTY 2 (2ROUND FIGHTERS)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {session.B.party2.agents.length > 0 ? (
                session.B.party2.agents.map(item => {
                  const agent = agentMap.get(item.id)
                  const engine = item.engineId ? engineMap.get(item.engineId) : null
                  return (
                    <div key={item.id} className="bg-[var(--color-base)] border border-[var(--color-netural)] rounded-2xl p-4 flex flex-col justify-between min-h-[140px] shadow-sm relative overflow-hidden transition-all duration-300 hover:border-[var(--color-secondary)]/30">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-black tracking-wide text-[var(--color-ink)]">{agent?.nameKo}</span>
                          <span className="text-[9px] text-[var(--color-ink)]/30 font-extrabold uppercase">[{agent?.rarity}급]</span>
                        </div>
                        <span className="text-xs text-[var(--color-secondary)] font-black font-mono">★ {item.rate}돌파</span>
                      </div>
                      
                      <div className="border-t border-[var(--color-netural)]/60 pt-2.5 mt-2 flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-[var(--color-ink)]/30 uppercase">W-ENGINE SPEC</span>
                        {engine ? (
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-[var(--color-secondary)] truncate">{engine.nameKo}</span>
                            <span className="text-[9px] text-[var(--color-ink)]/50 font-black">재련 {item.engineRate}단계 ({engine.rank}급)</span>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-[var(--color-ink)]/20 italic">엔진 미기용</span>
                        )}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="col-span-3 py-10 text-center text-xs font-bold text-[var(--color-ink)]/15 border border-dashed border-[var(--color-netural)] rounded-2xl">
                  2라운드 파티 대기 중
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}

export default V2BroadcastView
