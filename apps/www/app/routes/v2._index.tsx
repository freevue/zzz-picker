import { useStore } from '@zzz-picker/provider/hooks'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useNavigate } from '@remix-run/react'
import {
  GAME_TYPE,
  BANPICK_PHASE,
  DEFAULT_PARTY,
  DEFAULT_SESSION,
  useV2Sync
} from '../utils/v2Bridge'
import type { PlaySession, Party } from '../utils/v2Bridge'

const V2Playground: React.FC = () => {
  const { agents: agentMap, boss: bossMap, engines: engineMap } = useStore()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // 1. URL 쿼리 파라미터에서 방 ID 감지 및 자동 생성 리디렉션
  const roomId = searchParams.get('room') || ''

  useEffect(() => {
    if (!roomId) {
      const mockUuid = `v2-session-${Math.random().toString(36).substring(2, 11).toUpperCase()}`
      navigate(`/v2?room=${mockUuid}`, { replace: true })
    }
  }, [roomId, navigate])

  // v2 다크테마 바인딩
  useEffect(() => {
    document.documentElement.classList.add('v2')
    return () => {
      document.documentElement.classList.remove('v2')
    }
  }, [])

  // 2. 가상 실시간 동기화 브릿지 바인딩
  // roomId가 없을 때는 기본 세션 스펙을 렌더링
  const [session, updateSession] = useV2Sync(roomId, DEFAULT_SESSION(roomId || 'MOCK-INIT'))

  // 닉네임 로컬 상태 (인풋 입력 편의를 위해 로컬 상태로 들고 있다가 블러/제출 시 전파)
  const [nicknameA, setNicknameA] = useState(session.A.nickname)
  const [nicknameB, setNicknameB] = useState(session.B.nickname)

  // 동기화된 세션이 외부에서 바뀌면 닉네임 동기화
  useEffect(() => {
    setNicknameA(session.A.nickname)
    setNicknameB(session.B.nickname)
  }, [session.A.nickname, session.B.nickname])

  // 복사 토스트 알림 상태
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // 에이전트 / 엔진 돌파 상세 조절 믹서 상태
  const [selectedAgentForEdit, setSelectedAgentForEdit] = useState<number | null>(null)
  const [agentRate, setAgentRate] = useState<number>(0)
  const [selectedEngineId, setSelectedEngineId] = useState<number | null>(null)
  const [engineRate, setEngineRate] = useState<number>(1)
  const [currentEditSide, setCurrentEditSide] = useState<'A' | 'B' | null>(null)
  const [currentEditRound, setCurrentEditRound] = useState<1 | 2 | null>(null)

  // Map 데이터를 어레이로 정제
  const agentList = useMemo(() => Array.from(agentMap.values()).filter(a => a.isAllow), [agentMap])
  const bossList = useMemo(() => Array.from(bossMap.values()), [bossMap])
  const engineList = useMemo(() => Array.from(engineMap.values()), [engineMap])

  // 3. 지능형 경기 타입(탭) 전환 상태머신 룰셋 탑재
  const handleTabChange = (targetTab: GAME_TYPE) => {
    const currentTab = session.activeTab

    // A/B 밴 진행 도중 (BAN_PHASE)에는 상태머신 오작동을 막기 위해 탭 이동 불가
    if (session.phase === BANPICK_PHASE.BAN) {
      alert('밴 단계가 진행 중인 동안에는 경기 타입을 변경할 수 없습니다.')
      return
    }

    // Original / Legend <-> Unlimited 전환 시 경고 컨펌 모달 노출 (보스 규칙 및 밴 유무 다름)
    const isCrossSwitch = 
      (currentTab !== GAME_TYPE.UNLIMITED && targetTab === GAME_TYPE.UNLIMITED) ||
      (currentTab === GAME_TYPE.UNLIMITED && targetTab !== GAME_TYPE.UNLIMITED)

    if (isCrossSwitch) {
      const confirmChange = window.confirm(
        '공허사냥꾼(Unlimited) 모드는 경기 보스 및 밴 단계의 규칙이 서로 달라 일부 밴픽 상태가 자동으로 마이그레이션 및 리셋됩니다. 계속 진행하시겠습니까?'
      )
      if (!confirmChange) return
    }

    updateSession((prev: PlaySession) => {
      let nextPhase = prev.phase
      let nextCommonBossId = prev.commonBossId
      let nextBossA1 = prev.A.party1.bossId
      let nextBossA2 = prev.A.party2.bossId
      let nextBossB1 = prev.B.party1.bossId
      let nextBossB2 = prev.B.party2.bossId
      let nextBanListA = [...prev.A.banList]
      let nextBanListB = [...prev.B.banList]
      let nextPartyA1 = { ...prev.A.party1 }
      let nextPartyA2 = { ...prev.A.party2 }
      let nextPartyB1 = { ...prev.B.party1 }
      let nextPartyB2 = { ...prev.B.party2 }

      // --- [1] Boss 마이그레이션 룰 ---
      if (prev.activeTab !== GAME_TYPE.UNLIMITED && targetTab === GAME_TYPE.UNLIMITED) {
        // Original/Legend -> Unlimited
        // 1R 보스 유지
        // 2R 보스는 원래 B선수 보스로 고정되어 있었으므로 초기 채워주기(Fallback)
        nextBossA2 = prev.B.party1.bossId
        nextBossB2 = prev.B.party1.bossId
      } else if (prev.activeTab === GAME_TYPE.UNLIMITED && targetTab !== GAME_TYPE.UNLIMITED) {
        // Unlimited -> Original/Legend
        // 2R 보스는 규정상 무조건 B선수의 1R 보스를 공용으로 강제 매칭
        nextCommonBossId = prev.B.party1.bossId
        nextBossA2 = prev.B.party1.bossId
        nextBossB2 = prev.B.party1.bossId
      }

      // --- [2] Ban 스마트 라이프사이클 제어 ---
      if (targetTab === GAME_TYPE.UNLIMITED) {
        // Unlimited로 갈 때는 기존 밴은 삭제하지 않고 메모리에 둔 채 픽 필터링만 생략
        // 페이즈가 BAN이면 바로 PICK으로 스킵
        if (nextPhase === BANPICK_PHASE.BAN) {
          nextPhase = BANPICK_PHASE.PICK
        }
      } else {
        // Original/Legend로 돌아올 때
        if (prev.activeTab === GAME_TYPE.UNLIMITED && prev.phase === BANPICK_PHASE.PICK) {
          // 기존 밴 데이터가 완전히 비어있다면 밴 페이즈로 강제 역전환
          if (nextBanListA.length === 0 && nextBanListB.length === 0) {
            nextPhase = BANPICK_PHASE.BAN
          }
        }
      }

      // 파티의 보스 할당 최신화
      nextPartyA1.bossId = nextBossA1
      nextPartyA2.bossId = nextBossA2
      nextPartyB1.bossId = nextBossB1
      nextPartyB2.bossId = nextBossB2

      return {
        ...prev,
        activeTab: targetTab,
        phase: nextPhase,
        commonBossId: nextCommonBossId,
        A: {
          ...prev.A,
          party1: nextPartyA1,
          party2: nextPartyA2,
          banList: nextBanListA
        },
        B: {
          ...prev.B,
          party1: nextPartyB1,
          party2: nextPartyB2,
          banList: nextBanListB
        }
      }
    })

    setToastMessage(`경기 모드가 '${
      targetTab === GAME_TYPE.ORIGINAL ? '정식 로프꾼' : targetTab === GAME_TYPE.LEGEND ? '레전드 로프꾼' : '공허사냥꾼'
    }'으로 성공적으로 전환되었습니다.`)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // 닉네임 입력 전파
  const handleNicknameBlur = (side: 'A' | 'B', nickname: string) => {
    updateSession((prev: PlaySession) => ({
      ...prev,
      [side]: { ...prev[side], nickname: nickname.trim() }
    }))
  }

  // 참가 링크 클립보드 복사
  const handleCopyLink = (role: 'A' | 'B' | 'VIEW', nickname?: string) => {
    if (!roomId) return
    let url = ''
    if (role === 'VIEW') {
      url = `${window.location.origin}/v2/view?room=${roomId}`
      setToastMessage(`🎥 관전자/방송용 뷰 중계 링크가 복사되었습니다!`)
    } else {
      url = `${window.location.origin}/v2/play?role=${role}&room=${roomId}`
      setToastMessage(`🔗 선수 ${nickname || role}의 전용 밴픽 링크가 복사되었습니다!`)
    }
    navigator.clipboard.writeText(url)
    setTimeout(() => setToastMessage(null), 3000)
  }

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

  const costA = useMemo(() => calculateCost(session.A.party1) + calculateCost(session.A.party2), [session.A.party1, session.A.party2])
  const costB = useMemo(() => calculateCost(session.B.party1) + calculateCost(session.B.party2), [session.B.party1, session.B.party2])

  // 보스 선택 제어
  const selectBoss = (bossId: number, side?: 'A' | 'B', round?: 1 | 2) => {
    updateSession((prev: PlaySession) => {
      let nextCommonBossId = prev.commonBossId
      let nextBossA1 = prev.A.party1.bossId
      let nextBossA2 = prev.A.party2.bossId
      let nextBossB1 = prev.B.party1.bossId
      let nextBossB2 = prev.B.party2.bossId

      if (prev.activeTab === GAME_TYPE.UNLIMITED) {
        // 공허사냥꾼은 1R, 2R A/B 모두 개별 보스
        if (side === 'A') {
          if (round === 1) nextBossA1 = bossId
          else nextBossA2 = bossId
        } else {
          if (round === 1) nextBossB1 = bossId
          else nextBossB2 = bossId
        }
      } else {
        // Original/Legend
        if (side === 'A') {
          // A선수 1R
          nextBossA1 = bossId
        } else if (side === 'B') {
          // B선수 1R이자 동시에 2R 공용 보스로 강제 할당
          nextBossB1 = bossId
          nextCommonBossId = bossId
          nextBossA2 = bossId
          nextBossB2 = bossId
        }
      }

      return {
        ...prev,
        commonBossId: nextCommonBossId,
        A: {
          ...prev.A,
          party1: { ...prev.A.party1, bossId: nextBossA1 },
          party2: { ...prev.A.party2, bossId: nextBossA2 }
        },
        B: {
          ...prev.B,
          party1: { ...prev.B.party1, bossId: nextBossB1 },
          party2: { ...prev.B.party2, bossId: nextBossB2 }
        }
      }
    })
  }

  // 보스 선택 완료 검증 및 밴 진입
  const completeBossSelect = () => {
    if (session.activeTab === GAME_TYPE.UNLIMITED) {
      if (session.A.party1.bossId && session.A.party2.bossId && session.B.party1.bossId && session.B.party2.bossId) {
        updateSession((prev: PlaySession) => ({ ...prev, phase: BANPICK_PHASE.PICK })) // 무제한은 밴단계 스킵
      } else {
        alert('모든 라운드의 선수 보스가 완료되어야 합니다.')
      }
    } else {
      if (session.A.party1.bossId && session.B.party1.bossId) {
        updateSession((prev: PlaySession) => ({ ...prev, phase: BANPICK_PHASE.BAN }))
      } else {
        alert('양 선수의 1라운드 보스를 선택해 주세요. (B선수 픽은 2R 공용으로 매칭됩니다.)')
      }
    }
  }

  // 밴 토글
  const toggleBan = (agentId: number, side: 'A' | 'B') => {
    updateSession((prev: PlaySession) => {
      const currentBans = prev[side].banList
      if (currentBans.includes(agentId)) {
        return {
          ...prev,
          [side]: { ...prev[side], banList: currentBans.filter((id: number) => id !== agentId) }
        }
      } else {
        if (currentBans.length >= 2) {
          alert('팀당 밴 카드는 최대 2개까지만 가능합니다.')
          return prev
        }
        return {
          ...prev,
          [side]: { ...prev[side], banList: [...currentBans, agentId] }
        }
      }
    })
  }

  // 밴 완료 및 스마트 픽 강제 축출 (Smart Eviction) 처리 포함
  const completeBan = () => {
    updateSession((prev: PlaySession) => {
      const allBanned = [...prev.A.banList, ...prev.B.banList]

      // 스마트 픽 배제 (Smart Eviction): 새로 설정된 밴에 걸린 캐릭터를 기존 픽에서 강제 강등 처리
      const filterBannedAgents = (agents: Party['agents']) =>
        agents.filter((a: { id: number }) => !allBanned.includes(a.id))

      return {
        ...prev,
        phase: BANPICK_PHASE.PICK,
        A: {
          ...prev.A,
          party1: { ...prev.A.party1, agents: filterBannedAgents(prev.A.party1.agents) },
          party2: { ...prev.A.party2, agents: filterBannedAgents(prev.A.party2.agents) }
        },
        B: {
          ...prev.B,
          party1: { ...prev.B.party1, agents: filterBannedAgents(prev.B.party1.agents) },
          party2: { ...prev.B.party2, agents: filterBannedAgents(prev.B.party2.agents) }
        }
      }
    })

    setToastMessage('밴 구성원 조율이 완료되었으며, 밴 목록에 포함된 캐릭터들은 파티 구성에서 스마트하게 자동 제외되었습니다!')
    setTimeout(() => setToastMessage(null), 3500)
  }

  // 파티 픽 제어 (캐릭터 배치)
  const toggleAgentPick = (agentId: number, side: 'A' | 'B', round: 1 | 2) => {
    const partyKey = round === 1 ? 'party1' : 'party2'
    const targetParty = session[side][partyKey]

    // 밴 필터링 적용 (Unlimited의 경우 밴 리스트는 존재하나 픽 필터링을 생략함)
    if (session.activeTab !== GAME_TYPE.UNLIMITED) {
      const isBanned = session.A.banList.includes(agentId) || session.B.banList.includes(agentId)
      if (isBanned) {
        alert('해당 경기 규칙에서 밴 당한 에이전트는 배치할 수 없습니다.')
        return
      }
    }

    if (targetParty.agents.some((a: { id: number }) => a.id === agentId)) {
      // 이미 배치되어 있으면 파티에서 강등 처리
      updateSession((prev: PlaySession) => ({
        ...prev,
        [side]: {
          ...prev[side],
          [partyKey]: {
            ...prev[side][partyKey],
            agents: prev[side][partyKey].agents.filter((a: { id: number }) => a.id !== agentId)
          }
        }
      }))
      if (selectedAgentForEdit === agentId) {
        setSelectedAgentForEdit(null)
      }
      return
    }

    if (targetParty.agents.length >= 3) {
      alert('라운드별 한 파티의 최대 탑승 인원은 3명입니다.')
      return
    }

    // 신규 추가
    const newAgent = { id: agentId, rate: 0, engineId: null, engineRate: 1 }
    updateSession((prev: PlaySession) => ({
      ...prev,
      [side]: {
        ...prev[side],
        [partyKey]: {
          ...prev[side][partyKey],
          agents: [...prev[side][partyKey].agents, newAgent]
        }
      }
    }))

    // 편의상 성급 믹서 활성화
    setSelectedAgentForEdit(agentId)
    setAgentRate(0)
    setSelectedEngineId(null)
    setEngineRate(1)
    setCurrentEditSide(side)
    setCurrentEditRound(round)
  }

  // 세부 스펙 반영
  const handleUpdateAgentDetails = () => {
    if (!currentEditSide || !currentEditRound || selectedAgentForEdit === null) return
    const partyKey = currentEditRound === 1 ? 'party1' : 'party2'

    updateSession((prev: PlaySession) => {
      const party = prev[currentEditSide][partyKey]
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
        [currentEditSide]: {
          ...prev[currentEditSide],
          [partyKey]: { ...party, agents: updatedAgents }
        }
      }
    })

    setSelectedAgentForEdit(null)
    setToastMessage('에이전트 돌파 성급 및 W-엔진 재련 정보가 반영되었습니다.')
    setTimeout(() => setToastMessage(null), 2500)
  }

  return (
    <div className="w-full min-h-screen bg-[var(--color-base)] text-[var(--color-ink)] p-6 font-sans select-none flex flex-col gap-6">
      
      {/* 초고속 양방향 알림 토스트 */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[var(--color-content)] border-l-4 border-[var(--color-primary)] px-6 py-4 rounded-md shadow-2xl flex items-center gap-3 transition-all duration-300">
          <span className="text-[var(--color-primary)] text-lg">⚙️</span>
          <span className="text-[var(--color-ink)] font-bold text-sm tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* 헤더 패널 */}
      <div className="w-full bg-[var(--color-content)] rounded-xl p-5 flex items-center justify-between shadow-inner relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-full bg-gradient-to-l from-[var(--color-primary)]/5 to-transparent skew-x-12 pointer-events-none" />
        
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold tracking-wider text-[var(--color-primary)] flex items-center gap-3">
            <span>ZZZ-PICKER v2</span>
            <span className="text-xs bg-[var(--color-netural)] px-3 py-1 rounded text-[var(--color-ink)] font-bold tracking-widest border border-[var(--color-primary)]/10">
              ADMIN CONTROL
            </span>
          </h1>
          <p className="text-xs text-[var(--color-ink)]/50">
            가상 실시간 동기화 브릿지가 활성화되어 모든 참가자와 관전자 화면이 1ms 이내로 동시 갱신됩니다.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* 중계방 링크 복사 */}
          <button
            onClick={() => handleCopyLink('VIEW')}
            className="bg-[var(--color-netural)] text-xs text-[var(--color-secondary)] border border-[var(--color-secondary)]/20 px-4 py-2.5 rounded-lg font-bold hover:bg-[var(--color-secondary)]/10 transition-all flex items-center gap-1.5"
          >
            <span>🎥</span>
            <span>방송 중계 링크 복사</span>
          </button>
          
          <div className="flex items-center gap-3 bg-[var(--color-base)] px-4 py-2 rounded-lg border border-[var(--color-netural)]">
            <span className="text-[10px] text-[var(--color-ink)]/40 font-bold font-mono">ROOM_ID:</span>
            <span className="text-xs font-mono text-[var(--color-secondary)] font-extrabold">{roomId || 'GENERATING...'}</span>
          </div>
        </div>
      </div>

      {/* 3대 경기 타입 스위칭 탭 */}
      <div className="w-full bg-[var(--color-content)] p-1.5 rounded-xl flex items-center gap-2 shadow-inner">
        {(Object.keys(GAME_TYPE) as Array<keyof typeof GAME_TYPE>).map(key => {
          const typeVal = GAME_TYPE[key]
          const isSelected = session.activeTab === typeVal
          const isBanPhase = session.phase === BANPICK_PHASE.BAN
          return (
            <button
              key={typeVal}
              disabled={isBanPhase}
              onClick={() => handleTabChange(typeVal)}
              className={`flex-1 py-3.5 text-center rounded-lg font-bold tracking-widest text-sm transition-all relative ${
                isSelected
                  ? 'bg-[var(--color-primary)] text-[var(--color-base)] shadow-lg'
                  : 'text-[var(--color-ink)]/60 hover:bg-[var(--color-netural)] hover:text-[var(--color-ink)] disabled:opacity-30 disabled:cursor-not-allowed'
              }`}
            >
              {typeVal === GAME_TYPE.ORIGINAL ? '정식 로프꾼' : typeVal === GAME_TYPE.LEGEND ? '레전드 로프꾼' : '공허사냥꾼'}
              {isBanPhase && <span className="absolute top-1 right-2 text-[8px] text-[var(--color-tertiary)] font-bold">LOCKED</span>}
            </button>
          )
        })}
      </div>

      {/* 메인 레이아웃 */}
      <div className="w-full flex gap-6 flex-col xl:flex-row flex-1">
        
        {/* 좌측 패널 */}
        <div className="w-full xl:w-1/4 flex flex-col gap-6">
          
          {/* 닉네임 설정 및 참가자 링크 배포 */}
          <div className="bg-[var(--color-content)] rounded-2xl p-5 flex flex-col gap-4 shadow-sm border border-[var(--color-netural)]/40">
            <h2 className="text-sm font-bold text-[var(--color-secondary)] tracking-wider border-b border-[var(--color-netural)] pb-2 flex items-center justify-between">
              <span>👥 참가자 닉네임 등록 및 배포</span>
              <span className="text-[10px] text-[var(--color-ink)]/30 font-mono font-bold">CONFIG</span>
            </h2>

            {/* A선수 */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-bold text-[var(--color-ink)]/70">
                <span>선수 A (Side A)</span>
                {session.A.submitted && <span className="text-[10px] bg-[var(--color-secondary)]/15 text-[var(--color-secondary)] px-2 py-0.5 rounded font-black tracking-wider">제출완료</span>}
              </div>
              <input
                type="text"
                placeholder="A선수 닉네임을 기입하고 포커스를 해제하세요"
                value={nicknameA}
                onChange={e => setNicknameA(e.target.value)}
                onBlur={() => handleNicknameBlur('A', nicknameA)}
                className="bg-[var(--color-base)] text-[var(--color-ink)] rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-secondary)] placeholder:text-[var(--color-ink)]/20 w-full"
              />
              <button
                disabled={!session.A.nickname.trim()}
                onClick={() => handleCopyLink('A', session.A.nickname)}
                className={`py-2 px-3 rounded-lg text-xs font-black tracking-wider transition-all text-center flex items-center justify-center gap-1.5 ${
                  session.A.nickname.trim()
                    ? 'bg-[var(--color-primary)] text-[var(--color-base)] cursor-pointer hover:opacity-90 shadow'
                    : 'bg-[var(--color-disabled)]/10 text-[var(--color-ink)]/20 cursor-not-allowed'
                }`}
              >
                <span>🔗</span>
                <span>선수 A 밴픽 전송링크 복사</span>
              </button>
            </div>

            {/* B선수 */}
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex justify-between items-center text-xs font-bold text-[var(--color-ink)]/70">
                <span>선수 B (Side B)</span>
                {session.B.submitted && <span className="text-[10px] bg-[var(--color-secondary)]/15 text-[var(--color-secondary)] px-2 py-0.5 rounded font-black tracking-wider">제출완료</span>}
              </div>
              <input
                type="text"
                placeholder="B선수 닉네임을 기입하고 포커스를 해제하세요"
                value={nicknameB}
                onChange={e => setNicknameB(e.target.value)}
                onBlur={() => handleNicknameBlur('B', nicknameB)}
                className="bg-[var(--color-base)] text-[var(--color-ink)] rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-secondary)] placeholder:text-[var(--color-ink)]/20 w-full"
              />
              <button
                disabled={!session.B.nickname.trim()}
                onClick={() => handleCopyLink('B', session.B.nickname)}
                className={`py-2 px-3 rounded-lg text-xs font-black tracking-wider transition-all text-center flex items-center justify-center gap-1.5 ${
                  session.B.nickname.trim()
                    ? 'bg-[var(--color-primary)] text-[var(--color-base)] cursor-pointer hover:opacity-90 shadow'
                    : 'bg-[var(--color-disabled)]/10 text-[var(--color-ink)]/20 cursor-not-allowed'
                }`}
              >
                <span>🔗</span>
                <span>선수 B 밴픽 전송링크 복사</span>
              </button>
            </div>
          </div>

          {/* 모니터링 및 실시간 리포트 */}
          <div className="bg-[var(--color-content)] rounded-2xl p-5 flex flex-col gap-4 flex-1 shadow-sm border border-[var(--color-netural)]/40">
            <h2 className="text-sm font-bold text-[var(--color-secondary)] tracking-wider border-b border-[var(--color-netural)] pb-2 flex items-center justify-between">
              <span>📊 경기 구성 모니터 현황</span>
              <span className="text-[10px] bg-[var(--color-netural)] text-[var(--color-primary)] font-mono font-bold px-2 py-0.5 rounded border border-[var(--color-primary)]/10">
                {session.phase}
              </span>
            </h2>

            {/* 보스 현황 */}
            <div className="flex flex-col gap-1.5 text-xs">
              <span className="text-[var(--color-ink)]/50 font-bold">지정 보스 스펙:</span>
              <div className="bg-[var(--color-base)] p-3 rounded-lg flex flex-col gap-2 border border-[var(--color-netural)]">
                {session.activeTab === GAME_TYPE.UNLIMITED ? (
                  <>
                    <div>A선수 1R 보스: <span className="text-[var(--color-primary)] font-bold">{bossMap.get(session.A.party1.bossId || 0)?.nameKo || '미지정'}</span></div>
                    <div>A선수 2R 보스: <span className="text-[var(--color-primary)] font-bold">{bossMap.get(session.A.party2.bossId || 0)?.nameKo || '미지정'}</span></div>
                    <div className="border-t border-[var(--color-netural)]/40 my-1" />
                    <div>B선수 1R 보스: <span className="text-[var(--color-primary)] font-bold">{bossMap.get(session.B.party1.bossId || 0)?.nameKo || '미지정'}</span></div>
                    <div>B선수 2R 보스: <span className="text-[var(--color-primary)] font-bold">{bossMap.get(session.B.party2.bossId || 0)?.nameKo || '미지정'}</span></div>
                  </>
                ) : (
                  <>
                    <div>A선수 1R 보스: <span className="text-[var(--color-primary)] font-bold">{bossMap.get(session.A.party1.bossId || 0)?.nameKo || '미지정'}</span></div>
                    <div>B선수 1R 보스: <span className="text-[var(--color-primary)] font-bold">{bossMap.get(session.B.party1.bossId || 0)?.nameKo || '미지정'}</span></div>
                    <div>2R 공용 보스: <span className="text-[var(--color-secondary)] font-bold">{bossMap.get(session.commonBossId || 0)?.nameKo || 'B선수 1R에 매칭'}</span></div>
                  </>
                )}
              </div>
            </div>

            {/* 밴 현황 (공허사냥꾼은 밴 리스트 렌더링 무시) */}
            {session.activeTab !== GAME_TYPE.UNLIMITED && (
              <div className="flex flex-col gap-1.5 text-xs">
                <span className="text-[var(--color-ink)]/50 font-bold">밴 카드 지정:</span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[var(--color-base)] p-2.5 rounded-lg border border-[var(--color-netural)]">
                    <div className="font-extrabold text-[var(--color-ink)]/60 text-[10px] mb-1">A선수 밴</div>
                    <div className="flex gap-1 flex-wrap">
                      {session.A.banList.length > 0 ? (
                        session.A.banList.map((id: number) => (
                          <span key={id} className="bg-[var(--color-tertiary)]/15 text-[var(--color-tertiary)] font-extrabold px-1.5 py-0.5 rounded text-[10px]">
                            {agentMap.get(id)?.nameKo}
                          </span>
                        ))
                      ) : (
                        <span className="text-[var(--color-ink)]/25">지정 무</span>
                      )}
                    </div>
                  </div>
                  <div className="bg-[var(--color-base)] p-2.5 rounded-lg border border-[var(--color-netural)]">
                    <div className="font-extrabold text-[var(--color-ink)]/60 text-[10px] mb-1">B선수 밴</div>
                    <div className="flex gap-1 flex-wrap">
                      {session.B.banList.length > 0 ? (
                        session.B.banList.map((id: number) => (
                          <span key={id} className="bg-[var(--color-tertiary)]/15 text-[var(--color-tertiary)] font-extrabold px-1.5 py-0.5 rounded text-[10px]">
                            {agentMap.get(id)?.nameKo}
                          </span>
                        ))
                      ) : (
                        <span className="text-[var(--color-ink)]/25">지정 무</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 정식 로프꾼 코스트 (Cost가 24를 넘으면 빨간색으로만 가볍게 경고 표시 - 피드백 반영 완료) */}
            {session.activeTab === GAME_TYPE.ORIGINAL && (
              <div className="flex flex-col gap-2 mt-2 bg-[var(--color-netural)] p-3 rounded-xl border border-[var(--color-netural)]/50">
                <span className="text-[11px] font-bold text-[var(--color-ink)]/50">⚖️ 코스트 합계 지표 (정식 로프꾼 24 Cost)</span>
                <div className="flex justify-between items-center text-xs font-extrabold mt-1">
                  <div>
                    A선수:{' '}
                    <span className={costA > 24 ? 'text-[var(--color-tertiary)] text-sm font-black' : 'text-[var(--color-primary)]'}>
                      {costA} / 24
                    </span>
                  </div>
                  <div>
                    B선수:{' '}
                    <span className={costB > 24 ? 'text-[var(--color-tertiary)] text-sm font-black' : 'text-[var(--color-primary)]'}>
                      {costB} / 24
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 우측 패널 */}
        <div className="w-full xl:w-3/4 bg-[var(--color-content)] rounded-2xl p-5 flex flex-col gap-6 shadow-sm border border-[var(--color-netural)]/40">
          
          {/* 현재 단계 인디케이터 */}
          <div className="flex justify-between items-center bg-[var(--color-base)] p-3.5 rounded-xl border border-[var(--color-netural)]">
            <span className="text-[10px] font-bold text-[var(--color-ink)]/40 tracking-wider">밴픽 단계 스펙:</span>
            <div className="flex gap-4 items-center text-xs font-bold">
              <span className={`tracking-wider ${session.phase === BANPICK_PHASE.BOSS_SELECT ? 'text-[var(--color-primary)] font-black' : 'text-[var(--color-ink)]/20'}`}>
                1. 보스 매칭
              </span>
              <span className="text-[var(--color-ink)]/10">&gt;</span>
              {session.activeTab !== GAME_TYPE.UNLIMITED ? (
                <>
                  <span className={`tracking-wider ${session.phase === BANPICK_PHASE.BAN ? 'text-[var(--color-primary)] font-black' : 'text-[var(--color-ink)]/20'}`}>
                    2. 선수 밴 카드
                  </span>
                  <span className="text-[var(--color-ink)]/10">&gt;</span>
                </>
              ) : null}
              <span className={`tracking-wider ${session.phase === BANPICK_PHASE.PICK ? 'text-[var(--color-primary)] font-black' : 'text-[var(--color-ink)]/20'}`}>
                3. 라운드 파티 빌드
              </span>
            </div>
          </div>

          {/* 에이전트 / 무기 세부 돌파/재련 성급 조절 믹서 (소프트 테크-레이어링 입체감 팝업) */}
          {selectedAgentForEdit !== null && (
            <div className="bg-[var(--color-netural)] p-5 rounded-xl flex flex-col gap-4 border-l-4 border-[var(--color-secondary)] shadow-lg relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-[var(--color-secondary)]/5 to-transparent skew-x-12 pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-[var(--color-base)] pb-2.5">
                <span className="text-xs font-bold text-[var(--color-secondary)] tracking-wider">
                  🛠️ 에이전트 & W-엔진 상세 돌파 레벨 설정
                </span>
                <span className="text-sm font-extrabold text-[var(--color-primary)] tracking-wide">
                  {agentMap.get(selectedAgentForEdit)?.nameKo}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                {/* 에이전트 돌파 (0~6돌) */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-[var(--color-ink)]/50 tracking-wider">에이전트 돌파 등급</label>
                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3, 4, 5, 6].map(val => (
                      <button
                        key={val}
                        onClick={() => setAgentRate(val)}
                        className={`flex-1 py-2 text-center rounded-lg transition-all font-black text-xs ${
                          agentRate === val ? 'bg-[var(--color-primary)] text-[var(--color-base)]' : 'bg-[var(--color-base)] text-[var(--color-ink)] hover:bg-[var(--color-base)]/80'
                        }`}
                      >
                        {val}돌
                      </button>
                    ))}
                  </div>
                </div>

                {/* 무기/엔진 장착 및 재련 (1~5재) */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-[var(--color-ink)]/50 tracking-wider">장착 W-엔진 및 재련 등급</label>
                  <div className="flex gap-2">
                    <select
                      value={selectedEngineId || ''}
                      onChange={e => setSelectedEngineId(e.target.value ? Number(e.target.value) : null)}
                      className="bg-[var(--color-base)] text-[var(--color-ink)] rounded-lg px-3 py-2 text-xs flex-1 outline-none border border-[var(--color-netural)] focus:ring-1 focus:ring-[var(--color-secondary)]"
                    >
                      <option value="">W-엔진 장착 안 함</option>
                      {engineList
                        .filter(e => e.exclusiveAgentId === selectedAgentForEdit || e.rank === 'A' || e.rank === 'B')
                        .map(e => (
                          <option key={e.id} value={e.id}>
                            [{e.rank}급] {e.nameKo} {e.exclusiveAgentId === selectedAgentForEdit ? '(전용)' : ''}
                          </option>
                        ))}
                    </select>

                    {selectedEngineId && (
                      <div className="flex gap-1 flex-1">
                        {[1, 2, 3, 4, 5].map(val => (
                          <button
                            key={val}
                            onClick={() => setEngineRate(val)}
                            className={`flex-1 py-1.5 text-center rounded-lg transition-all font-black text-xs ${
                              engineRate === val ? 'bg-[var(--color-primary)] text-[var(--color-base)]' : 'bg-[var(--color-base)] text-[var(--color-ink)] hover:bg-[var(--color-base)]/80'
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-1.5">
                <button
                  onClick={() => setSelectedAgentForEdit(null)}
                  className="bg-[var(--color-base)] text-[var(--color-ink)]/50 px-4 py-2 rounded-lg text-xs hover:text-[var(--color-ink)] font-bold transition-all"
                >
                  취소
                </button>
                <button
                  onClick={handleUpdateAgentDetails}
                  className="bg-[var(--color-secondary)] text-[var(--color-base)] px-5 py-2 rounded-lg text-xs hover:opacity-90 font-bold shadow transition-all"
                >
                  반영하기
                </button>
              </div>
            </div>
          )}

          {/* 1. 보스 선택 보드 */}
          {session.phase === BANPICK_PHASE.BOSS_SELECT && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-[var(--color-primary)] tracking-widest uppercase">
                🕹️ 보스 지정 단계
              </h3>

              {session.activeTab === GAME_TYPE.UNLIMITED ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* A선수 */}
                  <div className="bg-[var(--color-base)] p-4 rounded-xl flex flex-col gap-3 border border-[var(--color-netural)]">
                    <span className="text-xs font-bold text-[var(--color-secondary)]">선수 A 개별 보스 매칭</span>
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] text-[var(--color-ink)]/55">1라운드 보스:</span>
                        <div className="grid grid-cols-3 gap-2">
                          {bossList.map(b => (
                            <button
                              key={b.id}
                              onClick={() => selectBoss(b.id, 'A', 1)}
                              className={`py-2 text-center text-xs font-extrabold rounded-lg transition-all ${
                                session.A.party1.bossId === b.id
                                  ? 'bg-[var(--color-primary)] text-[var(--color-base)]'
                                  : 'bg-[var(--color-content)] text-[var(--color-ink)]/60 hover:bg-[var(--color-netural)] border border-[var(--color-netural)]/10'
                              }`}
                            >
                              {b.nameKo}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] text-[var(--color-ink)]/55">2라운드 보스:</span>
                        <div className="grid grid-cols-3 gap-2">
                          {bossList.map(b => (
                            <button
                              key={b.id}
                              onClick={() => selectBoss(b.id, 'A', 2)}
                              className={`py-2 text-center text-xs font-extrabold rounded-lg transition-all ${
                                session.A.party2.bossId === b.id
                                  ? 'bg-[var(--color-primary)] text-[var(--color-base)]'
                                  : 'bg-[var(--color-content)] text-[var(--color-ink)]/60 hover:bg-[var(--color-netural)] border border-[var(--color-netural)]/10'
                              }`}
                            >
                              {b.nameKo}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* B선수 */}
                  <div className="bg-[var(--color-base)] p-4 rounded-xl flex flex-col gap-3 border border-[var(--color-netural)]">
                    <span className="text-xs font-bold text-[var(--color-secondary)]">선수 B 개별 보스 매칭</span>
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] text-[var(--color-ink)]/55">1라운드 보스:</span>
                        <div className="grid grid-cols-3 gap-2">
                          {bossList.map(b => (
                            <button
                              key={b.id}
                              onClick={() => selectBoss(b.id, 'B', 1)}
                              className={`py-2 text-center text-xs font-extrabold rounded-lg transition-all ${
                                session.B.party1.bossId === b.id
                                  ? 'bg-[var(--color-primary)] text-[var(--color-base)]'
                                  : 'bg-[var(--color-content)] text-[var(--color-ink)]/60 hover:bg-[var(--color-netural)] border border-[var(--color-netural)]/10'
                              }`}
                            >
                              {b.nameKo}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] text-[var(--color-ink)]/55">2라운드 보스:</span>
                        <div className="grid grid-cols-3 gap-2">
                          {bossList.map(b => (
                            <button
                              key={b.id}
                              onClick={() => selectBoss(b.id, 'B', 2)}
                              className={`py-2 text-center text-xs font-extrabold rounded-lg transition-all ${
                                session.B.party2.bossId === b.id
                                  ? 'bg-[var(--color-primary)] text-[var(--color-base)]'
                                  : 'bg-[var(--color-content)] text-[var(--color-ink)]/60 hover:bg-[var(--color-netural)] border border-[var(--color-netural)]/10'
                              }`}
                            >
                              {b.nameKo}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* A선수 1R */}
                  <div className="bg-[var(--color-base)] p-4 rounded-xl flex flex-col gap-3 border border-[var(--color-netural)]">
                    <span className="text-xs font-bold text-[var(--color-secondary)]">선수 A 1R 보스 지정</span>
                    <div className="grid grid-cols-3 gap-2">
                      {bossList.map(b => (
                        <button
                          key={b.id}
                          onClick={() => selectBoss(b.id, 'A')}
                          className={`py-3 text-center text-xs font-extrabold rounded-lg transition-all ${
                            session.A.party1.bossId === b.id
                              ? 'bg-[var(--color-primary)] text-[var(--color-base)]'
                              : 'bg-[var(--color-content)] text-[var(--color-ink)]/60 hover:bg-[var(--color-netural)] border border-[var(--color-netural)]/10'
                          }`}
                        >
                          {b.nameKo}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* B선수 1R */}
                  <div className="bg-[var(--color-base)] p-4 rounded-xl flex flex-col gap-3 border border-[var(--color-netural)]">
                    <span className="text-xs font-bold text-[var(--color-secondary)]">선수 B 1R 보스 지정 (2R 공통 적용됨)</span>
                    <div className="grid grid-cols-3 gap-2">
                      {bossList.map(b => (
                        <button
                          key={b.id}
                          onClick={() => selectBoss(b.id, 'B')}
                          className={`py-3 text-center text-xs font-extrabold rounded-lg transition-all ${
                            session.B.party1.bossId === b.id
                              ? 'bg-[var(--color-primary)] text-[var(--color-base)]'
                              : 'bg-[var(--color-content)] text-[var(--color-ink)]/60 hover:bg-[var(--color-netural)] border border-[var(--color-netural)]/10'
                          }`}
                        >
                          {b.nameKo}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={completeBossSelect}
                className="bg-[var(--color-secondary)] text-[var(--color-base)] py-3 px-6 rounded-lg font-black tracking-wider text-xs hover:opacity-95 self-end mt-4 shadow"
              >
                보스 매칭 완료하고 다음으로 진입
              </button>
            </div>
          )}

          {/* 2. 밴 보드 */}
          {session.phase === BANPICK_PHASE.BAN && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-[var(--color-primary)] tracking-widest uppercase">
                  🚫 에이전트 밴 설정 (팀당 최대 2종 지정)
                </h3>
              </div>

              <div className="bg-[var(--color-base)] p-4 rounded-xl flex flex-col gap-4 border border-[var(--color-netural)]">
                <div className="flex gap-4">
                  {/* A선수 밴 */}
                  <div className="flex-1 bg-[var(--color-content)] p-3 rounded-lg border border-[var(--color-netural)] flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-[var(--color-secondary)]">선수 A 지정 밴</span>
                    <div className="flex gap-2">
                      {[0, 1].map(index => {
                        const id = session.A.banList[index]
                        return (
                          <div key={index} className="flex-1 bg-[var(--color-base)] p-2 rounded text-center text-xs font-bold text-[var(--color-ink)]/40 border border-[var(--color-netural)]/40">
                            {id ? <span className="text-[var(--color-tertiary)] font-black">{agentMap.get(id)?.nameKo}</span> : '비어있음'}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* B선수 밴 */}
                  <div className="flex-1 bg-[var(--color-content)] p-3 rounded-lg border border-[var(--color-netural)] flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-[var(--color-secondary)]">선수 B 지정 밴</span>
                    <div className="flex gap-2">
                      {[0, 1].map(index => {
                        const id = session.B.banList[index]
                        return (
                          <div key={index} className="flex-1 bg-[var(--color-base)] p-2 rounded text-center text-xs font-bold text-[var(--color-ink)]/40 border border-[var(--color-netural)]/40">
                            {id ? <span className="text-[var(--color-tertiary)] font-black">{agentMap.get(id)?.nameKo}</span> : '비어있음'}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* 밴할 캐릭터 선택 그리드 */}
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5 mt-2 max-h-80 overflow-y-auto pr-1">
                  {agentList.map(a => {
                    const isBannedByA = session.A.banList.includes(a.id)
                    const isBannedByB = session.B.banList.includes(a.id)
                    return (
                      <div
                        key={a.id}
                        className={`p-2 rounded-lg text-center cursor-pointer transition-all border ${
                          isBannedByA
                            ? 'bg-[var(--color-tertiary)]/20 border-[var(--color-tertiary)]'
                            : isBannedByB
                            ? 'bg-[var(--color-secondary)]/20 border-[var(--color-secondary)]'
                            : 'bg-[var(--color-content)] hover:bg-[var(--color-netural)] border-transparent'
                        }`}
                      >
                        <div className="text-xs font-black truncate text-[var(--color-ink)]">{a.nameKo}</div>
                        <div className="text-[9px] text-[var(--color-ink)]/30 mt-0.5">[{a.rarity}급]</div>
                        <div className="flex gap-1 justify-center mt-2.5">
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleBan(a.id, 'A'); }}
                            className={`flex-1 py-0.5 rounded text-[8px] font-black ${isBannedByA ? 'bg-[var(--color-tertiary)] text-[var(--color-base)]' : 'bg-[var(--color-base)] text-[var(--color-tertiary)]'}`}
                          >
                            A밴
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleBan(a.id, 'B'); }}
                            className={`flex-1 py-0.5 rounded text-[8px] font-black ${isBannedByB ? 'bg-[var(--color-secondary)] text-[var(--color-base)]' : 'bg-[var(--color-base)] text-[var(--color-secondary)]'}`}
                          >
                            B밴
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => updateSession((prev: PlaySession) => ({ ...prev, phase: BANPICK_PHASE.BOSS_SELECT }))}
                  className="bg-[var(--color-base)] text-[var(--color-ink)]/50 px-5 py-3 rounded-lg text-xs hover:text-[var(--color-ink)] font-bold transition-all border border-[var(--color-netural)]"
                >
                  보스 지정 단계로 돌아가기
                </button>
                <button
                  onClick={completeBan}
                  className="bg-[var(--color-secondary)] text-[var(--color-base)] py-3 px-6 rounded-lg font-black tracking-wider text-xs hover:opacity-95 shadow"
                >
                  밴 확정하고 파티 픽업 진입
                </button>
              </div>
            </div>
          )}

          {/* 3. 파티 픽업 보드 */}
          {session.phase === BANPICK_PHASE.PICK && (
            <div className="flex flex-col gap-4 animate-fadeIn">
              <h3 className="text-xs font-bold text-[var(--color-primary)] tracking-widest uppercase">
                🏹 라운드 파티 구성 조율
              </h3>

              {/* 양 선수 파티 배치 현황 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* A선수 파티 */}
                <div className="bg-[var(--color-base)] p-4 rounded-xl flex flex-col gap-3 border border-[var(--color-netural)]">
                  <span className="text-xs font-bold text-[var(--color-secondary)] border-b border-[var(--color-content)] pb-2 block">
                    🔴 선수 A (Side A) 파티 구성 슬롯
                  </span>

                  {/* 1라운드 */}
                  <div className="flex flex-col gap-1.5 bg-[var(--color-content)] p-3 rounded-lg border border-[var(--color-netural)]/35">
                    <span className="text-[10px] font-bold text-[var(--color-ink)]/50">1라운드 대원 (최대 3인)</span>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {[0, 1, 2].map(idx => {
                        const agentItem = session.A.party1.agents[idx]
                        return (
                          <div
                            key={idx}
                            onClick={() => agentItem && setSelectedAgentForEdit(agentItem.id)}
                            className={`p-2.5 rounded-lg text-center text-xs font-bold cursor-pointer transition-all border ${
                              agentItem
                                ? 'bg-[var(--color-base)] border-[var(--color-primary)]/20 hover:border-[var(--color-primary)]'
                                : 'bg-[var(--color-base)]/30 border-dashed border-[var(--color-netural)] text-[var(--color-ink)]/15'
                            }`}
                          >
                            {agentItem ? (
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[var(--color-primary)] font-black">{agentMap.get(agentItem.id)?.nameKo}</span>
                                <span className="text-[9px] text-[var(--color-ink)]/40">{agentItem.rate}돌파</span>
                                <span className="text-[9px] text-[var(--color-secondary)] font-mono">{agentItem.engineId ? `${engineMap.get(agentItem.engineId)?.nameKo.substring(0, 5)}..` : '무기 없음'}</span>
                              </div>
                            ) : (
                              '슬롯 비어있음'
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* 2라운드 */}
                  <div className="flex flex-col gap-1.5 bg-[var(--color-content)] p-3 rounded-lg border border-[var(--color-netural)]/35">
                    <span className="text-[10px] font-bold text-[var(--color-ink)]/50">2라운드 대원 (최대 3인)</span>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {[0, 1, 2].map(idx => {
                        const agentItem = session.A.party2.agents[idx]
                        return (
                          <div
                            key={idx}
                            onClick={() => agentItem && setSelectedAgentForEdit(agentItem.id)}
                            className={`p-2.5 rounded-lg text-center text-xs font-bold cursor-pointer transition-all border ${
                              agentItem
                                ? 'bg-[var(--color-base)] border-[var(--color-primary)]/20 hover:border-[var(--color-primary)]'
                                : 'bg-[var(--color-base)]/30 border-dashed border-[var(--color-netural)] text-[var(--color-ink)]/15'
                            }`}
                          >
                            {agentItem ? (
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[var(--color-primary)] font-black">{agentMap.get(agentItem.id)?.nameKo}</span>
                                <span className="text-[9px] text-[var(--color-ink)]/40">{agentItem.rate}돌파</span>
                                <span className="text-[9px] text-[var(--color-secondary)] font-mono">{agentItem.engineId ? `${engineMap.get(agentItem.engineId)?.nameKo.substring(0, 5)}..` : '무기 없음'}</span>
                              </div>
                            ) : (
                              '슬롯 비어있음'
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* B선수 파티 */}
                <div className="bg-[var(--color-base)] p-4 rounded-xl flex flex-col gap-3 border border-[var(--color-netural)]">
                  <span className="text-xs font-bold text-[var(--color-secondary)] border-b border-[var(--color-content)] pb-2 block">
                    🔵 선수 B (Side B) 파티 구성 슬롯
                  </span>

                  {/* 1라운드 */}
                  <div className="flex flex-col gap-1.5 bg-[var(--color-content)] p-3 rounded-lg border border-[var(--color-netural)]/35">
                    <span className="text-[10px] font-bold text-[var(--color-ink)]/50">1라운드 대원 (최대 3인)</span>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {[0, 1, 2].map(idx => {
                        const agentItem = session.B.party1.agents[idx]
                        return (
                          <div
                            key={idx}
                            onClick={() => agentItem && setSelectedAgentForEdit(agentItem.id)}
                            className={`p-2.5 rounded-lg text-center text-xs font-bold cursor-pointer transition-all border ${
                              agentItem
                                ? 'bg-[var(--color-base)] border-[var(--color-primary)]/20 hover:border-[var(--color-primary)]'
                                : 'bg-[var(--color-base)]/30 border-dashed border-[var(--color-netural)] text-[var(--color-ink)]/15'
                            }`}
                          >
                            {agentItem ? (
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[var(--color-primary)] font-black">{agentMap.get(agentItem.id)?.nameKo}</span>
                                <span className="text-[9px] text-[var(--color-ink)]/40">{agentItem.rate}돌파</span>
                                <span className="text-[9px] text-[var(--color-secondary)] font-mono">{agentItem.engineId ? `${engineMap.get(agentItem.engineId)?.nameKo.substring(0, 5)}..` : '무기 없음'}</span>
                              </div>
                            ) : (
                              '슬롯 비어있음'
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* 2라운드 */}
                  <div className="flex flex-col gap-1.5 bg-[var(--color-content)] p-3 rounded-lg border border-[var(--color-netural)]/35">
                    <span className="text-[10px] font-bold text-[var(--color-ink)]/50">2라운드 대원 (최대 3인)</span>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {[0, 1, 2].map(idx => {
                        const agentItem = session.B.party2.agents[idx]
                        return (
                          <div
                            key={idx}
                            onClick={() => agentItem && setSelectedAgentForEdit(agentItem.id)}
                            className={`p-2.5 rounded-lg text-center text-xs font-bold cursor-pointer transition-all border ${
                              agentItem
                                ? 'bg-[var(--color-base)] border-[var(--color-primary)]/20 hover:border-[var(--color-primary)]'
                                : 'bg-[var(--color-base)]/30 border-dashed border-[var(--color-netural)] text-[var(--color-ink)]/15'
                            }`}
                          >
                            {agentItem ? (
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[var(--color-primary)] font-black">{agentMap.get(agentItem.id)?.nameKo}</span>
                                <span className="text-[9px] text-[var(--color-ink)]/40">{agentItem.rate}돌파</span>
                                <span className="text-[9px] text-[var(--color-secondary)] font-mono">{agentItem.engineId ? `${engineMap.get(agentItem.engineId)?.nameKo.substring(0, 5)}..` : '무기 없음'}</span>
                              </div>
                            ) : (
                              '슬롯 비어있음'
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                </div>
              </div>

              {/* 에이전트 선택 그리드 */}
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold text-[var(--color-ink)]/45">
                  배치 가능한 에이전트 (선수별 라운드별 버튼을 눌러 지정합니다.)
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
                  {agentList.map(a => {
                    const isBanned = session.activeTab !== GAME_TYPE.UNLIMITED && (session.A.banList.includes(a.id) || session.B.banList.includes(a.id))
                    return (
                      <div
                        key={a.id}
                        className={`p-2 rounded-lg text-center border relative transition-all ${
                          isBanned
                            ? 'bg-[var(--color-disabled)]/5 border-dashed border-[var(--color-netural)] opacity-25 cursor-not-allowed'
                            : 'bg-[var(--color-content)] border-transparent hover:border-[var(--color-netural)]/50'
                        }`}
                      >
                        <div className={`text-xs font-black truncate ${isBanned ? 'line-through text-[var(--color-tertiary)]' : 'text-[var(--color-ink)]'}`}>
                          {a.nameKo}
                        </div>
                        <div className="text-[9px] text-[var(--color-ink)]/30 mt-0.5">[{a.rarity}급]</div>
                        
                        {!isBanned && (
                          <div className="grid grid-cols-2 gap-1 mt-2.5">
                            <button
                              onClick={() => toggleAgentPick(a.id, 'A', 1)}
                              className={`py-0.5 rounded text-[8px] font-black ${session.A.party1.agents.some((i: { id: number }) => i.id === a.id) ? 'bg-[var(--color-primary)] text-[var(--color-base)]' : 'bg-[var(--color-base)] text-[var(--color-ink)]/70 hover:text-[var(--color-primary)]'}`}
                            >
                              A 1R
                            </button>
                            <button
                              onClick={() => toggleAgentPick(a.id, 'A', 2)}
                              className={`py-0.5 rounded text-[8px] font-black ${session.A.party2.agents.some((i: { id: number }) => i.id === a.id) ? 'bg-[var(--color-primary)] text-[var(--color-base)]' : 'bg-[var(--color-base)] text-[var(--color-ink)]/70 hover:text-[var(--color-primary)]'}`}
                            >
                              A 2R
                            </button>
                            <button
                              onClick={() => toggleAgentPick(a.id, 'B', 1)}
                              className={`py-0.5 rounded text-[8px] font-black ${session.B.party1.agents.some((i: { id: number }) => i.id === a.id) ? 'bg-[var(--color-secondary)] text-[var(--color-base)]' : 'bg-[var(--color-base)] text-[var(--color-ink)]/70 hover:text-[var(--color-secondary)]'}`}
                            >
                              B 1R
                            </button>
                            <button
                              onClick={() => toggleAgentPick(a.id, 'B', 2)}
                              className={`py-0.5 rounded text-[8px] font-black ${session.B.party2.agents.some((i: { id: number }) => i.id === a.id) ? 'bg-[var(--color-secondary)] text-[var(--color-base)]' : 'bg-[var(--color-base)] text-[var(--color-ink)]/70 hover:text-[var(--color-secondary)]'}`}
                            >
                              B 2R
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
 
              {/* 완료 버튼 */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => updateSession((prev: PlaySession) => ({
                    ...prev,
                    phase: prev.activeTab === GAME_TYPE.UNLIMITED ? BANPICK_PHASE.BOSS_SELECT : BANPICK_PHASE.BAN
                  }))}
                  className="bg-[var(--color-base)] text-[var(--color-ink)]/50 px-5 py-3 rounded-lg text-xs hover:text-[var(--color-ink)] font-bold transition-all border border-[var(--color-netural)]"
                >
                  이전 단계로 백
                </button>
                
                <button
                  onClick={() => {
                    updateSession((prev: PlaySession) => ({ ...prev, phase: BANPICK_PHASE.DONE }))
                    setToastMessage('🎉 v2 시뮬레이션 매치 밴픽 최종 완료 상태가 저장되었습니다!')
                    setTimeout(() => setToastMessage(null), 3500)
                  }}
                  className="bg-[var(--color-primary)] text-[var(--color-base)] py-3 px-8 rounded-lg font-black tracking-wider text-xs hover:opacity-95 shadow shadow-[var(--color-primary)]/20"
                >
                  밴픽 최종 승인 & 완료
                </button>
              </div>
            </div>
          )}
 
          {/* 4. 완료 화면 */}
          {session.phase === BANPICK_PHASE.DONE && (
            <div className="flex flex-col gap-6 items-center justify-center py-16 bg-[var(--color-base)] rounded-2xl relative overflow-hidden border border-[var(--color-netural)]">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-tertiary)]" />
 
              <span className="text-6xl animate-bounce">🏆</span>
              <h2 className="text-2xl font-black text-[var(--color-primary)] tracking-widest mt-3">
                MATCH CONFIGURATION SUCCESS
              </h2>
              <p className="text-xs text-[var(--color-ink)]/40 -mt-2">
                지능형 탭 스위칭 밴픽 시뮬레이션 완료! 최종 상태 패킷이 세션 브릿지에 안전하게 영구 저장되었습니다.
              </p>
 
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    updateSession((prev: PlaySession) => ({
                      ...prev,
                      phase: BANPICK_PHASE.BOSS_SELECT,
                      commonBossId: null,
                      A: { nickname: prev.A.nickname, party1: DEFAULT_PARTY(), party2: DEFAULT_PARTY(), banList: [], submitted: false },
                      B: { nickname: prev.B.nickname, party1: DEFAULT_PARTY(), party2: DEFAULT_PARTY(), banList: [], submitted: false }
                    }))
                  }}
                  className="bg-[var(--color-content)] text-[var(--color-ink)] py-3 px-6 rounded-lg font-extrabold text-xs hover:bg-[var(--color-netural)] border border-[var(--color-netural)]/50 transition-all"
                >
                  🔄 새로운 시뮬레이션 매치 리셋
                </button>
              </div>
            </div>
          )}
 
        </div>
 
      </div>
    </div>
  )
}

export default V2Playground
