import type { HoyolabAuthState, HoyolabSyncPayload } from '../types/hoyolab';

const KEYS = {
  auth: 'hoyolab:auth',
  sync: 'hoyolab:sync',
} as const;

export async function getAuthState(): Promise<HoyolabAuthState> {
  const result = await chrome.storage.local.get(KEYS.auth);
  return (result[KEYS.auth] as HoyolabAuthState | undefined) ?? { isLoggedIn: false };
}

export async function setAuthState(auth: HoyolabAuthState): Promise<void> {
  await chrome.storage.local.set({ [KEYS.auth]: auth });
}

export async function getSyncPayload(): Promise<HoyolabSyncPayload | null> {
  const result = await chrome.storage.local.get(KEYS.sync);
  return (result[KEYS.sync] as HoyolabSyncPayload | undefined) ?? null;
}

export async function setSyncPayload(payload: HoyolabSyncPayload): Promise<void> {
  await chrome.storage.local.set({ [KEYS.sync]: payload });
}

export async function clearAll(): Promise<void> {
  await chrome.storage.local.remove([KEYS.auth, KEYS.sync]);
}
