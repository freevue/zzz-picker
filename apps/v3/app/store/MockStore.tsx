import { MOCK_AGENT_MAP, MOCK_BOSS_MAP, MOCK_ENGINE_MAP } from '../data/mock'
import { StoreContext } from '@zzz-picker/provider'
import React, { useMemo } from 'react'

type StoreValue = React.ComponentProps<typeof StoreContext.Provider>['value']

/**
 * 운영용 Store(Supabase fetch) 대신 mock 데이터를 주입하는 V3 전용 프로바이더.
 * zpds 컴포넌트(AgentCard, BanIndicator 등)가 useAgent/useEngine 으로 읽는
 * StoreContext 를 mock Map 으로 채워, Supabase 연동 없이 화면을 검증합니다.
 */
export const MockStore: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useMemo<StoreValue>(
    () => ({
      agents: MOCK_AGENT_MAP,
      engines: MOCK_ENGINE_MAP,
      boss: MOCK_BOSS_MAP,
      deadlyAssaultList: [],
      save: async () => {},
      authCheck: async () => false,
      getHistory: async () => [],
      getAuthKey: async () => [],
      getAuthKeyList: async () => [],
    }),
    []
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export default MockStore
