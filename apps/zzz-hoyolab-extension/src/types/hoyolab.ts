/** 육성가이드에서 가져온 에이전트 스냅샷 (최소 필드) */
export type HoyolabAgentSnapshot = {
  id: string;
  name: string;
  level: number;
  rank: number;
  /** 돌파 단계 */
  promotion: number;
  syncedAt: string;
};

/** 동기화 시 수집하는 최소 데이터: 닉네임 + 캐릭터/장비 스냅샷 */
export type HoyolabSyncPayload = {
  nickname: string;
  agents: HoyolabAgentSnapshot[];
  syncedAt: string;
};

/** 페이지 컨텍스트 fetch 결과 (쿠키 권한 없이 same-origin 요청) */
export type HoyolabPageCollectResult = {
  nickname: string;
  agents: Omit<HoyolabAgentSnapshot, 'syncedAt'>[];
};
