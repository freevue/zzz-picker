import { useState, useEffect, useCallback } from 'react'

// 경기 타입 정의
export enum GAME_TYPE {
  ORIGINAL = 'original',
  LEGEND = 'legend',
  UNLIMITED = 'unlimited'
}

// 밴픽 단계 상세 정의
export enum BANPICK_PHASE {
  BOSS_SELECT = 'BOSS_SELECT',
  BAN = 'BAN',
  PICK = 'PICK',
  DONE = 'DONE'
}

// 1개 파티의 보스 및 캐릭터/엔진 세펙 정보
export type Party = {
  agents: Array<{ id: number; rate: number; engineId: number | null; engineRate: number }>
  bossId: number | null
}

// v2 전체 경기 상태를 동기화하기 위한 세션 스키마
export type PlaySession = {
  roomId: string
  activeTab: GAME_TYPE
  phase: BANPICK_PHASE
  commonBossId: number | null
  A: {
    nickname: string
    party1: Party
    party2: Party
    banList: number[]
    submitted: boolean // 선수가 본인의 파티 구성을 최종 제출했는지 여부
  }
  B: {
    nickname: string
    party1: Party
    party2: Party
    banList: number[]
    submitted: boolean
  }
  updatedAt: number
}

// 기본 파티 구조 생성 팩토리
export const DEFAULT_PARTY = (): Party => ({
  agents: [],
  bossId: null
})

// 기본 빈 세션 생성 팩토리
export const DEFAULT_SESSION = (roomId: string): PlaySession => ({
  roomId,
  activeTab: GAME_TYPE.ORIGINAL,
  phase: BANPICK_PHASE.BOSS_SELECT,
  commonBossId: null,
  A: { nickname: '', party1: DEFAULT_PARTY(), party2: DEFAULT_PARTY(), banList: [], submitted: false },
  B: { nickname: '', party1: DEFAULT_PARTY(), party2: DEFAULT_PARTY(), banList: [], submitted: false },
  updatedAt: Date.now()
})

/**
 * BroadcastChannel API 및 LocalStorage 캐시를 조합한 가상 실시간 세션 동기화 커스텀 훅
 * @param roomId 세션 고유 방 ID
 * @param initialSession 초기 상태 세션 객체
 */
export const useV2Sync = (roomId: string, initialSession: PlaySession) => {
  const [session, setSession] = useState<PlaySession>(initialSession)

  // 1. 최초 진입 시 LocalStorage 캐시 복구 (콜드 스타트 지원)
  useEffect(() => {
    if (!roomId) return
    const key = `v2-session-${roomId}`
    const cached = localStorage.getItem(key)
    if (cached) {
      try {
        setSession(JSON.parse(cached))
      } catch (e) {
        console.error('[V2 Bridge] 로컬 캐시 복구 실패:', e)
      }
    }
  }, [roomId])

  // 2. BroadcastChannel 구독을 통한 실시간 초고속 동기화 (1ms 이내 렌더링)
  useEffect(() => {
    if (!roomId) return
    
    // 채널 생성
    const channel = new BroadcastChannel(`v2-room-${roomId}`)
    
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SYNC_SESSION') {
        setSession(event.data.payload)
      }
    }
    
    channel.addEventListener('message', handleMessage)
    
    return () => {
      channel.removeEventListener('message', handleMessage)
      channel.close()
    }
  }, [roomId])

  // 3. 경기 상태 업데이트 및 전체 구독 탭 전파 함수
  const updateSession = useCallback((newSessionOrFn: PlaySession | ((prev: PlaySession) => PlaySession)) => {
    setSession(prev => {
      const next = typeof newSessionOrFn === 'function' ? newSessionOrFn(prev) : newSessionOrFn
      const updated = { ...next, updatedAt: Date.now() }
      
      if (roomId) {
        const key = `v2-session-${roomId}`
        // LocalStorage 저장
        localStorage.setItem(key, JSON.stringify(updated))
        
        // BroadcastChannel 브로드캐스트 전송
        const channel = new BroadcastChannel(`v2-room-${roomId}`)
        channel.postMessage({ type: 'SYNC_SESSION', payload: updated })
        channel.close()
      }
      return updated
    })
  }, [roomId])

  return [session, updateSession] as const
}
