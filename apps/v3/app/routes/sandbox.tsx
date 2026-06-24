import React, { useState, useEffect, useMemo } from 'react'
import { useStore } from '@zzz-picker/provider/hooks'
import { CostIndicator, ScoreInput, TimeInput, Tabs, Heading, Body, AgentGrid, BanIndicator, Button } from '@zzz-picker/zpds'
import { calculateOriginalScore, calculateLegendScore, calculateUnlimitedScore } from '@zzz-picker/utils'

export default function Index() {
  const { agents, boss } = useStore()
  
  // 1. 경기 모드 및 세션 상태
  const [activeTab, setActiveTab] = useState<'original' | 'legend' | 'unlimited'>('original')
  const [score, setScore] = useState(3000)
  const [time, setTime] = useState({ min: 1, sec: 20, ms: 0 })
  
  // 2. 조작 시뮬레이터 모드 ('pickA' | 'pickB' | 'banA' | 'banB')
  const [controlMode, setControlMode] = useState<'pickA' | 'pickB' | 'banA' | 'banB'>('pickA')
  
  // 3. 밴픽 데이터 상태
  const [banListA, setBanListA] = useState<number[]>([])
  const [banListB, setBanListB] = useState<number[]>([])
  const [pickListA, setPickListA] = useState<number[]>([])
  const [pickListB, setPickListB] = useState<number[]>([])
  
  // 4. 모의 채팅 데이터
  const [chatInput, setChatInput] = useState('')
  const [chats, setChats] = useState([
    { id: 1, sender: '로프꾼_Z', message: '오 V3 디자인 장난 아닌데요?! 네온 핑크 대박', time: '20:53' },
    { id: 2, sender: '강습전빌런', message: '정식 로프꾼 코스트 제한 24 지켜야 제출됩니다 ㅋㅋ', time: '20:54' },
    { id: 3, sender: 'ZZZ매니아', message: 'B선수 밴픽 전략 날카롭네요. 주연 바로 차단당함', time: '20:54' },
    { id: 4, sender: '시청자A', message: '시간 보너스 333점 기입하면 스코어 확 튀네요', time: '20:55' },
  ])

  // 5. 실제 DB 데이터 매핑
  const agentList = useMemo(() => {
    if (!agents) return []
    return Array.from(agents.values()).map((a: any) => ({
      id: Number(a.id),
      attribute: a.attributes?.nameKo,
      specialty: a.specialty?.nameKo,
      nameKo: a.nameKo
    }))
  }, [agents])

  // 6. 스마트 픽 배제 (Smart Eviction) 규칙 실시간 적용
  useEffect(() => {
    const allBans = [...banListA, ...banListB]
    setPickListA(prev => prev.filter(id => !allBans.includes(id)))
    setPickListB(prev => prev.filter(id => !allBans.includes(id)))
  }, [banListA, banListB])

  // 7. 캐릭터 그리드 클릭 핸들러
  const handleAgentSelect = (id: number) => {
    const numId = Number(id)
    const allBans = [...banListA, ...banListB]

    if (controlMode === 'banA') {
      setBanListA(prev => prev.includes(numId) ? prev.filter(x => x !== numId) : [...prev, numId])
    } else if (controlMode === 'banB') {
      setBanListB(prev => prev.includes(numId) ? prev.filter(x => x !== numId) : [...prev, numId])
    } else if (controlMode === 'pickA') {
      if (allBans.includes(numId)) return // 밴당한 경우 픽 불가
      setPickListA(prev => prev.includes(numId) ? prev.filter(x => x !== numId) : [...prev, numId])
    } else if (controlMode === 'pickB') {
      if (allBans.includes(numId)) return // 밴당한 경우 픽 불가
      setPickListB(prev => prev.includes(numId) ? prev.filter(x => x !== numId) : [...prev, numId])
    }
  }

  // 8. 코스트 및 점수 연산
  const costA = useMemo(() => {
    // 샌드박스 편의상 픽된 갯수당 임의 8코스트 부여 가중치 계산
    return pickListA.length * 8
  }, [pickListA])

  const elapsedSeconds = time.min * 60 + time.sec

  const finalScore = useMemo(() => {
    switch (activeTab) {
      case 'original':
        return calculateOriginalScore(score, elapsedSeconds, costA)
      case 'legend':
        return calculateLegendScore(score, elapsedSeconds)
      case 'unlimited':
        return calculateUnlimitedScore(score, elapsedSeconds)
      default:
        return score
    }
  }, [activeTab, score, elapsedSeconds, costA])

  // 9. 모의 채팅 전송
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    setChats(prev => [...prev, {
      id: Date.now(),
      sender: '호스트_나',
      message: chatInput.trim(),
      time: timeStr
    }])
    setChatInput('')
  }

  return (
    <div className="w-full min-h-screen bg-[var(--color-base)] text-[var(--color-ink)] p-4 sm:p-6 font-sans select-none flex flex-col gap-6">
      
      {/* 타이틀 헤더 */}
      <div className="w-full bg-[var(--color-content)] rounded-2xl p-5 border border-[var(--color-netural)]/60 shadow-[var(--v3-border-glow)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-[var(--color-primary)]/5 to-transparent skew-x-12 pointer-events-none" />
        <div className="flex flex-col gap-1">
          <Heading level="3xl" className="text-[var(--color-primary)] flex items-center gap-2.5">
            <span>ZZZ-PICKER v3</span>
            <span className="text-xs bg-[var(--color-netural)] px-3 py-1 rounded text-[var(--color-secondary)] font-bold tracking-widest border border-[var(--color-secondary)]/20">
              SANDBOX SIMULATOR
            </span>
          </Heading>
          <Body size="sm" className="text-[var(--color-ink)]/50">
            좌측 방송/채팅 화면과 우측 A-Z 수동 밴픽 조작 및 실시간 코스트/점수 계산 시스템 검증
          </Body>
        </div>
      </div>

      {/* 대칭 2열 레이아웃 */}
      <div className="w-full flex flex-col xl:flex-row gap-6 flex-1">
        
        {/* ================= 좌측 열: 스트리머 방송화면 및 채팅 ================= */}
        <div className="w-full xl:w-[38%] flex flex-col gap-6">
          
          {/* 가상 BJ 방송 플레이어 영역 */}
          <div className="bg-[var(--color-content)] rounded-2xl p-4 border border-[var(--color-netural)]/60 shadow-[var(--v3-border-glow)] flex flex-col gap-3">
            <span className="text-[10px] font-black text-[var(--color-secondary)] tracking-wider uppercase flex items-center gap-1.5">
              <span className="size-2 bg-[var(--color-primary)] rounded-full animate-ping" />
              LIVE BROADCAST (OBS VIEW)
            </span>
            
            {/* 16:9 가상 비디오 스크린 */}
            <div className="relative w-full aspect-video rounded-xl bg-[#030508] border border-[var(--color-netural)] flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
              
              {/* 중계 스크린 정보 래핑 */}
              <div className="text-center flex flex-col gap-2 z-10">
                <span className="text-xs font-black text-[var(--color-primary)] tracking-widest animate-pulse">
                  [ 2열 중계 스크린 활성화 ]
                </span>
                <span className="text-[10px] text-[var(--color-ink)]/30 font-bold">
                  RESOLUTION: 1920 X 1080 | 60 FPS
                </span>
              </div>

              {/* 우측 하단 스트리머 캠 플레이스홀더 */}
              <div className="absolute bottom-3 right-3 w-28 aspect-video bg-[var(--color-content)] border border-[var(--color-secondary)]/30 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-[8px] font-black text-[var(--color-secondary)]">STREAMER CAM</span>
              </div>
            </div>
          </div>

          {/* 실시간 채팅 위젯 */}
          <div className="bg-[var(--color-content)] rounded-2xl p-4.5 border border-[var(--color-netural)]/60 flex flex-col gap-3.5 flex-1 min-h-[300px]">
            <span className="text-[10px] font-black text-[var(--color-ink)]/50 tracking-wider uppercase border-b border-[var(--color-netural)] pb-2">
              💬 방송 실시간 중계 대화방
            </span>
            
            {/* 채팅 타임라인 */}
            <div className="flex-1 overflow-y-auto max-h-[320px] flex flex-col gap-3 pr-2 scrollbar-hidden">
              {chats.map((chat) => (
                <div key={chat.id} className="flex flex-col gap-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className={`font-black ${
                      chat.sender.startsWith('호스트') 
                        ? 'text-[var(--color-primary)]' 
                        : 'text-[var(--color-secondary)]'
                    }`}>
                      {chat.sender}
                    </span>
                    <span className="text-[9px] text-[var(--color-ink)]/20 font-mono font-bold">{chat.time}</span>
                  </div>
                  <p className="text-[var(--color-ink)]/80 leading-relaxed bg-[var(--color-base)]/30 px-3 py-1.5 rounded-lg border border-[var(--color-netural)]/30">
                    {chat.message}
                  </p>
                </div>
              ))}
            </div>

            {/* 채팅 전송 폼 */}
            <form onSubmit={handleSendChat} className="flex gap-2">
              <input
                type="text"
                placeholder="채팅 메시지를 기입하십시오..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
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

        </div>

        {/* ================= 우측 열: 밴픽 제어 및 시뮬레이터 ================= */}
        <div className="w-full xl:w-[62%] bg-[var(--color-content)] rounded-2xl p-5 border border-[var(--color-netural)]/60 shadow-[var(--v3-border-glow)] flex flex-col gap-6">
          
          {/* 상단 밴 현황판 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BanIndicator banList={banListA} side="A" label="A팀 밴 지정 캐릭터" />
            <BanIndicator banList={banListB} side="B" label="B팀 밴 지정 캐릭터" />
          </div>

          {/* 경기 모드 탭 및 코스트/점수 스코어 보드 */}
          <div className="bg-[var(--color-base)]/50 p-4.5 rounded-xl border border-[var(--color-netural)] flex flex-col gap-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="w-full sm:w-[240px]">
                <Tabs
                  value={activeTab}
                  onChange={(v) => setActiveTab(v as any)}
                  list={[
                    { value: 'original', label: '정식 (24C)' },
                    { value: 'legend', label: '레전드 (무제)' },
                    { value: 'unlimited', label: '공허 (무제)' }
                  ]}
                />
              </div>
              <div className="flex items-center gap-3 bg-[var(--color-base)] px-4 py-2 rounded-lg border border-[var(--color-netural)] font-mono text-xs">
                <span className="text-[var(--color-ink)]/30 font-bold">최종 연산 스코어:</span>
                <span className="text-[var(--color-secondary)] font-black text-sm">{finalScore.toLocaleString()}점</span>
              </div>
            </div>

            {/* 정식 로프꾼 코스트 지표 */}
            {activeTab === 'original' && (
              <CostIndicator currentCost={costA} maxCost={24} label="선수 A 파티 실시간 코스트" />
            )}
          </div>

          {/* A-Z 조작 모드 셀렉터 */}
          <div className="flex flex-col gap-2.5 bg-[var(--color-base)]/30 p-4 rounded-xl border border-[var(--color-netural)]/50">
            <span className="text-[10px] font-black text-[var(--color-ink)]/40 tracking-wider uppercase">
              🕹️ 수동 시뮬레이터 조작 모드 (그리드 클릭 액션 제어)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Button
                variant={controlMode === 'pickA' ? 'primary' : 'neutral'}
                size="sm"
                onClick={() => setControlMode('pickA')}
              >
                🔵 A팀 캐릭터 픽 (선택)
              </Button>
              <Button
                variant={controlMode === 'pickB' ? 'secondary' : 'neutral'}
                size="sm"
                onClick={() => setControlMode('pickB')}
              >
                🟢 B팀 캐릭터 픽 (선택)
              </Button>
              <Button
                variant={controlMode === 'banA' ? 'neutral' : 'neutral'}
                className={controlMode === 'banA' ? 'border-[var(--color-tertiary)]! text-[var(--color-tertiary)]!' : ''}
                size="sm"
                onClick={() => setControlMode('banA')}
              >
                🚫 A팀 밴 등록
              </Button>
              <Button
                variant={controlMode === 'banB' ? 'neutral' : 'neutral'}
                className={controlMode === 'banB' ? 'border-[var(--color-tertiary)]! text-[var(--color-tertiary)]!' : ''}
                size="sm"
                onClick={() => setControlMode('banB')}
              >
                🚫 B팀 밴 등록
              </Button>
            </div>
            
            <span className="text-[9px] text-[var(--color-ink)]/50 font-semibold leading-relaxed mt-1 flex items-center gap-1.5">
              <span>💡</span>
              {controlMode === 'pickA' && '조작 팁: 아래 에이전트 목록을 클릭하면 [선수 A]의 파티 리스트에 캐릭터를 추가/해제합니다.'}
              {controlMode === 'pickB' && '조작 팁: 아래 에이전트 목록을 클릭하면 [선수 B]의 파티 리스트에 캐릭터를 추가/해제합니다.'}
              {controlMode === 'banA' && '조작 팁: 에이전트를 클릭하면 [A팀 밴]에 추가/해제되며, 해당 캐릭터는 기존 픽 리스트에서 즉각 자동 퇴출(Smart Eviction)됩니다.'}
              {controlMode === 'banB' && '조작 팁: 에이전트를 클릭하면 [B팀 밴]에 추가/해제되며, 해당 캐릭터는 기존 픽 리스트에서 즉각 자동 퇴출(Smart Eviction)됩니다.'}
            </span>
          </div>

          {/* 에이전트 밴픽 전수 선택 그리드 */}
          <div className="flex-1 flex flex-col gap-2.5">
            <span className="text-[10px] font-black text-[var(--color-ink)]/40 tracking-wider uppercase">
              👥 전체 에이전트 리스트업 (클릭하여 밴/픽 조작)
            </span>
            {agentList.length > 0 ? (
              <AgentGrid
                agents={agentList}
                banList={[...banListA, ...banListB]}
                pickList={[...pickListA, ...pickListB]}
                activeId={null}
                onSelect={handleAgentSelect}
                className="flex-1"
              />
            ) : (
              <div className="text-center py-16 text-xs text-[var(--color-ink)]/30 font-semibold bg-[var(--color-base)]/40 rounded-2xl border border-[var(--color-netural)]">
                Supabase로부터 에이전트 리스트 데이터를 로딩 중입니다...
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}
