import { MOCK_BOSS_DATA } from '../mocks/bossData'
import type { Boss, DeadlyAssault } from '@zzz-picker/constant'
import { SocketContext, StoreContext } from '@zzz-picker/provider'
import dayjs from 'dayjs'
import React, { useMemo } from 'react'

// Mock Socket Provider
export const MockSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mockContext = {
    socket: null,
    isConnected: true,
    send: (event: string, data: any) => {
      console.log(`[MockSocket] Event: ${event}`, data)
    },
    on: () => {},
    off: () => {},
  } as any

  return <SocketContext.Provider value={mockContext}>{children}</SocketContext.Provider>
}

// Mock Store Provider
export const MockStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const bossMap = useMemo(() => {
    const map = new Map<number, Boss>()
    MOCK_BOSS_DATA.forEach((boss) => map.set(boss.id, boss as any))
    return map
  }, [])

  // 랜덤하게 3개의 보스 선택하여 DeadlyAssault 구성
  const deadlyAssaultList = useMemo(() => {
    // 배열 복사 후 섞기
    const shuffled = [...MOCK_BOSS_DATA].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, 3)

    // DeadlyAssault 타입에 맞게 데이터 구성 (필수 필드만 채움)
    const mockAssault: any = {
      id: 1,
      nameKo: 'Mock Assault',
      open: dayjs(), // 현재 시간
      boss1: selected[0] || MOCK_BOSS_DATA[0],
      boss2: selected[1] || MOCK_BOSS_DATA[1],
      boss3: selected[2] || MOCK_BOSS_DATA[2],
    }

    return [mockAssault]
  }, [])

  const mockContext = {
    agents: new Map(),
    boss: bossMap,
    engines: new Map(),
    deadlyAssaultList: deadlyAssaultList,
    save: async () => {},
    authCheck: async () => false,
    getHistory: async () => [],
    getAuthKey: async () => [],
    getAuthKeyList: async () => [],
  } as any

  return <StoreContext.Provider value={mockContext}>{children}</StoreContext.Provider>
}

// Layout Decorator
export const LayoutDecorator = (Story: React.ComponentType) => (
  <div className="w-full h-screen bg-[#1a202c] text-white overflow-y-auto relative p-4">
    <Story />
  </div>
)
