/** 호요랩 계정·세션 상태 */
export type HoyolabAuthState = {
  isLoggedIn: boolean;
  uid?: string;
  nickname?: string;
  avatarUrl?: string;
  cookieToken?: string;
  lastSyncedAt?: string;
};

/** 육성가이드에서 가져온 에이전트 스냅샷 (초기 스키마) */
export type HoyolabAgentSnapshot = {
  hoyolabId: string;
  name: string;
  level: number;
  rank: number;
  /** 돌파 단계 */
  promotion: number;
  /** 코어 스킬 레벨 등 — API 연동 시 확장 */
  skills?: Record<string, number>;
  syncedAt: string;
};

export type HoyolabSyncPayload = {
  auth: HoyolabAuthState;
  agents: HoyolabAgentSnapshot[];
};
