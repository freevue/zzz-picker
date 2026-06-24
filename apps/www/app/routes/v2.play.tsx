import { useStore } from '@zzz-picker/provider/hooks'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from '@remix-run/react'
import {
  GAME_TYPE,
  BANPICK_PHASE,
  useV2Sync,
  DEFAULT_SESSION
} from '../utils/v2Bridge'
import type { Party, PlaySession } from '../utils/v2Bridge'

const V2PlayerPlay: React.FC = () => {
  const { agents: agentMap, boss: bossMap, engines: engineMap } = useStore()
  const [searchParams] = useSearchParams()

  const role = (searchParams.get('role') || 'A').toUpperCase() as 'A' | 'B'
  const roomId = searchParams.get('room') || ''

  // v2 다크테마 바인딩
  useEffect(() => {
    document.documentElement.classList.add('v2')
    return () => {
      document.documentElement.classList.remove('v2')
    }
  }, [])

  // 실시간 세션 브릿지 동기화
  const [session, updateSession] = useV2Sync(roomId, DEFAULT_SESSION(roomId || 'MOCK-PLAY'))

  // 복사 토스트 알림
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // 본인 캐릭터 상세 돌파 에디터 상태
  const [selectedAgentForEdit, setSelectedAgentForEdit] = useState<number | null>(null)
  const [agentRate, setAgentRate] = useState<number>(0)
  const [selectedEngineId, setSelectedEngineId] = useState<number | null>(null)
  const [engineRate, setEngineRate] = useState<number>(1)
  const [currentEditRound, setCurrentEditRound] = useState<1 | 2 | null>(null)

  const agentList = useMemo(() => Array.from(agentMap.values()).filter(a => a.isAllow), [agentMap])
  const engineList = useMemo(() => Array.from(engineMap.values()), [engineMap])

  // 선수 본인 데이터
  const me = role === 'A' ? session.A : session.B
  const opponent = role === 'A' ? session.B : session.A

  // Cost 연산
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

  const myCost = useMemo(() => calculateCost(me.party1) + calculateCost(me.party2), [me.party1, me.party2])

  // 선수 본인 파티 픽업 조작 (제출 완료 시 조작 불가)
  const toggleAgentPick = (agentId: number, round: 1 | 2) => {
    if (me.submitted) return

    const partyKey = round === 1 ? 'party1' : 'party2'
    const targetParty = me[partyKey]

    // 밴 필터링 (Unlimited가 아니면 밴 걸린 에이전트 픽 불가)
    if (session.activeTab !== GAME_TYPE.UNLIMITED) {
      const isBanned = session.A.banList.includes(agentId) || session.B.banList.includes(agentId)
      if (isBanned) {
        alert('밴으로 지정된 에이전트는 기용할 수 없습니다.')
        return
      }
    }

    if (targetParty.agents.some((a: { id: number }) => a.id === agentId)) {
      // 이미 픽되었으면 제거
      updateSession((prev: PlaySession) => ({
        ...prev,
        [role]: {
          ...prev[role],
          [partyKey]: {
            ...prev[role][partyKey],
            agents: prev[role][partyKey].agents.filter((a: { id: number }) => a.id !== agentId)
          }
        }
      }))
      if (selectedAgentForEdit === agentId) {
        setSelectedAgentForEdit(null)
      }
      return
    }

    if (targetParty.agents.length >= 3) {
      alert('한 파티당 최대 3명까지만 기용 가능합니다.')
      return
    }

    // 추가
    const newAgent = { id: agentId, rate: 0, engineId: null, engineRate: 1 }
    updateSession((prev: PlaySession) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [partyKey]: {
          ...prev[role][partyKey],
          agents: [...prev[role][partyKey].agents, newAgent]
        }
      }
    }))

    setSelectedAgentForEdit(agentId)
    setAgentRate(0)
    setSelectedEngineId(null)
    setEngineRate(1)
    setCurrentEditRound(round)
  }

  // 선수 개별 세부 돌파 세이브
  const handleUpdateAgentDetails = () => {
    if (!currentEditRound || selectedAgentForEdit === null || me.submitted) return
    const partyKey = currentEditRound === 1 ? 'party1' : 'party2'

    updateSession((prev: PlaySession) => {
      const party = prev[role][partyKey]
      const updatedAgents = party.agents.map((a: { id: number; rate: number; engineId: number | null; engineRate: number }) => {
        if (a.id === selectedAgentForEdit) {
          return {
            ...a,
            rate: agentRate,
            engineId: selectedEngineId,
            engineRate: engineRate
          }
        }
        return a
      })
      return {
        ...prev,
        [role]: {
          ...prev[role],
          [partyKey]: { ...party, agents: updatedAgents }
        }
      }
    })

    setSelectedAgentForEdit(null)
    setToastMessage('대원 세부 돌파/재련 정보가 로컬 세션에 업데이트되었습니다.')
    setTimeout(() => setToastMessage(null), 2000)
  }

  // 선수 최종 픽 완료 제출
  const handleSubmitPick = () => {
    if (me.party1.agents.length === 0 && me.party2.agents.length === 0) {
      alert('최소 한 명 이상의 에이전트를 파티에 배치해야 합니다.')
      return
    }
    const confirmSubmit = window.confirm(
      '파티 구성을 이대로 최종 확정하여 관리자에게 제출하시겠습니까? 제출 완료 후에는 관리자가 락을 풀기 전까지 수정이 제한됩니다.'
    )
    if (!confirmSubmit) return

    updateSession((prev: PlaySession) => ({
      ...prev,
      [role]: { ...prev[role], submitted: true }
    }))
    setToastMessage('🎉 최종 파티 픽업 정보가 관리자 대시보드에 실시간 제출되었습니다!')
    setTimeout(() => setToastMessage(null), 3500)
  }


  // 방 정보 누락 시 가이드 화면
  if (!roomId) {
    return (
      <div className="w-full min-h-screen bg-[var(--color-base)] text-[var(--color-ink)] flex items-center justify-center p-6 select-none font-sans">
        <div className="bg-[var(--color-content)] p-8 rounded-2xl border border-[var(--color-tertiary)]/20 shadow-2xl max-w-md text-center flex flex-col gap-4">
          <span className="text-5xl">⚠️</span>
          <h2 className="text-xl font-black text-[var(--color-tertiary)] tracking-wide">SESSION ROOM MISSING</h2>
          <p className="text-xs text-[var(--color-ink)]/50">
            진입 경로에 방 세션 식별자가 비어있습니다. 관리자가 제공한 선수 고유 밴픽 참가 링크를 다시 확인하고 접근해 주십시오.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-[var(--color-base)] text-[var(--color-ink)] p-6 font-sans select-none flex flex-col gap-6">
      
      {/* 초고속 양방향 실시간 알림 */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[var(--color-content)] border-l-4 border-[var(--color-primary)] px-6 py-4 rounded-md shadow-2xl flex items-center gap-3 transition-all duration-300">
          <span className="text-[var(--color-primary)] text-lg">💡</span>
          <span className="text-[var(--color-ink)] font-bold text-sm tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* 헤더 */}
      <div className="w-full bg-[var(--color-content)] rounded-xl p-5 flex items-center justify-between shadow-inner relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-full bg-gradient-to-l from-[var(--color-secondary)]/5 to-transparent skew-x-12 pointer-events-none" />
        
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-extrabold tracking-wider text-[var(--color-secondary)] flex items-center gap-2.5">
            <span>ZZZ V2 밴픽 파티 빌더</span>
            <span className="text-xs bg-[var(--color-netural)] px-3 py-1 rounded text-[var(--color-ink)] font-black tracking-widest border border-[var(--color-secondary)]/15">
              PLAYER SIDE {role}
            </span>
          </h1>
          <p className="text-xs text-[var(--color-ink)]/50">
            선수용 플레이그라운드입니다. 관리자의 진행 단계에 맞추어 실시간으로 보드 정보가 연동됩니다.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[var(--color-base)] px-4 py-2 rounded-lg border border-[var(--color-netural)]">
          <span className="text-[10px] text-[var(--color-ink)]/40 font-bold font-mono">선수 이름:</span>
          <span className="text-xs text-[var(--color-primary)] font-extrabold">{me.nickname || `선수 ${role}`}</span>
        </div>
      </div>

      {/* 매치 모드 안내 및 단계 리포트 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 경기 룰 정보 모니터 */}
        <div className="bg-[var(--color-content)] rounded-xl p-4 flex flex-col gap-3.5 border border-[var(--color-netural)]/40 text-xs shadow-sm">
          <span className="text-[10px] font-bold text-[var(--color-secondary)] tracking-wider uppercase border-b border-[var(--color-netural)] pb-1.5 block">
            ⚖️ 경기 형식 정보
          </span>
          <div className="flex flex-col gap-2 bg-[var(--color-base)] p-3 rounded-lg border border-[var(--color-netural)]">
            <div>활성 경기 타입:{' '}
              <span className="text-[var(--color-primary)] font-black uppercase">
                {session.activeTab === GAME_TYPE.ORIGINAL ? '정식 로프꾼' : session.activeTab === GAME_TYPE.LEGEND ? '레전드 로프꾼' : '공허사냥꾼'}
              </span>
            </div>
            <div>진행 단계:{' '}
              <span className="text-[var(--color-secondary)] font-black uppercase">{session.phase}</span>
            </div>
            {session.activeTab === GAME_TYPE.ORIGINAL && (
              <div className="border-t border-[var(--color-netural)]/40 my-1 pt-1.5 flex justify-between font-bold">
                <span>내 파티 코스트:</span>
                <span className={myCost > 24 ? 'text-[var(--color-tertiary)] font-black text-sm' : 'text-[var(--color-primary)]'}>
                  {myCost} / 24 Cost
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 내 보스 정보 */}
        <div className="bg-[var(--color-content)] rounded-xl p-4 flex flex-col gap-3.5 border border-[var(--color-netural)]/40 text-xs shadow-sm">
          <span className="text-[10px] font-bold text-[var(--color-secondary)] tracking-wider uppercase border-b border-[var(--color-netural)] pb-1.5 block">
            👾 배정된 보스
          </span>
          <div className="flex flex-col gap-2 bg-[var(--color-base)] p-3 rounded-lg border border-[var(--color-netural)]">
            {session.activeTab === GAME_TYPE.UNLIMITED ? (
              <>
                <div>1라운드 보스: <span className="text-[var(--color-primary)] font-black">{bossMap.get(me.party1.bossId || 0)?.nameKo || '관리자 선정 중...'}</span></div>
                <div>2라운드 보스: <span className="text-[var(--color-primary)] font-black">{bossMap.get(me.party2.bossId || 0)?.nameKo || '관리자 선정 중...'}</span></div>
              </>
            ) : (
              <>
                <div>1라운드 보스: <span className="text-[var(--color-primary)] font-black">{bossMap.get(me.party1.bossId || 0)?.nameKo || '관리자 선정 중...'}</span></div>
                <div>2라운드 보스: <span className="text-[var(--color-secondary)] font-black">{bossMap.get(session.commonBossId || 0)?.nameKo || 'B선수 지정으로 동적 매칭'}</span></div>
              </>
            )}
          </div>
        </div>

        {/* 밴 정보 */}
        <div className="bg-[var(--color-content)] rounded-xl p-4 flex flex-col gap-3.5 border border-[var(--color-netural)]/40 text-xs shadow-sm">
          <span className="text-[10px] font-bold text-[var(--color-secondary)] tracking-wider uppercase border-b border-[var(--color-netural)] pb-1.5 block">
            🚫 밴 캐릭터 리스트
          </span>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[var(--color-base)] p-2.5 rounded-lg border border-[var(--color-netural)]">
              <div className="font-extrabold text-[var(--color-ink)]/50 text-[10px] mb-1">우리팀 밴</div>
              <div className="flex gap-1 flex-wrap">
                {me.banList.length > 0 ? (
                  me.banList.map((id: number) => (
                    <span key={id} className="bg-[var(--color-tertiary)]/15 text-[var(--color-tertiary)] font-bold px-1.5 py-0.5 rounded text-[10px]">
                      {agentMap.get(id)?.nameKo}
                    </span>
                  ))
                ) : (
                  <span className="text-[var(--color-ink)]/20">없음</span>
                )}
              </div>
            </div>
            <div className="bg-[var(--color-base)] p-2.5 rounded-lg border border-[var(--color-netural)]">
              <div className="font-extrabold text-[var(--color-ink)]/50 text-[10px] mb-1">상대팀 밴</div>
              <div className="flex gap-1 flex-wrap">
                {opponent.banList.length > 0 ? (
                  opponent.banList.map((id: number) => (
                    <span key={id} className="bg-[var(--color-tertiary)]/15 text-[var(--color-tertiary)] font-bold px-1.5 py-0.5 rounded text-[10px]">
                      {agentMap.get(id)?.nameKo}
                    </span>
                  ))
                ) : (
                  <span className="text-[var(--color-ink)]/20">없음</span>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 메인 빌드 플레이그라운드 */}
      {session.phase !== BANPICK_PHASE.PICK && session.phase !== BANPICK_PHASE.DONE ? (
        <div className="bg-[var(--color-content)] p-12 rounded-2xl text-center border border-[var(--color-netural)] flex flex-col gap-3 items-center justify-center">
          <span className="text-4xl animate-pulse">⏳</span>
          <h3 className="text-md font-bold text-[var(--color-secondary)] tracking-wide">관리자 셋업 단계 대기 중</h3>
          <p className="text-xs text-[var(--color-ink)]/40 max-w-sm">
            관리자가 보스 선정 및 밴 카드를 확정할 때까지 보드가 잠겨 있습니다. 대기하여 주십시오. (관리자 세션 갱신 시 실시간 자동 전환됩니다.)
          </p>
        </div>
      ) : (
        <div className="w-full flex gap-6 flex-col xl:flex-row flex-1">
          
          {/* 내 라운드 파티 배치 */}
          <div className="w-full xl:w-1/3 bg-[var(--color-content)] p-5 rounded-2xl border border-[var(--color-netural)]/40 shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-bold text-[var(--color-primary)] tracking-widest uppercase border-b border-[var(--color-netural)] pb-2.5 flex justify-between items-center">
              <span>🛡️ 내 1R / 2R 파티 슬롯</span>
              {me.submitted && <span className="text-[9px] bg-[var(--color-primary)] text-[var(--color-base)] px-2 py-0.5 rounded font-black">최종 제출됨</span>}
            </h3>

            {/* 1라운드 파티 */}
            <div className="flex flex-col gap-2 bg-[var(--color-base)] p-3 rounded-xl border border-[var(--color-netural)]/60">
              <span className="text-[10px] font-bold text-[var(--color-ink)]/40">1라운드 구성원 (3명)</span>
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map(idx => {
                  const agentItem = me.party1.agents[idx]
                  return (
                    <div
                      key={idx}
                      onClick={() => agentItem && !me.submitted && setSelectedAgentForEdit(agentItem.id)}
                      className={`p-2.5 rounded-lg text-center text-xs font-bold border transition-all ${
                        me.submitted ? 'cursor-not-allowed' : 'cursor-pointer hover:border-[var(--color-primary)]'
                      } ${
                        agentItem ? 'bg-[var(--color-content)] border-[var(--color-primary)]/20' : 'bg-[var(--color-content)]/20 border-dashed border-[var(--color-netural)]/60 text-[var(--color-ink)]/15'
                      }`}
                    >
                      {agentItem ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[var(--color-primary)] font-black">{agentMap.get(agentItem.id)?.nameKo}</span>
                          <span className="text-[9px] text-[var(--color-ink)]/40">{agentItem.rate}돌파</span>
                          <span className="text-[9px] text-[var(--color-secondary)] font-mono">{agentItem.engineId ? `${engineMap.get(agentItem.engineId)?.nameKo.substring(0, 5)}..` : '무기 없음'}</span>
                        </div>
                      ) : (
                        '비어있음'
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 2라운드 파티 */}
            <div className="flex flex-col gap-2 bg-[var(--color-base)] p-3 rounded-xl border border-[var(--color-netural)]/60">
              <span className="text-[10px] font-bold text-[var(--color-ink)]/40">2라운드 구성원 (3명)</span>
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map(idx => {
                  const agentItem = me.party2.agents[idx]
                  return (
                    <div
                      key={idx}
                      onClick={() => agentItem && !me.submitted && setSelectedAgentForEdit(agentItem.id)}
                      className={`p-2.5 rounded-lg text-center text-xs font-bold border transition-all ${
                        me.submitted ? 'cursor-not-allowed' : 'cursor-pointer hover:border-[var(--color-primary)]'
                      } ${
                        agentItem ? 'bg-[var(--color-content)] border-[var(--color-primary)]/20' : 'bg-[var(--color-content)]/20 border-dashed border-[var(--color-netural)]/60 text-[var(--color-ink)]/15'
                      }`}
                    >
                      {agentItem ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[var(--color-primary)] font-black">{agentMap.get(agentItem.id)?.nameKo}</span>
                          <span className="text-[9px] text-[var(--color-ink)]/40">{agentItem.rate}돌파</span>
                          <span className="text-[9px] text-[var(--color-secondary)] font-mono">{agentItem.engineId ? `${engineMap.get(agentItem.engineId)?.nameKo.substring(0, 5)}..` : '무기 없음'}</span>
                        </div>
                      ) : (
                        '비어있음'
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 최종 제출 버튼 */}
            {!me.submitted ? (
              <button
                onClick={handleSubmitPick}
                className="bg-[var(--color-primary)] text-[var(--color-base)] py-3 px-6 rounded-lg font-black tracking-widest text-xs hover:opacity-90 transition-all shadow shadow-[var(--color-primary)]/20 mt-2"
              >
                파티 최종 제출 완료
              </button>
            ) : (
              <div className="bg-[var(--color-netural)] p-3 rounded-lg border border-[var(--color-secondary)]/15 text-center text-[11px] text-[var(--color-secondary)] font-bold mt-2">
                📢 파티 구성이 완료되어 제출되었습니다. 관리자의 매치 승인을 대기하는 중입니다.
              </div>
            )}
          </div>

          {/* 에이전트 선택 그리드 보드 및 세부 스펙 믹서 */}
          <div className="w-full xl:w-2/3 bg-[var(--color-content)] p-5 rounded-2xl border border-[var(--color-netural)]/40 shadow-sm flex flex-col gap-5">
            
            {/* 세부 스펙 팝업 에디터 */}
            {selectedAgentForEdit !== null && !me.submitted && (
              <div className="bg-[var(--color-netural)] p-4 rounded-xl flex flex-col gap-4 border-l-4 border-[var(--color-secondary)] shadow animate-fadeIn">
                <div className="flex items-center justify-between border-b border-[var(--color-base)] pb-2">
                  <span className="text-[10px] font-bold text-[var(--color-secondary)] tracking-wider">🛠️ 에이전트 & W-엔진 상세 스펙 세팅</span>
                  <span className="text-xs font-black text-[var(--color-primary)]">{agentMap.get(selectedAgentForEdit)?.nameKo}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-[var(--color-ink)]/50">에이전트 돌파 등급</label>
                    <div className="flex gap-1">
                      {[0, 1, 2, 3, 4, 5, 6].map(v => (
                        <button
                          key={v}
                          onClick={() => setAgentRate(v)}
                          className={`flex-1 py-1.5 text-center text-xs font-black rounded ${agentRate === v ? 'bg-[var(--color-primary)] text-[var(--color-base)]' : 'bg-[var(--color-base)] text-[var(--color-ink)] hover:bg-[var(--color-base)]/80'}`}
                        >
                          {v}돌
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] text-[var(--color-ink)]/50">장착 W-엔진 및 재련</label>
                    <div className="flex gap-2">
                      <select
                        value={selectedEngineId || ''}
                        onChange={e => setSelectedEngineId(e.target.value ? Number(e.target.value) : null)}
                        className="bg-[var(--color-base)] text-[var(--color-ink)] rounded px-3 py-1.5 text-xs outline-none flex-1 focus:ring-1 focus:ring-[var(--color-secondary)] border border-[var(--color-netural)]"
                      >
                        <option value="">엔진 미기용</option>
                        {engineList
                          .filter(e => e.exclusiveAgentId === selectedAgentForEdit || e.rank === 'A' || e.rank === 'B')
                          .map(e => (
                            <option key={e.id} value={e.id}>
                              [{e.rank}] {e.nameKo}
                            </option>
                          ))}
                      </select>
                      {selectedEngineId && (
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(v => (
                            <button
                              key={v}
                              onClick={() => setEngineRate(v)}
                              className={`px-1.5 py-1 text-[10px] font-black rounded ${engineRate === v ? 'bg-[var(--color-primary)] text-[var(--color-base)]' : 'bg-[var(--color-base)] text-[var(--color-ink)]'}`}
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-1">
                  <button onClick={() => setSelectedAgentForEdit(null)} className="text-[var(--color-ink)]/40 hover:text-[var(--color-ink)] text-[10px] font-bold py-1.5 px-3">취소</button>
                  <button onClick={handleUpdateAgentDetails} className="bg-[var(--color-secondary)] text-[var(--color-base)] font-bold text-[10px] px-4 py-1.5 rounded-lg shadow">반영 세이브</button>
                </div>
              </div>
            )}

            {/* 에이전트 선택 그리드 */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-[var(--color-ink)]/45">
                배치 가능한 에이전트 (라운드별 버튼을 눌러 탑승시킵니다.)
              </span>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
                {agentList.map(a => {
                  const isBanned = session.activeTab !== GAME_TYPE.UNLIMITED && (session.A.banList.includes(a.id) || session.B.banList.includes(a.id))
                  return (
                    <div
                      key={a.id}
                      className={`p-2 rounded-xl text-center border relative transition-all ${
                        isBanned
                          ? 'bg-[var(--color-disabled)]/5 border-dashed border-[var(--color-netural)] opacity-25 cursor-not-allowed'
                          : 'bg-[var(--color-base)] border-transparent hover:border-[var(--color-netural)]/50'
                      }`}
                    >
                      <div className={`text-xs font-black truncate ${isBanned ? 'line-through text-[var(--color-tertiary)]' : 'text-[var(--color-ink)]'}`}>
                        {a.nameKo}
                      </div>
                      <div className="text-[9px] text-[var(--color-ink)]/30 mt-0.5">[{a.rarity}급]</div>
                      
                      {!isBanned && !me.submitted && (
                        <div className="grid grid-cols-2 gap-1.5 mt-2.5">
                          <button
                            onClick={() => toggleAgentPick(a.id, 1)}
                            className={`py-0.5 rounded text-[8px] font-extrabold transition-all ${
                              me.party1.agents.some((i: { id: number }) => i.id === a.id)
                                ? 'bg-[var(--color-primary)] text-[var(--color-base)]'
                                : 'bg-[var(--color-content)] text-[var(--color-ink)]/70 hover:text-[var(--color-primary)]'
                            }`}
                          >
                            1R 픽
                          </button>
                          <button
                            onClick={() => toggleAgentPick(a.id, 2)}
                            className={`py-0.5 rounded text-[8px] font-extrabold transition-all ${
                              me.party2.agents.some((i: { id: number }) => i.id === a.id)
                                ? 'bg-[var(--color-primary)] text-[var(--color-base)]'
                                : 'bg-[var(--color-content)] text-[var(--color-ink)]/70 hover:text-[var(--color-primary)]'
                            }`}
                          >
                            2R 픽
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  )
}

export default V2PlayerPlay
