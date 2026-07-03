import type { HoyolabSyncPayload } from '../types/hoyolab';

const SYNC_KEY = 'hoyolab:sync' as const;

export async function getSyncPayload(): Promise<HoyolabSyncPayload | null> {
  const result = await chrome.storage.local.get(SYNC_KEY);
  return (result[SYNC_KEY] as HoyolabSyncPayload | undefined) ?? null;
}

export async function setSyncPayload(payload: HoyolabSyncPayload): Promise<void> {
  await chrome.storage.local.set({ [SYNC_KEY]: payload });
}

export async function clearAll(): Promise<void> {
  await chrome.storage.local.remove(SYNC_KEY);
}
